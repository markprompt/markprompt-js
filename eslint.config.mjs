import { configs } from '@markprompt/eslint-config';

export default [
  {
    ignores: ['coverage/', 'examples/', 'packages/'],
  },
  ...configs.base(import.meta.url, ['test/utils.ts']),
  {
    rules: {
      '@typescript-eslint/consistent-indexed-object-style': [
        'error',
        'index-signature',
      ],
    },
  },
  ...configs.biome,
];
