import { protectedBranches, defaultJobMachine } from './constants';
import * as STEP from './steps';

const env = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  BASE: '${{ github.base_ref }}',
};

export = {
  name: 'commitlint',
  on: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pull_request: {
      branches: protectedBranches,
    },
  },
  jobs: {
    commitlint: {
      ...defaultJobMachine,
      steps: [
        {
          ...STEP.checkout,
          with: {
            'fetch-depth': 0,
          },
        },
        {
          name: 'Git fetch Base - ${{ github.base_ref }}',
          run: 'git fetch --no-tags --prune --progress --no-recurse-submodules origin +$BASE:$BASE\n',
          env,
        },
        STEP.setupNode12x,
        ...STEP.defaultNodeProjectSteps,
        {
          name: 'Commit Lint from ${{ github.base_ref }}',
          run: 'npx commitlint -g .commitlintrc.ci.js --from $(git merge-base --fork-point $BASE) --verbose',
          env,
        },
      ],
    },
  },
};
