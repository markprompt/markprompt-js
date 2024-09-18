/** @type {import('eslint').Linter.Config} */
module.exports = {
  ignorePatterns: ['.turbo/', 'dist/'],
  root: false,
  parserOptions: {
    tsconfigRootDir: __dirname,
    projectService: true,
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
  ],
};
