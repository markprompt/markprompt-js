import type { ESLint, Linter } from 'eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';

export const react: Linter.Config[] = [
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    name: 'react',
    plugins: pluginReact.configs.flat.recommended.plugins,
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        jsxPragma: null, // for @typescript/eslint-parser
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      formComponents: ['Form'],
      linkComponents: [
        'Link',
        'LinkButton',
        'TanstackLinkButton',
        'TanstackTextLink',
        'TextLink',
      ],
    },
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      'react/display-name': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'error',
      'react/no-unsafe': 'off',
      'react/prop-types': 'error',
      'react/require-render-return': 'error',
      // for automatic jsx-runtime
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },

  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': [
        'error',
        // technically only for Vite apps, but most of our apps are.
        { allowConstantExport: true },
      ],
    },
  },

  {
    plugins: {
      'jsx-a11y': jsxA11y as ESLint.Plugin,
    },
    rules: {
      'jsx-a11y/anchor-ambiguous-text': 'off', // TODO: error
      'jsx-a11y/control-has-associated-label': [
        'off',
        {
          ignoreElements: [
            'audio',
            'canvas',
            'embed',
            'input',
            'textarea',
            'tr',
            'video',
          ],
          ignoreRoles: [
            'grid',
            'listbox',
            'menu',
            'menubar',
            'radiogroup',
            'row',
            'tablist',
            'toolbar',
            'tree',
            'treegrid',
          ],
          includeRoles: ['alert', 'dialog'],
        },
      ],
      'jsx-a11y/no-noninteractive-element-interactions': [
        'error',
        {
          handlers: [
            'onClick',
            'onError',
            'onLoad',
            'onMouseDown',
            'onMouseUp',
            'onKeyPress',
            'onKeyDown',
            'onKeyUp',
          ],
          alert: ['onKeyUp', 'onKeyDown', 'onKeyPress'],
          body: ['onError', 'onLoad'],
          dialog: ['onKeyUp', 'onKeyDown', 'onKeyPress'],
          iframe: ['onError', 'onLoad'],
          img: ['onError', 'onLoad'],
        },
      ],
    },
  },
];
