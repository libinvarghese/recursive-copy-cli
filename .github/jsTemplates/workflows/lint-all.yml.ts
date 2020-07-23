import { protectedBranches, defaultJobMachine } from '../utils/constants';
import * as STEP from '../utils/steps';

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
        ...STEP.setupPipDependenciesSteps,
        STEP.setupNode12x,
        ...STEP.defaultNodeProjectSteps,
        STEP.lint,
      ],
    },
  },
};
