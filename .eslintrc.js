module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:node/recommended',
    'plugin:promise/recommended',
    'plugin:you-dont-need-lodash-underscore/compatible',
    'plugin:json/recommended',
    'plugin:mocha/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: ['./tsconfig.json', './scripts/tsconfig.json', './tsconfig.test.json']
  },
  plugins: [
    // '@typescript-eslint',
    // 'promise',
    // 'import'
    'optimize-regex',
    'no-secrets'
  ],
  rules: {
    semi: ['error', 'always'],
    'prefer-object-spread': 'error',
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { args: 'all', argsIgnorePattern: '^_' }],
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        version: '>=10.19.0',
        ignores: ['restSpreadProperties', 'modules']
      }
    ],
    'node/no-unsupported-features/node-builtins': [
      'error',
      {
        version: '>=10.19.0',
        ignores: ['fs.promises']
      }
    ],
    'node/no-missing-import': 'off',
    'node/shebang': [
      'error',
      {
        convertPath: {
          'src/**/*.ts': ['^src/(.+?)\\.ts$', 'dist/$1.js']
        }
      }
    ],
    'optimize-regex/optimize-regex': 'error',
    'no-secrets/no-secrets': 'error',
    // For some reason this is not working
    'mocha/max-top-level-suites': ['error', { limit: 1 }],
    'mocha/no-hooks-for-single-case': 'off',
    'mocha/no-mocha-arrows': 'off',
    'mocha/no-return-and-callback': 'warn',
    'mocha/no-sibling-hooks': 'warn',
    'mocha/no-top-level-hooks': 'error',
    'mocha/prefer-arrow-callback': 'error'
  },
  overrides: [
    {
      files: ['scripts/**/*'],
      rules: {
        'no-console': 'off'
      }
    },
    {
      files: ['src/**/*.spec.ts', 'src/**/*.spec/*'],
      rules: {
        'node/no-unpublished-import': [
          'error',
          {
            allowModules: ['chai', 'chai-arrays']
          }
        ],
        'node/no-unpublished-require': [
          'error',
          {
            allowModules: ['chai-semver']
          }
        ]
      }
    }
  ]
};
