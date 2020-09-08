import * as STEP from './steps';
import { defaultJobMachine, bot } from './constants';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const JOB = {
  dumpGithubContext: {
    ...defaultJobMachine,
    steps: [STEP.dumpContext('github')],
  },
  proceedIfBot: {
    ...defaultJobMachine,
    if: `github.event.pull_request.user.login == '${bot}'`,
    steps: [STEP.echo(`Pull request created by \${{ github.event.pull_request.user.login }} is ${bot}`)],
  },
};
