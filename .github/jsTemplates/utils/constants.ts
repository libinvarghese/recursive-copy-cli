export const developBranch = 'develop';
export const productionBranch = 'master';
export const protectedBranches = [developBranch, productionBranch];

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
