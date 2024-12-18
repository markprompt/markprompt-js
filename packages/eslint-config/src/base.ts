import type { ESLint, Linter } from 'eslint';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importX from 'eslint-plugin-import-x';
import promise from 'eslint-plugin-promise';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export const base = <T extends string>(
  rootDir: T,
  allowDefaultProject?: string[],
): Linter.Config[] => [
  {
    ignores: ['.turbo/', 'dist/'],
  },
  {
    languageOptions: {
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
      '@typescript-eslint': tseslint.plugin as ESLint.Plugin,
    },
    languageOptions: {
      parser: tseslint.parser as Linter.Parser,
      parserOptions: {
        tsconfigRootDir: rootDir,
        projectService: allowDefaultProject
          ? {
              allowDefaultProject,
            }
          : true,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
  {
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
        }),
      ],
    },
  },
  {
    // only enable @eslint/js rules that Biome doesn't cover
    rules: {
      'no-constant-binary-expression': 'error',
      'no-delete-var': 'error',
      'no-invalid-regexp': 'error',
      'no-octal': 'error',
      'no-unexpected-multiline': 'error',
      'no-useless-backreference': 'error',
    },
  },
  {
    // only enable @typescript-eslint rules that Biome doesn't cover
    rules: {
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/class-literal-property-style': 'error',
      '@typescript-eslint/consistent-generic-constructors': 'error',
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-base-to-string': 'error',
      '@typescript-eslint/no-confusing-non-null-assertion': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-duplicate-type-constituents': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-implied-eval': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-enum-comparison': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-unary-minus': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/non-nullable-type-assertion-style': 'error',
      '@typescript-eslint/prefer-find': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-promise-reject-errors': 'error',
      '@typescript-eslint/prefer-regexp-exec': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/return-await': 'error',
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/unbound-method': 'error',
    },
  },

  promise.configs['flat/recommended'],

  {
    plugins: importX.flatConfigs.recommended.plugins as Record<
      string,
      ESLint.Plugin
    >,
  },

  // importX.flatConfigs.recommended as Linter.Config,
  // importX.flatConfigs.typescript,
  // ...turbo,

  // {
  //   rules: {
  //     '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  //     '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
  //     // https://github.com/import-js/eslint-plugin-import/issues/2340
  //     'import-x/namespace': 'off',
  //     'import-x/order': [
  //       'error',
  //       {
  //         alphabetize: {
  //           order: 'asc',
  //           caseInsensitive: true,
  //         },

  //         groups: [
  //           'builtin',
  //           'external',
  //           'internal',
  //           ['parent', 'sibling', 'index'],
  //           'object',
  //         ],

  //         pathGroups: [
  //           {
  //             pattern: '@/**',
  //             group: 'internal',
  //           },
  //         ],

  //         'newlines-between': 'always',
  //       },
  //     ],
  //   },
  // },
];
