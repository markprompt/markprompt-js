import { configs } from '@markprompt/eslint-config';

export default [
  ...configs.base(import.meta.dirname),
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
];
