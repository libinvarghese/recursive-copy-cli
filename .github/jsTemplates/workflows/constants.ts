export const protectedBranches = ['develop', 'master'];

export const defaultJobMachine = {
  'runs-on': 'ubuntu-latest',
};

export const defaultNodeStrategy = {
  strategy: {
    matrix: {
      'node-version': ['12.x'],
    },
  },
};

export const bot = 'dependabot[bot]';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const JOB = {
  proceedIfBot: {
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
};
