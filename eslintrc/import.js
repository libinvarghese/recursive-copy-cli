module.exports = {
  extends: ['plugin:import/errors', 'plugin:import/typescript'],
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
    'import/no-unused-modules': ['error', { unusedExports: true }],
    'import/first': 'error',
    'import/exports-last': 'error',
    'import/order': ['error', { 'newlines-between': 'never' }],
    'import/no-unassigned-import': 'error',
    'import/export': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-duplicates': 'error',
    'import/extensions': ['error', 'never'],
    'import/newline-after-import': 'error',
    'import/no-named-default': 'error',
    'import/no-default-export': 'error',
    'import/no-anonymous-default-export': 'error',

    // The below is same as 'node/no-unpublished-import'
    // 'import/no-extraneous-dependencies': [
    //   'error',
    //   { devDependencies: false, optionalDependencies: false, peerDependencies: false },
    // ],
  },
};
