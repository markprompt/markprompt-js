import { fixupPluginRules } from '@eslint/compat';
import nextPlugin from '@next/eslint-plugin-next';
import tanstack from '@tanstack/eslint-plugin-query';
import type { Linter } from 'eslint';

export const next: Linter.Config[] = [
  {
    ignores: ['.next/'],
  },
  {
    name: 'next',
    plugins: { '@next/next': fixupPluginRules(nextPlugin) },
    rules: {
      ...(nextPlugin.configs?.recommended as Linter.Config<Linter.RulesRecord>)
        .rules,
      ...(
        nextPlugin.configs?.[
          'core-web-vitals'
        ] as Linter.Config<Linter.RulesRecord>
      ).rules,
    },
  },
  ...tanstack.configs['flat/recommended'],
];
