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
    'node/no-new-require': 'error',
    'node/no-path-concat': 'error',
    'node/callback-return': 'error',
    'node/global-require': 'error',
    'node/no-mixed-requires': 'error',
    'node/no-process-env': 'error',
    'node/no-restricted-import': 'error',
    'node/no-restricted-require': 'error',
    'node/no-sync': 'error',
    'node/prefer-global/buffer': ['error', 'never'],
    'node/prefer-global/console': ['error', 'never'],
    'node/prefer-global/process': ['error', 'never'],
    'node/prefer-global/text-decoder': ['error', 'never'],
    'node/prefer-global/text-encoder': ['error', 'never'],
    'node/prefer-global/url-search-params': ['error', 'never'],
    'node/prefer-global/url': ['error', 'never'],
    'node/prefer-promises/dns': 'error',
    'node/prefer-promises/fs': 'error',

    // This is buggy 'node/file-extension-in-import': ['error', 'never'],
    // use 'import/extensions' instead
  },
};
