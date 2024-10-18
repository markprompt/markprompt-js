import { configs } from '@markprompt/eslint-config';

export default [
  ...configs.base(import.meta.dirname, [
    'eslint.config.js',
    'vitest.config.ts',
    'vitest.setup.ts',
    'src/*.test.ts',
    'src/*/*.test.ts',
    '__mocks__/*.ts',
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
