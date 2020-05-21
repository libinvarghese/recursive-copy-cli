module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['plugin:json/recommended-with-comments'],
  plugins: [
    // '@typescript-eslint',
    // 'promise',
    // 'import'
    'optimize-regex',
  ],
  rules: {},
};
