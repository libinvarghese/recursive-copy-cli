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
    // Since we are looking for 2 labels ['dependencies' & <ecosystem>],
    // we get 2 runs of this workflow due to the 2 labelled trigger.
    // Lets cancel the older workflow
    'cancel-previous-workflow': {
      needs: ['pre-automerge-bot'],
      if: `needs.pre-automerge-bot.outputs.status != 'success'
&& contains( github.event.pull_request.labels.*.name, '${dependabotLabel}')`,
      ...defaultJobMachine,
      steps: [STEP.cancelWorkflow(1739794)],
    },
    'github-action': {
      needs: ['cancel-previous-workflow'],
      outputs: {
        shouldMerge: '${{ steps.label-length.outputs.result >= 2 }}',
        didCommit: '${{ steps.commit-dependencies.conclusion }}',
        hasCommit: '${{ steps.update-dependencies.outputs.has-commit }}',
      },
      ...defaultJobMachine,
      steps: [
        STEP.dumpContext('github.event.pull_request.labels.*.name', 'pull_request_labels'),
        {
          ...STEP.checkout,
          with: {
            ref: '${{ github.event.pull_request.head.ref }}',
            // eslint-disable-next-line no-secrets/no-secrets
            token: '${{ secrets.PUSH_WORKFLOW_ACCESS }}',
          },
        },
        STEP.setupNode12x,
        ...STEP.defaultNodeProjectSteps,
        STEP.getArrayLength('label-length', 'github.event.pull_request.labels.*.name'),
        {
          name: 'Update .github/jsTemplates/utils/dependencies.ts',
          id: 'update-dependencies',
          if: `steps.label-length.outputs.result >= 2
&& contains( github.event.pull_request.labels.*.name, '${disableMergeLabel}')`,
          run: `npx ts-node scripts/githubActionsDepGen.ts
git add .github/jsTemplates/utils/dependencies.ts
npm run js2yaml
git add .github/workflows
git status
git diff --quiet
git diff --staged --quiet && echo "has-commit=false" || echo "has-commit=true"
git diff --staged --quiet && echo "::set-output name=has-commit::false" || echo "::set-output name=has-commit::true"
`,
        },
        {
          ...STEP.commit('chore(deps): bump dependency in template', {
            commitArgs: '--no-verify',
          }),
          id: 'commit-dependencies',
          if: `(steps.update-dependencies.conclusion == 'success'
  && steps.update-dependencies.outputs.has-commit == 'true' )
|| steps.update-dependencies.conclusion == 'skipped'`,
        },
      ],
    },
    'automerge-dependabot': {
      needs: ['github-action'],
      if: `needs.github-action.outputs.shouldMerge == 'true'
&& ( needs.github-action.outputs.didCommit == 'success' || needs.github-action.outputs.didCommit == 'skipped')`,
      ...defaultJobMachine,
      steps: [
        STEP.dumpContext('needs'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...STEP.waitForCheckName('commitlint'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...STEP.waitForCheckName('lint'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...STEP.waitForCheckName('build (12.x)'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...STEP.waitForCheckName('test (12.x)'),
        STEP.mergeDependabotPR,
      ],
    },
  },
};
