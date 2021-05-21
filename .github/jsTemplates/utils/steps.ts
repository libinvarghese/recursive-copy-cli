import { developBranch, productionBranch } from './constants';
import { DEPENDENCIES } from './dependencies';
// eslint-disable-next-line @typescript-eslint/no-var-requires, node/no-unpublished-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const pascalCase = require('pascalcase');

interface Step {
  name?: string;
  id?: string;
  env?: Record<string, unknown>;
  if?: string;
}

interface UsesStep extends Step {
  uses: string;
  with?: unknown;
}

interface RunStep extends Step {
  run: string;
}

export const checkout: UsesStep = {
  uses: DEPENDENCIES.checkout,
};

export const setupNodeStrategy: UsesStep = {
  name: 'Use Node.js ${{ matrix.node-version }}',
  uses: DEPENDENCIES['setup-node'],
  with: {
    'node-version': '${{ matrix.node-version }}',
  },
};

export const setupNode12x: UsesStep = {
  name: 'Use Node.js 12.x',
  uses: DEPENDENCIES['setup-node'],
  with: {
    'node-version': '12.x',
  },
};

export const defaultNodeProjectSteps: (RunStep | UsesStep)[] = [
  {
    name: 'Get npm cache directory',
    id: 'get-npm-cache',
    run: 'echo "::set-output name=dir::$(npm config get cache)"\n',
  },
  {
    name: 'Cache Node.js modules',
    uses: DEPENDENCIES.cache,
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
    uses: DEPENDENCIES.cache,
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

export const setupPipDependenciesSteps: (RunStep | UsesStep)[] = [
  {
    name: 'Set up Python 3.8',
    uses: DEPENDENCIES['setup-python'],
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
    uses: DEPENDENCIES.cache,
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

export const build: RunStep = {
  run: 'npm run build',
  env: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    NODE_ENV: 'production',
  },
};

export const lint: RunStep = {
  run: 'npm run lint',
};

export const coverage: RunStep = {
  run: 'npm run cover',
  env: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CHECK_COVERAGE: true,
  },
};

export const uploadCoverage: UsesStep = {
  name: 'Upload to Codecov',
  uses: DEPENDENCIES['codecov-action'],
  env: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CODECOV_TOKEN: '${{ secrets.CODECOV_TOKEN }}',
  },
};

export const mergeDependabotPRViaScript: UsesStep = {
  name: 'Merge pull request',
  uses: DEPENDENCIES['github-script'],
  with: {
    'github-token': '${{ secrets.GITHUB_TOKEN }}',
    script: `
const pullRequest = context.payload.pull_request;
const repository = context.repo;

core.info(JSON.stringify(context));

await github.pulls.merge({
  merge_method: "merge",
  owner: repository.owner,
  pull_number: pullRequest.number,
  repo: repository.repo
});
`,
  },
};

export const changePRBaseFromMasterToDevelop: UsesStep = {
  uses: DEPENDENCIES['check-base-branch-action'],
  with: {
    'repo-token': '${{ secrets.GITHUB_TOKEN }}',
    'protected-branches': productionBranch,
    'default-branch': developBranch,
    'update-branch': true,
  },
};

export function echo(message: string, env?: Record<string, string>): RunStep {
  const runStep: RunStep = {
    run: `echo ${message}`,
  };

  if (env) {
    runStep.env = env;
  }

  return runStep;
}

export function cancelWorkflow(workflow: number): UsesStep {
  return {
    uses: DEPENDENCIES['cancel-workflow-action'],
    with: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      workflow_id: workflow,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      access_token: '${{ secrets.GITHUB_TOKEN }}',
    },
  };
}

export function commit(msg: string, options: Readonly<{ commitArgs: string }>): UsesStep {
  const { commitArgs } = options;
  return {
    uses: DEPENDENCIES['git-auto-commit-action'],
    with: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      commit_message: msg,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      commit_options: commitArgs,
    },
  };
}

export function getArrayLength(id: string, path: string): RunStep {
  return {
    name: `Get Array length of ${path}`,
    id,
    env: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ARRAY: `\${{ toJson(${path}) }}`,
    },
    // eslint-disable-next-line no-secrets/no-secrets
    run: `echo $ARRAY
ARRAY_LENGTH=$( echo $ARRAY | jq '. | length' )
echo "::set-output name=result::$ARRAY_LENGTH"`,
  };
}

export function waitForCheckName(checkName: string): (RunStep | UsesStep)[] {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions
  const stepId = `wait-for-${pascalCase(checkName)}`;
  return [
    {
      name: `Wait for ${checkName}`,
      uses: DEPENDENCIES['action-wait-for-check'],
      id: stepId,
      with: {
        token: '${{ secrets.GITHUB_TOKEN }}',
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

export function dumpContext(name: string, simpleName?: string): RunStep {
  const env: Record<string, unknown> = {};
  const contextName = simpleName !== undefined ? simpleName.toUpperCase() : name.toUpperCase();
  const envVar = `${contextName}_CONTEXT`;

  env[envVar] = `\${{ toJson(${name}) }}`;
  return {
    name: `Dump ${name} context`,
    env,
    run: `echo "$${envVar}"`,
  };
}
