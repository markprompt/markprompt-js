# Markprompt Docusaurus plugin

A [Markprompt](https://markprompt.com) plugin for [Docusaurus](https://docusaurus.io).

<br />
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@markprompt/docusaurus-theme-search">
    <img alt="" src="https://badgen.net/npm/v/@markprompt/docusaurus-theme-search">
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt-js/blob/main/packages/docusaurus-theme-search/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/@markprompt/docusaurus-theme-search">
  </a>
</p>

## Installation

Install the `@markprompt/docusaurus-theme-search` package via npm or yarn:

```sh
# npm
npm install @markprompt/docusaurus-theme-search

# Yarn
yarn add @markprompt/docusaurus-theme-search
```

## Usage

In your `docusaurus.config.js`, add `@markprompt/docusaurus-theme-search` to `themes`. Configure `markprompt` in the `themeConfig`.

```js
const config = {
  // …

  themes: [
    // …
    '@markprompt/docusaurus-theme-search',
  ],

  themeConfig:
    /** @type {import('@markprompt/docusaurus-theme-search').ThemeConfig} */ ({
      markprompt: {
        projectKey: 'Your markprompt key',
      },
    }),
};
```

Now a search button will appears on your Docusaurus page.

## Example

An example is available on <https://github.com/motifland/markprompt-js/tree/main/examples/with-docusaurus>.

## Community

- [Twitter @markprompt](https://twitter.com/markprompt)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://twitter.com/markprompt)).
