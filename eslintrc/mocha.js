module.exports = {
  env: {
    mocha: true,
  },
  extends: ['plugin:mocha/recommended'],
  rules: {
    // For some reason this is not working
    'mocha/max-top-level-suites': ['error', { limit: 1 }],
    'mocha/no-hooks-for-single-case': 'off',
    'mocha/no-mocha-arrows': 'off',
    'mocha/no-return-and-callback': 'warn',
    'mocha/no-sibling-hooks': 'warn',
    'mocha/no-top-level-hooks': 'error',
    'mocha/prefer-arrow-callback': 'error',
  },
};
