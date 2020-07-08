import { defaultJobMachine } from './constants';
import * as STEP from './steps';

const bot = 'dependabot[bot]';

export = {
  name: 'automerge-dependabot',
  on: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pull_request: {
      types: ['edited', 'labeled', 'opened', 'ready_for_review', 'reopened', 'synchronize', 'unlabeled', 'unlocked'],
      branches: ['develop'],
    },
  },
  jobs: {
    'pre-automerge': {
      outputs: {
        status: '${{ steps.check-author.conclusion }}',
      },
      ...defaultJobMachine,
      steps: [
        {
          name: `Check if author is ${bot}`,
          id: 'check-author',
          if: `github.event.pull_request.user.login != '${bot}'`,
          run: `echo Skip! Pull request created by \${{ github.event.pull_request.user.login }} not ${bot}
exit 0`,
        },
      ],
    },
    'automerge-dependabot': {
      needs: ['pre-automerge'],
      if: `needs.pre-automerge.outputs.status != 'success'`,
      ...defaultJobMachine,
      steps: [
        ...STEP.waitForCheckName('commitlint'),
        ...STEP.waitForCheckName('lint'),
        ...STEP.waitForCheckName('build (12.x)'),
        ...STEP.waitForCheckName('test (12.x)'),
        {
          name: 'Merge me!',
          uses: 'ridedott/merge-me-action@v1.3.12',
          with: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            GITHUB_LOGIN: bot,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            GITHUB_TOKEN: '${{ secrets.REPO_ACCESS }}',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            MERGE_METHOD: 'MERGE',
          },
        },
      ],
    },
  },
};
