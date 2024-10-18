declare module 'eslint-plugin-testing-library' {
  // biome-ignore lint/correctness/noUnusedImports: this is correct in d.ts files
  import type { Linter } from 'eslint';

  interface TestingLibraryPlugin {
    configs: {
      'flat/react': Linter.Config;
    };
  }

  const testingLibraryPlugin: TestingLibraryPlugin;

  export = testingLibraryPlugin;
}
