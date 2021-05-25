const commonRules = require('./lib/common-rules');

const booleanVarPrefix = ['is', 'should', 'has', 'can', 'did', 'will'];

const booleanVariable = {
  types: ['boolean'],
  format: ['PascalCase'],
  prefix: booleanVarPrefix,
};

const booleanConst = {
  types: ['boolean'],
  prefix: booleanVarPrefix.map(prefix => `${prefix.toUpperCase()}_`),
};

module.exports = {
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/all',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: [
      './tsconfig.json',
      './scripts/tsconfig.json',
      './.github/jsTemplates/tsconfig.json',
      './tsconfig.test.json',
      './tsconfig.config.json',
    ],
  },
  rules: {
    ...Object.keys(commonRules).reduce((rules, key) => {
      rules[`@typescript-eslint/${key}`] = commonRules[key];

      return rules;
    }, {}),
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-type-alias': ['error', { allowCallbacks: 'always' }],
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'default', format: ['camelCase'] },
      {
        selector: 'variableLike',
        format: ['camelCase'],
      },
      {
        selector: 'variable',
        modifiers: ['const'],
        format: ['camelCase'],
      },
      {
        selector: 'variable',
        modifiers: ['const'],
        format: ['camelCase'],
        ...booleanConst,
      },
      {
        selector: 'variable',
        ...booleanVariable,
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'parameter',
        ...booleanVariable,
        leadingUnderscore: 'allow',
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
      },
      {
        selector: 'memberLike',
        modifiers: ['static', 'readonly'],
        format: ['UPPER_CASE'],
      },
      {
        selector: 'property',
        modifiers: ['static', 'readonly'],
        format: ['UPPER_CASE'],
        ...booleanConst,
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
  },
};
