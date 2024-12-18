declare module 'eslint-config-turbo/flat' {
  // biome-ignore lint/correctness/noUnusedImports: this is correct in d.ts files
  import type { Linter } from 'eslint';
  // biome-ignore lint/correctness/noUndeclaredVariables: false positive
  const config: Linter.Config[];

  export = config;
}
