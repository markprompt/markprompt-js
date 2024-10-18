declare module '@next/eslint-plugin-next' {
  // biome-ignore lint/correctness/noUnusedImports: this is correct in d.ts files
  import type { ESLint } from 'eslint';
  const pluginNext: ESLint.Plugin;
  export = pluginNext;
}
