const { maxLineLength } = require('@commitlint/ensure');

module.exports = {
  extends: ['./.commitlintrc.js'],
  ignores: [
    // Dependabot commits `chore(deps-dev): `, sometimes have `body-max-line-length` greater than 100
    message => message.match(/^chore\(deps-dev\): /) && maxLineLength(message, 100) === false,
  ],
};
