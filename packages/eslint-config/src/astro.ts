import type { Linter } from 'eslint';
import { configs } from 'eslint-plugin-astro';

export const astro: Linter.Config[] = [
  ...configs.recommended,
  ...configs['jsx-a11y-recommended'],
];
