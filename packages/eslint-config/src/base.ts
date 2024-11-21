import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import type { Linter } from 'eslint';
import importX from 'eslint-plugin-import-x';
import promise from 'eslint-plugin-promise';
import globals from 'globals';
import ts, { parser } from 'typescript-eslint';

const __pathname = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__pathname);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export const base = (
  rootDir: string,
  allowDefaultProject?: string[],
): Linter.Config[] => [
  {
    ignores: ['.turbo/', 'dist/'],
  },
  js.configs.recommended,
  promise.configs['flat/recommended'],
  // eslint-disable-next-line import-x/no-named-as-default-member
  ...(ts.configs.recommended as Linter.Config[]),
  // eslint-disable-next-line import-x/no-named-as-default-member
  ...(ts.configs.stylistic as Linter.Config[]),
  importX.flatConfigs.recommended as Linter.Config,
  importX.flatConfigs.typescript,
  ...(compat.extends('turbo') as Linter.Config[]),
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
