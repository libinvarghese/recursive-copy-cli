import { defaultJobMachine, productionBranch } from '../utils/constants';
import { JOB } from '../utils/jobs';
import * as STEP from '../utils/steps';

const protectedBranch = productionBranch;

export = {
  name: 'security-update',
  on: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pull_request: {
      types: ['opened'],
      branches: [protectedBranch],
    },
  },
  jobs: {
    'pre-pr-update-base': JOB.proceedIfBot,
    'pr-update-base': {
      needs: ['pre-pr-update-base'],
      if: `needs.pre-pr-update-base.outputs.status != 'success'`,
      ...defaultJobMachine,
      steps: [STEP.changePRBaseFromMasterToDevelop],
    },
  },
};
