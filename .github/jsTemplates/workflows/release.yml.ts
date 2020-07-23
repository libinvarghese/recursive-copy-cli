import { defaultJobMachine, developBranch, productionBranch } from '../utils/constants';
import * as STEP from '../utils/steps';

export = {
  name: 'release',
  on: {
    schedule: [
      {
        cron: '0 1 * * SAT',
      },
    ],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    repository_dispatch: {
      types: ['release_on_demand'],
    },
  },
  jobs: {
    release: {
      ...defaultJobMachine,
      steps: [
        {
          ...STEP.checkout,
          with: {
            ref: developBranch,
            'fetch-depth': 0,
          },
        },
        {
          name: `Git fetch ${productionBranch}`,
          run: `git fetch --no-tags --prune --progress --no-recurse-submodules origin +${productionBranch}:${productionBranch}`,
        },
        STEP.setupNode12x,
        ...STEP.defaultNodeProjectSteps,
        ...STEP.setupPipDependenciesSteps,
        STEP.lint,
        STEP.coverage,
        STEP.build,
        {
          name: 'Do semantic release',
          run: `GITHUB_REF=refs/heads/${developBranch} GITHUB_ACTION=run8 npm run release`,
          env: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            GITHUB_TOKEN: '${{ secrets.REPO_ACCESS }}',
            // eslint-disable-next-line @typescript-eslint/naming-convention, no-secrets/no-secrets
            NPM_TOKEN: '${{ secrets.NPM_PUBLISH_TOKEN }}',
          },
        },
      ],
    },
  },
};
