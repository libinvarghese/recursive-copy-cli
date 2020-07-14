import { defaultJobMachine, JOB, developBranch, productionBranch } from './constants';

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
      steps: [
        {
          uses: 'a-b-r-o-w-n/check-base-branch-action@v1',
          with: {
            'repo-token': '${{ secrets.REPO_ACCESS }}',
            protectedBranches: protectedBranch,
            defaultBranch: developBranch,
            'update-branch': true,
          },
        },
      ],
    },
  },
};
