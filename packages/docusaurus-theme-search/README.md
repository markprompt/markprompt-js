# `@markprompt/docusaurus-theme-search`

A [Markprompt](https://markprompt.com) button for [Docusaurus](https://docusaurus.io).

<br />
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@markprompt/docusaurus-theme-search">
    <img alt="" src="https://badgen.net/npm/v/@markprompt/docusaurus-theme-search">
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt-js/blob/main/packages/docusaurus-theme-search/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/@markprompt/docusaurus-theme-search">
  </a>
  <a aria-label="Coverage" href="https://app.codecov.io/gh/motifland/markprompt-js/tree/main/packages%2Fdocusaurus-theme-search">
    <img alt="" src="https://codecov.io/gh/motifland/markprompt-js/branch/main/graph/badge.svg" />
  </a>
</p>

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)
- [Community](#community)
- [Authors](#authors)
- [License](#license)

## Installation

```sh
npm install @markprompt/docusaurus-theme-search
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

Now a search button will appears on your docusaurus page.

## Example

An example is available on <https://github.com/motifland/markprompt-js/tree/main/examples/with-docusaurus>.

## Community

- [Twitter @markprompt](https://twitter.com/markprompt)
- [Twitter @motifland](https://twitter.com/motifland)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Motif](https://motif.land)
([@motifland](https://twitter.com/motifland)).

## License

[MIT](./LICENSE) © [Motif](https://motif.land)
