import { defaultJobMachine, JOB, developBranch } from '../utils/constants';
import * as STEP from '../utils/steps';

const disableMergeLabel = 'github_actions';

export = {
  name: 'automerge-dependabot',
  on: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pull_request: {
      types: ['edited', 'reopened', 'synchronize', 'labeled'],
      branches: [developBranch],
    },
  },
  jobs: {
    'pre-automerge-bot': JOB.proceedIfBot,
    'github-action': {
      needs: ['pre-automerge-bot'],
      if: `needs.pre-automerge-bot.outputs.status != 'success'`,
      ...defaultJobMachine,
      steps: [
        STEP.dumpContext('github.event.pull_request.labels.*.name', 'pull_request_labels'),
        {
          name: 'Update .github/jsTemplates/utils/dependencies.ts',
          if: `contains( github.event.pull_request.labels.*.name, '${disableMergeLabel}')`,
          run: `npx ts-node scripts/githubActionsDepGen.ts
git add .github/jsTemplates/utils/dependencies.ts
npm run js2yaml
git diff --quiet || echo 'Files pending to stage!' || false && \
  git diff --staged --quiet && echo 'No changes to commit' || \
  git commit --no-verify -m 'chore(deps): bump dependency in template'
`,
        },
      ],
    },
    'automerge-dependabot': {
      needs: ['github-action'],
      ...defaultJobMachine,
      steps: [
        ...STEP.waitForCheckName('commitlint'),
        ...STEP.waitForCheckName('lint'),
        ...STEP.waitForCheckName('build (12.x)'),
        ...STEP.waitForCheckName('test (12.x)'),
        STEP.mergeDependabotPR,
      ],
    },
  },
};
