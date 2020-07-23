import { protectedBranches, defaultJobMachine, defaultNodeStrategy } from '../utils/constants';
import * as STEP from '../utils/steps';

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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...STEP.waitForCheckName('build (12.x)'),
        STEP.checkout,
        STEP.setupNodeStrategy,
        ...STEP.defaultNodeProjectSteps,
        STEP.coverage,
        STEP.uploadCoverage,
      ],
    },
  },
};
