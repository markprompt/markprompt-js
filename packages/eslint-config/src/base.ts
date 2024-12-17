import js from '@eslint/js';
import type { ESLint, Linter } from 'eslint';
import turbo from 'eslint-config-turbo/flat';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importX from 'eslint-plugin-import-x';
import promise from 'eslint-plugin-promise';
import globals from 'globals';
import ts, { parser } from 'typescript-eslint';

const typeScriptExtensions = ['.ts', '.tsx', '.cts', '.mts'] as const;

const allExtensions = [
  ...typeScriptExtensions,
  '.js',
  '.jsx',
  '.cjs',
  '.mjs',
] as const;

export const base = (
  rootDir: string,
  allowDefaultProject?: string[],
): Linter.Config[] => [
  {
    ignores: ['.turbo/', 'dist/'],
  },
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
  },

  {
    plugins: {
      'import-x': importX as unknown as ESLint.Plugin,
    },
    settings: {
      'import-x/extensions': allExtensions,
      'import-x/external-module-folders': [
        'node_modules',
        'node_modules/@types',
      ],
      'import-x/parsers': {
        '@typescript-eslint/parser': [...typeScriptExtensions],
      },
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
        }),
      ],
    },
  },

  js.configs.recommended,
  promise.configs['flat/recommended'],
  importX.flatConfigs.typescript,
  ...(ts.configs.recommended as Linter.Config[]),
  ...(ts.configs.stylistic as Linter.Config[]),
  ...turbo,

  {
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      // https://github.com/import-js/eslint-plugin-import/issues/2340
      'import-x/namespace': 'off',
      // TypeScript compilation already ensures that named imports exist in the referenced module
      'import-x/named': 'off',
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
