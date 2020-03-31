'use strict';

module.exports = {
  extends: '@istanbuljs/nyc-config-typescript',
  reporter: ['lcov', 'text', 'text-summary'],
  all: true,
  'check-coverage': true,
  exclude: ['**/*.spec.ts', '**/.mock.ts', '**/*.spec/*', 'dist/*', 'coverage/*', '*.js', 'scripts/*'],
  statements: 85,
  branches: 80,
  functions: 70,
  lines: 80
};
