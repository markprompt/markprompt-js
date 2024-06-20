/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: false,
  extends: ['next/core-web-vitals'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
};
