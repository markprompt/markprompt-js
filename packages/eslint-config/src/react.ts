import type { ESLint, Linter } from 'eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export const react = [
  {
    name: 'react',
    ...pluginReact.configs.flat.recommended,
    ...pluginReact.configs.flat['jsx-runtime'],
    plugins: {
      react: pluginReact as ESLint.Plugin,
      'react-refresh': pluginReactRefresh,
    },
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
      'react-refresh/only-export-components': 'warn',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
] satisfies Linter.Config[];
