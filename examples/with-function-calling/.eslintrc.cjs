/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: false,
  extends: ['plugin:@next/next/core-web-vitals'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    projectService: true,
    warnOnUnsupportedTypeScriptVersion: false,
  },
  settings: {
    next: {
      rootDir: __dirname,
    },
  },
};
