'use strict';

module.exports = {
  extends: '@istanbuljs/nyc-config-typescript',
  reporter: ['lcov', 'text', 'text-summary'],
  all: true,
  exclude: [
    '**/*.spec.ts',
    '**/*.spec.e2e.ts',
    '**/.mock.ts',
    '**/*.spec/*',
    'dist/*',
    'examples/*',
    'coverage/*',
    '*.js',
    'scripts/*',
  ],
  statements: 100,
  branches: 95,
  functions: 100,
  lines: 100,
};
