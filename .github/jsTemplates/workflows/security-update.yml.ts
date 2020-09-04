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
    'cancel-not-dependabot': JOB.proceedIfBot,
    'pr-update-base': {
      needs: ['cancel-not-dependabot'],
      ...defaultJobMachine,
      steps: [STEP.changePRBaseFromMasterToDevelop],
    },
  },
};
