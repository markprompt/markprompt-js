import { configs } from '@markprompt/eslint-config';

export default [
  ...configs.base(import.meta.dirname, [
    'eslint.config.js',
    'vitest.config.js',
  ]),
  {
    rules: {
      '@typescript-eslint/consistent-indexed-object-style': [
        'error',
        'index-signature',
      ],
      'import-x/no-unresolved': [
        'error',
        {
          ignore: ['@docusaurus/*', '@theme/*', '@site/*'],
        },
      ],
    },
  },
  ...configs.react,
  { files: ['**/*.test.{js,ts}'], ...configs.vitest },
  ...configs.biome,
];
