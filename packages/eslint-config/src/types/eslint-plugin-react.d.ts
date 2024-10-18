// types exist but are wrong: https://github.com/jsx-eslint/eslint-plugin-react/pull/3840
declare module 'eslint-plugin-react' {
  // biome-ignore lint/correctness/noUnusedImports: this is correct in d.ts files
  import type { Linter } from 'eslint';

  interface Plugin {
    configs: {
      flat: {
        recommended: Linter.Config;
        'jsx-runtime': Linter.Config;
      };
    };
  }

  const plugin: Plugin;

  export = plugin;
}
