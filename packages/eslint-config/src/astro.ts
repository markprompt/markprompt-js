import type { Linter } from 'eslint';
import { configs } from 'eslint-plugin-astro';

export const astro: Linter.Config[] = [
  ...configs.recommended,
  ...configs['jsx-a11y-recommended'],
  {
    files: ['**/*.astro'],
    settings: {
      'import-x/extensions': ['.astro', '.js', '.jsx', '.ts', '.tsx'],
      'import-x/parsers': {
        'astro-eslint-parser': ['.astro'],
      },
    },
    rules: {
      'import-x/default': 'off',
    },
  },
];
