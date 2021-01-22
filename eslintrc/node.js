module.exports = {
  extends: ['plugin:node/recommended'],
  rules: {
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        version: '>=10.19.0',
        ignores: ['restSpreadProperties', 'modules'],
      },
    ],
    'node/no-unsupported-features/node-builtins': [
      'error',
      {
        version: '>=10.19.0',
        ignores: ['fs.promises', 'stream.Readable.from'],
      },
    ],
    'node/no-missing-import': 'off',
    'node/shebang': 'error',
  },
};
