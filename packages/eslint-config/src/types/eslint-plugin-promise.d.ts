declare module 'eslint-plugin-promise' {
  // biome-ignore lint/correctness/noUnusedImports: this is correct in d.ts files
  import type { Linter } from 'eslint';

  interface PluginPromise {
    rules: Linter.RulesRecord;
    rulesConfig: Linter.RulesRecord;
    configs: {
      recommended: Linter.LegacyConfig;
      'flat/recommended': Linter.Config;
    };
  }

  const pluginPromise: PluginPromise;

  export = pluginPromise;
}
