module.exports = {
  extends: [
    './env.js',
    'eslint:recommended',
    './import.js',
    './node.js',
    './mocha.js',
    './no-secrets.js',
    './optimize-regex.js',
    './promise.js',
    'plugin:you-dont-need-lodash-underscore/compatible',
    'plugin:json/recommended-with-comments',
    'prettier',
  ],
  plugins: [],
  rules: {
    semi: ['error', 'always'],
    'prefer-object-spread': 'error',
    'no-console': 'warn',
    'no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_' }],
    'no-loss-of-precision': 'error',
    'id-length': 'error',
  },
};
