import { protectedBranches, defaultJobMachine, defaultNodeStrategy } from './constants';
import * as STEP from './steps';

const pullConfig = {
  branches: protectedBranches,
  'paths-ignore': ['**.md', 'scripts/**', '.vscode/**', '.github/**', '!.github/workflows/test.yml'],
};

export = {
  name: 'test',
  on: {
    push: { ...pullConfig, tags: ['v*'] },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pull_request: pullConfig,
  },
  jobs: {
    test: {
      ...defaultJobMachine,
      ...defaultNodeStrategy,
      steps: [
        ...STEP.waitForCheckName('build (12.x)'),
        STEP.checkout,
        STEP.setupNodeStrategy,
        ...STEP.defaultNodeProjectSteps,
        {
          run: 'npm run cover',
          env: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            CI: true,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            CHECK_COVERAGE: true,
          },
        },
        {
          name: 'Upload to Codecov',
          uses: 'codecov/codecov-action@v1.0.10',
          env: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            CODECOV_TOKEN: '${{ secrets.CODECOV_TOKEN }}',
          },
        },
      ],
    },
  },
};
