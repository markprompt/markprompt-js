/** @type {import('eslint').Linter.Config} */
module.exports = {
  ignorePatterns: ['.turbo/', 'dist/'],
  root: false,
  parserOptions: {
    tsconfigRootDir: __dirname,
    projectService: {
      allowDefaultProject: [
        '__mocks__/*.ts',
        'vitest.config.ts',
        'vitest.setup.ts',
      ],
    },
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
