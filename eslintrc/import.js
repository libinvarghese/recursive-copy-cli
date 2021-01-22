module.exports = {
  extends: ['plugin:import/errors', 'plugin:import/warnings', 'plugin:import/typescript'],
  rules: {
    'import/no-dynamic-require': 'error',
    'import/named': 'error',
    'import/no-absolute-path': 'error',
    'import/no-webpack-loader-syntax': 'error',
    'import/no-self-import': 'error',
    'import/no-cycle': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-deprecated': 'warn',
    'import/no-mutable-exports': 'error',
    'import/no-unused-modules': 'error',
    'import/first': 'error',
    'import/exports-last': 'error',
    'import/order': ['error', { 'newlines-between': 'never' }],
    'import/no-unassigned-import': 'error',
    // The below is same as 'node/no-unpublished-import'
    // 'import/no-extraneous-dependencies': [
    //   'error',
    //   { devDependencies: false, optionalDependencies: false, peerDependencies: false },
    // ],
  },
};
