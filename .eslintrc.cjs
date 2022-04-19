module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/extensions': [
      2,
      {
        js: 'ignorePackages',
      },
    ],
    'prettier/prettier': [
      1,
      {
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 100,
        arrowParens: 'avoid',
        endOfLine: 'auto',
      },
    ],
  },
};
