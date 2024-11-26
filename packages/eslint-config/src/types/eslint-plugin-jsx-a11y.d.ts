declare module 'eslint-plugin-jsx-a11y' {
  // biome-ignore lint/correctness/noUnusedImports: this is correct in d.ts files
  import type { Linter } from 'eslint';

  interface Plugin {
    flatConfigs: {
      recommended: Linter.Config;
    };
  }

  const plugin: Plugin;

  export = plugin;
}
