module.exports = {
  overrides: [
    {
      files: ['**/*.spec.ts', '**/*.spec/*', '**/*.spec.e2e.ts'],
      rules: {
        'node/no-unpublished-import': [
          'error',
          {
            allowModules: ['chai', 'sinon'],
          },
        ],
        'node/no-unpublished-require': [
          'error',
          {
            allowModules: [],
          },
        ],
      },
    },
  ],
};
