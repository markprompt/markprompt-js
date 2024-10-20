import type { Linter } from 'eslint';
import astroPlugin from 'eslint-plugin-astro';

export const astro: Linter.Config[] = [
  ...astroPlugin.configs.recommended,
  ...astroPlugin.configs['jsx-a11y-recommended'],
];
