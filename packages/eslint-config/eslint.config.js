import { configs } from './dist/index.js';

export default [
  ...configs.base(import.meta.dirname, ['eslint.config.js']),
  {
    rules: {
      '@typescript-eslint/consistent-indexed-object-style': [
        'error',
        'index-signature',
      ],
    },
  },
];
