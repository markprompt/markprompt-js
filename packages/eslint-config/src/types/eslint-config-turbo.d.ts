declare module 'eslint-config-turbo/flat' {
  // biome-ignore lint/correctness/noUnusedImports: this is correct in d.ts files
  import type { Linter } from 'eslint';
  const config: Linter.Config[];
  export = config;
}
