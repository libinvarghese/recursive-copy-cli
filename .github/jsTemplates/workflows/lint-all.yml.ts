import { protectedBranches, defaultJobMachine } from './constants';
import * as STEP from './steps';

const pullConfig = {
  branches: protectedBranches,
  'paths-ignore': ['**.md'],
};

export = {
  name: 'lint-all',
  on: {
    push: { ...pullConfig, tags: ['v*'] },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pull_request: pullConfig,
  },
  jobs: {
    lint: {
      ...defaultJobMachine,
      steps: [
        STEP.checkout,
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
        STEP.setupNode12x,
        ...STEP.defaultNodeProjectSteps,
        {
          run: 'npm run lint',
          env: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            CI: true,
          },
        },
      ],
    },
  },
};
