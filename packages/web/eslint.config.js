import { configs } from '@markprompt/eslint-config';

export default [
  ...configs.base(import.meta.dirname, [
    'eslint.config.js',
    'vitest.config.js',
    'scripts/*.js',
  ]),
  {
    rules: {
      '@typescript-eslint/consistent-indexed-object-style': [
        'error',
        'index-signature',
      ],
    },
  },
  ...configs.react,
  ...configs.vitest,
  ...configs.biome,
];
