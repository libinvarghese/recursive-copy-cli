module.exports = {
  extends: [
    '@commitlint/config-conventional' // scoped packages are not prefixed
  ],
  rules: {
    'header-max-length': [2, 'always', 72],
    'scope-enum': [2, 'always', ['yargs', 'cli', 'deps', 'deps-dev']]
  }
};
