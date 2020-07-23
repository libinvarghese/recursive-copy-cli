import { protectedBranches, defaultJobMachine, defaultNodeStrategy } from '../utils/constants';
import * as STEP from '../utils/steps';

const pullConfig = {
  branches: protectedBranches,
  paths: [
    'package*.json',
    'tsconfig*',
    'src/**.ts',
    'test/**.ts',
    '.github/workflows/build.yml',
    '!src/**.spec.ts',
    '!src/*.spec.e2e.ts',
    '!src/**.spec/**.ts',
  ],
};

export = {
  name: 'build',
  on: {
    push: { ...pullConfig, tags: ['v*'] },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pull_request: pullConfig,
  },
  jobs: {
    build: {
      ...defaultJobMachine,
      ...defaultNodeStrategy,
      steps: [STEP.checkout, STEP.setupNodeStrategy, ...STEP.defaultNodeProjectSteps, STEP.build],
    },
  },
};
