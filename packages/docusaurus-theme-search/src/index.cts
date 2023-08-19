import { type PluginModule } from '@docusaurus/types';
// @ts-ignore TypeScript doesn’t allows us to import types from an ESM file in a CJS file.
// Apart from that, TypeScript does recognize the type.
import type { MarkpromptProps } from '@markprompt/react';

declare namespace themeSearchMarkprompt {
  export type MarkpromptConfig = MarkpromptProps;

  export interface ThemeConfig {
    markprompt?: MarkpromptConfig;
  }
}

// eslint-disable-next-line no-redeclare
const themeSearchMarkprompt: PluginModule = (context, options) => {
  console.log("options", JSON.stringify(options, null, 2));
  return {
    name: '@markprompt/docusaurus-theme-search',
    getThemePath: () => '../dist/theme',
    getTypeScriptThemePath: () => '../src/theme',
    getSwizzleComponentList: () => ['SearchBar'],
  }
};

themeSearchMarkprompt.validateThemeConfig = (data) => {
  return data.themeConfig;
};

export = themeSearchMarkprompt;
