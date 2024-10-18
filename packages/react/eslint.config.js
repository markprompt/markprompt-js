import { configs } from '@markprompt/eslint-config';
import testingLibrary from 'eslint-plugin-testing-library';

export default [
  ...configs.base(import.meta.dirname, [
    'eslint.config.js',
    'vitest.config.ts',
    'vitest.setup.ts',
    'src/*.test.ts',
    'src/*/*.test.ts',
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
  { files: ['**/*.test.{js,ts}'], ...configs.vitest },
  { files: ['**/*.test.{js,ts}'], ...testingLibrary.configs['flat/react'] },
  ...configs.biome,
];
