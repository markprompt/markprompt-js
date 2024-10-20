import type { Linter } from 'eslint';

export const biome: Linter.Config[] = [
  // these rules have been superseded by Biome
  {
    name: 'biome',
    rules: {
      // eslint builtin rules
      'constructor-super': 'off',
      'default-case-last': 'off',
      'default-param-last': 'off',
      'dot-notation': 'off',
      eqeqeq: 'off',
      'for-direction': 'off',
      'getter-return': 'off',
      'no-array-constructor': 'off',
      'no-async-promise-executor': 'off',
      'no-case-declarations': 'off',
      'no-class-assign': 'off',
      'no-compare-neg-zero': 'off',
      'no-cond-assign': 'off',
      'no-const-assign': 'off',
      'no-constant-condition': 'off',
      'no-constructor-return': 'off',
      'no-control-regex': 'off',
      'no-debugger': 'off',
      'no-dupe-args': 'off',
      'no-dupe-class-members': 'off',
      'no-dupe-keys': 'off',
      'no-duplicate-case': 'off',
      'no-else-return': 'off',
      'no-empty-character-class': 'off',
      'no-empty-function': 'off',
      'no-empty-pattern': 'off',
      'no-empty-static-block': 'off',
      'no-empty': 'off',
      'no-eval': 'off',
      'no-ex-assign': 'off',
      'no-extra-boolean-cast': 'off',
      'no-extra-label': 'off',
      'no-fallthrough': 'off',
      'no-func-assign': 'off',
      'no-global-assign': 'off',
      'no-import-assign': 'off',
      'no-inner-declarations': 'off',
      'no-label-var': 'off',
      'no-labels': 'off',
      'no-lone-blocks': 'off',
      'no-loss-of-precision': 'off',
      'no-misleading-character-class': 'off',
      'no-new-native-nonconstructor': 'off',
      'no-nonoctal-decimal-escape': 'off',
      'no-obj-calls': 'off',
      'no-param-reassign': 'off',
      'no-prototype-builtins': 'off',
      'no-redeclare': 'off',
      'no-regex-spaces': 'off',
      'no-self-assign': 'off',
      'no-self-compare': 'off',
      'no-sequences': 'off',
      'no-setter-return': 'off',
      'no-shadow-restricted-names': 'off',
      'no-sparse-arrays': 'off',
      'no-this-before-super': 'off',
      'no-undef-init': 'off',
      'no-unneeded-ternary': 'off',
      'no-unreachable': 'off',
      'no-unsafe-finally': 'off',
      'no-unsafe-negation': 'off',
      'no-unsafe-optional-chaining': 'off',
      'no-unused-labels': 'off',
      'no-unused-vars': 'off',
      'no-use-before-define': 'off',
      'no-useless-catch': 'off',
      'no-useless-concat': 'off',
      'no-useless-rename': 'off',
      'no-var': 'off',
      'no-with': 'off',
      'one-var': 'off',
      'prefer-arrow-callback': 'off',
      'prefer-const': 'off',
      'prefer-exponentiation-operator': 'off',
      'prefer-numeric-literals': 'off',
      'prefer-regex-literals': 'off',
      'prefer-rest-params': 'off',
      'prefer-template': 'off',
      'require-await': 'off',
      'require-yield': 'off',
      'use-isnan': 'off',
      'valid-typeof': 'off',

      // react/react-hooks rules
      'react/jsx-key': 'off',
      'react/jsx-no-comment-textnodes': 'off',
      'react/jsx-no-duplicate-props': 'off',
      'react/jsx-no-useless-fragment': 'off',
      'react/no-array-index-key': 'off',
      'react/no-children-prop': 'off',
      'react/prop-types': 'off',
      'react/void-dom-elements-no-children': 'off',

      // typescript-eslint rules
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/consistent-type-exports': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/default-param-last': 'off',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/no-dupe-class-members': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-non-null-assertion': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/no-loss-of-precision': 'off',
      '@typescript-eslint/no-misused-new': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-empty-export': 'off',
      '@typescript-eslint/prefer-as-const': 'off',
      '@typescript-eslint/prefer-enum-initializers': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/prefer-function-type': 'off',
      '@typescript-eslint/prefer-literal-enum-member': 'off',
      '@typescript-eslint/prefer-namespace-keyword': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },
];
