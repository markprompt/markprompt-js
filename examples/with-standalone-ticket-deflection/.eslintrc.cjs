/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: false,
  parserOptions: {
    // @ts-expect-error - ts can't find __dirname but this is a cjs file so it should
    tsconfigRootDir: __dirname,
    projectService: true,
    warnOnUnsupportedTypeScriptVersion: false,
  },
};
