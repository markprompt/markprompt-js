/** @type {import('eslint').Linter.Config} */
module.exports = {
  ignorePatterns: ['.turbo/', 'dist/'],
  root: false,
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: '18',
    },
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:testing-library/react',
  ],
};
