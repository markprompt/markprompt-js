import type { ESLint, Linter } from 'eslint';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';

export const react = [
  {
    name: 'react',
    ...pluginReact.configs.flat.recommended,
    ...pluginReact.configs.flat['jsx-runtime'],
    plugins: { react: pluginReact as ESLint.Plugin },
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      ...pluginReact.configs.flat['jsx-runtime'].languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: '18',
      },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReact.configs.flat['jsx-runtime'].rules,
    },
  },
] satisfies Linter.Config[];
