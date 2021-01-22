module.exports = {
  extends: ['plugin:promise/recommended'],
  rules: {
    'promise/catch-or-return': ['error', { allowFinally: true }],
  },
};
