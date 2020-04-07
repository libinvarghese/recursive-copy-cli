const path = require('path');
module.exports = {
  require: ['ts-node/register', path.resolve('./src/lib.spec/chai')],
  extension: ['ts'],
  timeout: 5000,
  // spec: 'src/**/*.spec.ts',
  'check-leaks': true,
  'watch-files': ['./src/**/*.ts', './src/**/*.spec.ts'],
  reporters: ['spec', 'progress']
};

/*
Rules & Behavior
  --allow-uncaught           Allow uncaught errors to propagate        [boolean]
  --async-only, -A           Require all tests to use a callback (async) or
                             return a Promise                          [boolean]
  --bail, -b                 Abort ("bail") after first test failure   [boolean]
  --check-leaks              Check for global variable leaks           [boolean]
  --delay                    Delay initial execution of root suite     [boolean]
  --exit                     Force Mocha to quit after tests complete  [boolean]
  --forbid-only              Fail if exclusive test(s) encountered     [boolean]
  --forbid-pending           Fail if pending test(s) encountered       [boolean]
  --global, --globals        List of allowed global variables            [array]
  --retries                  Retry failed tests this many times         [number]
  --slow, -s                 Specify "slow" test threshold (in milliseconds)
                                                          [string] [default: 75]
  --timeout, -t, --timeouts  Specify test timeout threshold (in milliseconds)
                                                        [string] [default: 2000]
  --ui, -u                   Specify user interface    [string] [default: "bdd"]

Reporting & Output
  --color, -c, --colors                     Force-enable color output  [boolean]
  --diff                                    Show diff on failure
                                                       [boolean] [default: true]
  --full-trace                              Display full stack traces  [boolean]
  --growl, -G                               Enable Growl notifications [boolean]
  --inline-diffs                            Display actual/expected differences
                                            inline within each string  [boolean]
  --reporter, -R                            Specify reporter to use
                                                      [string] [default: "spec"]
  --reporter-option, --reporter-options,    Reporter-specific options
  -O                                        (<k=v,[k1=v1,..]>)           [array]

Configuration
  --config   Path to config file           [string] [default: (nearest rc file)]
  --opts     Path to `mocha.opts` (DEPRECATED)
                                         [string] [default: "./test/mocha.opts"]
  --package  Path to package.json for config                            [string]

File Handling
  --extension          File extension(s) to load
                                           [array] [default: ["js","cjs","mjs"]]
  --file               Specify file(s) to be loaded prior to root suite
                       execution                       [array] [default: (none)]
  --ignore, --exclude  Ignore file(s) or glob pattern(s)
                                                       [array] [default: (none)]
  --recursive          Look for tests in subdirectories                [boolean]
  --require, -r        Require module                  [array] [default: (none)]
  --sort, -S           Sort test files                                 [boolean]
  --watch, -w          Watch files in the current working directory for changes
                                                                       [boolean]
  --watch-files        List of paths or globs to watch                   [array]
  --watch-ignore       List of paths or globs to exclude from watching
                                      [array] [default: ["node_modules",".git"]]

Test Filters
  --fgrep, -f   Only run tests containing this string                   [string]
  --grep, -g    Only run tests matching this string or regexp           [string]
  --invert, -i  Inverts --grep and --fgrep matches                     [boolean]
*/
