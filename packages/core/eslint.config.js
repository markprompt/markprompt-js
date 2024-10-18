import { configs } from '@markprompt/eslint-config';

export default [
  ...configs.base(import.meta.dirname, [
    'eslint.config.js',
    'vitest.config.js',
    'src/*.test.ts',
    'src/*/*.test.ts',
  ]),
  { files: ['**/*.test.{js,ts}'], ...configs.vitest },
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
