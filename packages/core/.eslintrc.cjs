/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: false,
  ignorePatterns: ['.turbo/', 'dist/'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    projectService: {
      allowDefaultProject: [
        'vitest.config.js',
        'src/*.test.ts',
        'src/*/*.test.ts',
      ],
    },
    warnOnUnsupportedTypeScriptVersion: false,
  },
};
