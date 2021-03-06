const commonRules = require('./lib/common-rules');

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
    ...commonRules,
    'prefer-object-spread': 'error',
    'no-console': 'warn',
    'no-loss-of-precision': 'error',
    'id-length': 'error',
    'no-nonoctal-decimal-escape': 'error',
    'no-script-url': 'error',
    'no-unsafe-optional-chaining': 'error',
    // eslint-disable-next-line no-magic-numbers
    complexity: ['error', 4],
    'no-extend-native': 'error',
    'no-sequences': 'error',
    'no-shadow': ['error', { hoist: 'all' }],
    'no-invalid-this': 'error',
    'no-throw-literal': 'error',
    'no-implicit-coercion': ['error', { disallowTemplateShorthand: true }],
    'no-multi-assign': 'error',
    radix: 'error',
  },
};
