// types exist but are wrong: https://github.com/jsx-eslint/eslint-plugin-react/pull/3840
declare module 'eslint-plugin-react-refresh' {
  import type { Plugin } from 'eslint';

  const plugin: Plugin;

  export = plugin;
}
