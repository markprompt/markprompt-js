module.exports = {
  ignorePatterns: ['dist/'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['examples/**/tsconfig.json', 'packages/**/tsconfig.json'],
      },
      node: true,
    },
    react: {
      version: 'detect',
    },
  },
  plugins: ['@typescript-eslint'],
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  rules: {
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'object',
        ],
        pathGroups: [{ pattern: '@/**', group: 'internal' }],
        'newlines-between': 'always',
      },
    ],
    'import/no-unresolved': 'off',
  },
};
