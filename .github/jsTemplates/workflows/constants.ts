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
