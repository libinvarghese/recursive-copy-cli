import { defaultJobMachine, developBranch } from '../utils/constants';
import { JOB } from '../utils/jobs';
import * as STEP from '../utils/steps';

const disableMergeLabel = 'github_actions';
const dependabotLabel = 'dependencies';

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
      if: `needs.pre-automerge-bot.outputs.status != 'success'
&& contains( github.event.pull_request.labels.*.name, '${dependabotLabel}')`,
      outputs: {
        shouldMerge: '${{ steps.label-length.outputs.result >= 2 }}',
        didUpdate: '${{ steps.update-dependencies.conclusion }}',
      },
      ...defaultJobMachine,
      steps: [
        STEP.dumpContext('github.event.pull_request.labels.*.name', 'pull_request_labels'),
        STEP.checkout,
        STEP.setupNode12x,
        ...STEP.defaultNodeProjectSteps,
        STEP.getArrayLength('label-length', 'github.event.pull_request.labels'),
        {
          name: 'Update .github/jsTemplates/utils/dependencies.ts',
          id: 'update-dependencies',
          if: `steps.label-length.outputs.result >= 2
&& contains( github.event.pull_request.labels.*.name, '${disableMergeLabel}')`,
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
      if: `needs.github-action.outputs.shouldMerge == 'true'
&& ( needs.github-action.outputs.didUpdate == 'success' || needs.github-action.outputs.didUpdate == 'skipped')`,
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
