import { type PluginModule } from '@docusaurus/types';
// @ts-ignore
import type { Options } from '@markprompt/core';

declare namespace themeSearchMarkprompt {
  export interface MarkpromptConfig extends Options {
    projectKey: string;
  }

  export interface ThemeConfig {
    markprompt?: MarkpromptConfig;
  }
}

// eslint-disable-next-line no-redeclare
const themeSearchMarkprompt: PluginModule = () => ({
  name: '@markprompt/docusaurus-theme-search',
  getThemePath: () => '../dist/theme',
  getTypeScriptThemePath: () => '../src/theme',
  getSwizzleComponentList: () => ['SearchBar'],
});

themeSearchMarkprompt.validateThemeConfig = (data) => {
  return data.themeConfig;
};

export = themeSearchMarkprompt;
