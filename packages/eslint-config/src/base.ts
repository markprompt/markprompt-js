import type { ESLint, Linter } from 'eslint';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importX from 'eslint-plugin-import-x';
import promise from 'eslint-plugin-promise';
import turbo from 'eslint-plugin-turbo';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export const base = <T extends string>(
  _rootDir: T,
  _allowDefaultProject?: string[],
): Linter.Config[] => [
  {
    ignores: ['.turbo/', 'dist/'],
  },

  // eslint/js config and rules
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
    // only enable @eslint/js rules that Biome doesn't cover
    files: ['**/*.{js,ts,jsx,tsx,cjs,cts,mjs,mts}'],
    rules: {
      'no-constant-binary-expression': 'error',
      'no-delete-var': 'error',
      'no-invalid-regexp': 'error',
      'no-octal': 'error',
      'no-unexpected-multiline': 'error',
      'no-useless-backreference': 'error',
    },
  },

  // typescript-eslint config and rules
  {
    files: ['**/*.{js,ts,jsx,tsx,cjs,cts,mjs,mts}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin as ESLint.Plugin,
    },
    languageOptions: {
      parser: tseslint.parser as Linter.Parser,
      parserOptions: {
        // tsconfigRootDir: rootDir,
        // projectService: allowDefaultProject
        //   ? {
        //       allowDefaultProject,
        //     }
        //   : true,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
  {
    files: ['**/*.{js,ts,jsx,tsx,cjs,cts,mjs,mts}'],
    // only enable @typescript-eslint rules that Biome doesn't cover
    rules: {
      // '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/class-literal-property-style': 'error',
      '@typescript-eslint/consistent-generic-constructors': 'error',
      '@typescript-eslint/consistent-indexed-object-style': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-confusing-non-null-assertion': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      // '@typescript-eslint/no-misused-promises': [
      //   'error',
      //   { checksVoidReturn: false },
      // ],
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/triple-slash-reference': 'error',
    },
  },

  // promise config and rules
  {
    files: ['**/*.{js,ts,jsx,tsx,cjs,cts,mjs,mts}'],
    ...promise.configs['flat/recommended'],
  },

  {
    files: ['**/*.{js,ts,jsx,tsx,cjs,cts,mjs,mts}'],
    plugins: importX.flatConfigs.recommended.plugins as {
      [plugin: string]: ESLint.Plugin;
    },
    settings: {
      'import-x/extensions': [
        '.js',
        '.jsx',
        '.cjs',
        '.mjs',
        '.ts',
        '.tsx',
        '.cts',
        '.mts',
      ],
      'import-x/external-module-folders': [
        'node_modules',
        'node_modules/@types',
      ],
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.cts', '.mts'],
      },
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
        }),
      ],
    },
  },
  {
    files: ['**/*.{js,ts,jsx,tsx,cjs,cts,mjs,mts}'],
    // https://typescript-eslint.io/troubleshooting/typed-linting/performance#eslint-plugin-import
    rules: {
      'import-x/no-named-as-default': 'error',
      'import-x/no-cycle': 'error',
      'import-x/no-unused-modules': 'error',
      'import-x/no-deprecated': 'error',
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

  {
    plugins: {
      turbo: turbo,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'error',
    },
  },
];
