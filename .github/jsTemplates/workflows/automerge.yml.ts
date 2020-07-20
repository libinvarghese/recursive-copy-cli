import { defaultJobMachine, bot, JOB, developBranch } from './constants';
import * as STEP from './steps';

const disableMergeLabel = 'github_actions';

export = {
  name: 'automerge-dependabot',
  on: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pull_request: {
      types: ['edited', 'opened', 'reopened', 'synchronize'],
      branches: [developBranch],
    },
  },
  jobs: {
    'pre-automerge-bot': JOB.proceedIfBot,
    'pre-automerge-label': {
      needs: ['pre-automerge-bot'],
      if: `needs.pre-automerge-bot.outputs.status != 'success'`,
      outputs: {
        status: '${{ steps.check-label.conclusion }}',
      },
      ...defaultJobMachine,
      steps: [
        {
          id: 'search-label',
          uses: 'Dreamcodeio/pr-has-label-action@v1.2',
          with: {
            label: disableMergeLabel,
          },
        },
        {
          name: `Check if label is ${disableMergeLabel}`,
          id: 'check-label',
          if: `steps.search-label.outputs.hasLabel == 'true'`,
          run: `echo Skip! Pull request labelled ${disableMergeLabel}
exit 0`,
        },
      ],
    },
    'automerge-dependabot': {
      needs: ['pre-automerge-label'],
      if: `needs.pre-automerge-label.outputs.status != 'success'`,
      ...defaultJobMachine,
      steps: [
        ...STEP.waitForCheckName('commitlint'),
        ...STEP.waitForCheckName('lint'),
        ...STEP.waitForCheckName('build (12.x)'),
        ...STEP.waitForCheckName('test (12.x)'),
        {
          name: 'Merge me!',
          uses: 'libinvarghese/merge-me-action@v1',
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
