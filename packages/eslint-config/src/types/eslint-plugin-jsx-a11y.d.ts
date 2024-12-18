declare module 'eslint-plugin-jsx-a11y' {
  import type { Linter } from 'eslint';

  interface Plugin {
    flatConfigs: {
      recommended: Linter.Config;
    };
  }

  const plugin: Plugin;

  export = plugin;
}
