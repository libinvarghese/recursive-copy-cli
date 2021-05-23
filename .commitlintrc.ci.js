// eslint-disable-next-line node/no-extraneous-require
const { maxLineLength } = require('@commitlint/ensure');

module.exports = {
  extends: ['./.commitlintrc.js'],
  ignores: [
    // Dependabot commits `chore(deps-dev): ` or `chore(deps): `, sometimes have `body-max-line-length` greater than 100
    // eslint-disable-next-line no-magic-numbers
    message => message.match(/^chore\(deps(-dev)?\): /) && maxLineLength(message, 100) === false,
  ],
};
