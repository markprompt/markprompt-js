import type { Linter } from 'eslint';
import turbo from 'eslint-config-turbo/flat';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importX from 'eslint-plugin-import-x';
import promise from 'eslint-plugin-promise';
import globals from 'globals';
import ts, { parser } from 'typescript-eslint';

export const base = (
  rootDir: string,
  allowDefaultProject?: string[],
): Linter.Config[] => [
  {
    ignores: ['.turbo/', 'dist/'],
  },
  {
    rules: {
      'no-constant-binary-expression': 'error',
      'no-invalid-regexp': 'error',
      'no-unexpected-multiline': 'error',
      'no-useless-backreference': 'error',
    },
  },
  promise.configs['flat/recommended'],

  ...(ts.configs.recommended as Linter.Config[]),

  ...(ts.configs.stylistic as Linter.Config[]),
  importX.flatConfigs.recommended as Linter.Config,
  importX.flatConfigs.typescript,
  ...turbo,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    languageOptions: {
      parser: parser as Linter.Parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        tsconfigRootDir: rootDir,
        projectService: allowDefaultProject
          ? {
              allowDefaultProject,
            }
          : true,
        warnOnUnsupportedTypeScriptVersion: false,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
        }),
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      // https://github.com/import-js/eslint-plugin-import/issues/2340
      'import-x/namespace': 'off',
      'import-x/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },

          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
          ],

          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],

          'newlines-between': 'always',
        },
      ],
    },
  },
];
