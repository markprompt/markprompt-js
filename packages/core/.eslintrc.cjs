/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: false,
  ignorePatterns: ['.turbo/', 'dist/'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    projectService: true,
  },
};
