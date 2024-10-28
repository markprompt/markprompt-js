import type { Linter } from 'eslint';
import { configs } from 'eslint-plugin-astro';

export const astro: Linter.Config[] = [
  ...configs['flat/recommended'],
  ...configs['jsx-a11y-recommended'],
  {
    files: ['**/*.astro'],
    settings: {
      'import-x/extensions': ['.astro'],
      'import-x/parsers': {
        'astro-eslint-parser': ['.astro'],
      },
    },
    rules: {
      'import-x/default': 'off',
    },
  },
];
