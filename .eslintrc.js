module.exports = {
  globals: {
    Chai: 'readonly',
    NodeJS: 'readonly',
  },
  overrides: [
    {
      files: ['*.js', '*.json'],
      extends: ['./eslintrc/javascript.js'],
    },
    {
      files: ['*.ts'],
      extends: ['./eslintrc/javascript.js', './eslintrc/typescript.js'],
    },
    {
      files: ['scripts/**/*'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['**/*.spec.ts', '**/*.spec/*', '**/*.spec.e2e.ts'],
      rules: {
        'node/no-unpublished-import': [
          'error',
          {
            allowModules: [
              'chai',
              'sinon',
              'chai-arrays',
              '@jsdevtools/chai-exec',
              'mock-fs',
              'chai-fs',
              'sinon-chai',
              'rimraf',
            ],
          },
        ],
        'node/no-unpublished-require': [
          'error',
          {
            allowModules: ['chai-semver'],
          },
        ],
      },
    },
  ],
  rules: {
    'node/shebang': [
      'error',
      {
        convertPath: {
          'src/**/*.ts': ['^(src/.+?)\\.ts$', 'dist/$1.js'],
        },
      },
    ],
  },
};
