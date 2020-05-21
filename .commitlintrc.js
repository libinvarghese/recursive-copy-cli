module.exports = {
  extends: [
    '@commitlint/config-conventional', // scoped packages are not prefixed
  ],
  rules: {
    'header-max-length': [2, 'always', 72],
    'scope-enum': [
      2,
      'always',
      [
        'yargs',
        'cli',
        // The below scope is used by dependabot
        'deps',
        'deps-dev',
        // The below scope is used by semantic-release
        'release',
      ],
    ],
  },
  ignores: [message => message.match(/^.*?: WIP/)],
};

/**
 * **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
 * **chore**
 * **ci**: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
 * **docs**: Documentation only changes
 * **feat**: A new feature
 * **fix**: A bug fix
 * **improvement**
 * **perf**: A code change that improves performance
 * **refactor**: A code change that neither fixes a bug nor adds a feature
 * **revert**: revert: header of reverted commit<br>refs
 * **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
 * **test**: Adding missing tests or correcting existing tests
 */
