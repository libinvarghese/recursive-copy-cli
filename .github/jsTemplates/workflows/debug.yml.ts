import { protectedBranches, defaultJobMachine } from '../utils/constants';
import * as STEP from '../utils/steps';

const pullConfig = {
  branches: protectedBranches,
};

export = {
  name: 'debug',
  // To disable a workflow simply uncomment the below
  // disable: true,
  on: {
    push: { ...pullConfig, tags: ['v*'] },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pull_request: pullConfig,
  },
  jobs: {
    debug: {
      ...defaultJobMachine,
      steps: [
        STEP.dumpContext('github'),
        STEP.dumpContext('job'),
        STEP.dumpContext('steps'),
        STEP.dumpContext('runner'),
        STEP.dumpContext('strategy'),
        STEP.dumpContext('matrix'),
      ],
    },
  },
};
