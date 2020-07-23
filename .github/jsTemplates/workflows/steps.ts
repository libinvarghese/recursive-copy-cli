// eslint-disable-next-line @typescript-eslint/no-var-requires, node/no-unpublished-require
const pascalCase = require('pascalcase');

export const checkout = {
  uses: 'actions/checkout@v2',
};

export const setupNodeStrategy = {
  name: 'Use Node.js ${{ matrix.node-version }}',
  uses: 'actions/setup-node@v2.1.0',
  with: {
    'node-version': '${{ matrix.node-version }}',
  },
};

export const setupNode12x = {
  name: 'Use Node.js 12.x',
  uses: 'actions/setup-node@v2.1.0',
  with: {
    'node-version': '12.x',
  },
};

export const defaultNodeProjectSteps = [
  {
    name: 'Get npm cache directory',
    id: 'get-npm-cache',
    run: 'echo "::set-output name=dir::$(npm config get cache)"\n',
  },
  {
    name: 'Cache Node.js modules',
    uses: 'actions/cache@v2',
    env: {
      'cache-name': 'cache-node-modules',
    },
    with: {
      path: '${{ steps.get-npm-cache.outputs.dir }}',
      key: "${{ runner.OS }}-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}",
      'restore-keys': '${{ runner.OS }}-${{ env.cache-name }}-\n${{ runner.OS }}-\n',
    },
  },
  {
    name: 'Cache Project node_modules',
    uses: 'actions/cache@v2',
    id: 'cache-project-node-modules',
    env: {
      'cache-name': 'cache-project-node-modules',
    },
    with: {
      path: 'node_modules',
      key: "${{ runner.OS }}-${{ env.cache-name }}-${{ github.repository }}-${{ hashFiles('**/package-lock.json') }}",
    },
  },
  {
    name: 'Install Dependencies',
    if: "steps.cache-project-node-modules.outputs.cache-hit != 'true'",
    run: 'npm ci',
  },
];

export const setupPipDependenciesSteps = [
  {
    name: 'Set up Python 3.8',
    uses: 'actions/setup-python@v2',
    with: {
      'python-version': '3.x',
    },
  },
  {
    name: 'Get pip cache directory',
    id: 'get-pip-cache',
    run: 'echo "::set-output name=dir::$(pip cache dir)"\n',
  },
  {
    name: 'Cache pip',
    uses: 'actions/cache@v2',
    id: 'cache-pip',
    env: {
      'cache-name': 'cache-pip',
    },
    with: {
      path: '${{ steps.get-pip-cache.outputs.dir }}',
      key: "${{ runner.os }}-${{ env.cache-name }}-${{ hashFiles('requirements.txt') }}",
      'restore-keys': '${{ runner.os }}-${{ env.cache-name }}-\n${{ runner.os }}-\n',
    },
  },
  {
    name: 'Install dependencies',
    run: 'python -m pip install --upgrade pip\npip install -r requirements.txt\n',
  },
];

export const build = {
  run: 'npm run build',
  env: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    NODE_ENV: 'production',
  },
};

export const lint = {
  run: 'npm run lint',
};

export const coverage = {
  run: 'npm run cover',
  env: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CHECK_COVERAGE: true,
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function waitForCheckName(checkName: string): any[] {
  const stepId = `wait-for-${pascalCase(checkName)}`;
  return [
    {
      name: `Wait for ${checkName}`,
      uses: 'fountainhead/action-wait-for-check@v1.0.0',
      id: stepId,
      with: {
        token: '${{ secrets.REPO_ACCESS }}',
        checkName: `${checkName}`,
        ref: '${{ github.event.pull_request.head.sha || github.sha }}',
        timeoutSeconds: 180,
      },
    },
    {
      name: `Exit when ${checkName} workflow has failed`,
      if: `steps.${stepId}.outputs.conclusion != 'success' && steps.${stepId}.outputs.conclusion != 'timed_out'`,
      run: 'exit 1\n',
    },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dumpContext(name: string, simpleName: string | undefined = undefined): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env: any = {};
  const contextName = simpleName ? simpleName.toUpperCase() : name.toUpperCase();
  const envVar = `${contextName}_CONTEXT`;

  env[envVar] = `\${{ toJson(${name}) }}`;
  return {
    name: `Dump ${name} context`,
    env,
    run: `echo "$${envVar}"`,
  };
}
