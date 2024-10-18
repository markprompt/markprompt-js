import vitestPlugin from '@vitest/eslint-plugin';
import testingLibrary from 'eslint-plugin-testing-library';

export const vitest = [
  {
    files: ['**/*.test.{js,jsx,ts,tsx}'],
    plugins: { vitest: vitestPlugin },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...vitestPlugin.environments.env.globals,
      },
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      'vitest/max-nested-describe': ['error', { max: 3 }],
    },
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}'],
    ...testingLibrary.configs['flat/react'],
  },
];
