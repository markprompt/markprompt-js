import query from '@tanstack/eslint-plugin-query';
import router from '@tanstack/eslint-plugin-router';
import type { Linter } from 'eslint';

export const tanstack: Linter.Config[] = [
  ...query.configs['flat/recommended'],
  ...router.configs['flat/recommended'],
];
