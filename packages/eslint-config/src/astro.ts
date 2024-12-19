import type { Linter } from 'eslint';
import { configs } from 'eslint-plugin-astro';

export const astro: Linter.Config[] = [
  ...configs['flat/recommended'],
  ...configs['flat/jsx-a11y-recommended'],
  {
    files: ['**/*.astro'],
    settings: {
      'import-x/extensions': ['.astro'],
      'import-x/parsers': {
        'astro-eslint-parser': ['.astro'],
      },
    },
    languageOptions: {
      parserOptions: {
        projectService: false,
      },
    },
    rules: {
      'import-x/default': 'off',
    },
  },
];
