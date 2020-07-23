import * as STEP from './steps';
import { defaultJobMachine, bot } from './constants';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const JOB = {
  proceedIfBot: {
    outputs: {
      status: '${{ steps.check-author.conclusion }}',
    },
    ...defaultJobMachine,
    steps: [
      STEP.dumpContext('github'),
      {
        name: `Check if author is ${bot}`,
        id: 'check-author',
        if: `github.event.pull_request.user.login != '${bot}'`,
        run: `echo Skip! Pull request created by \${{ github.event.pull_request.user.login }} not ${bot}
exit 0`,
      },
    ],
  },
};
