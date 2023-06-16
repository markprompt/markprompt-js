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
  <a aria-label="Coverage" href="https://app.codecov.io/gh/motifland/markprompt-js/tree/main/packages%2Fdocusaurus-theme-search">
    <img alt="" src="https://codecov.io/gh/motifland/markprompt-js/branch/main/graph/badge.svg" />
  </a>
</p>

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Swizzling](#swizzling)
- [Example](#example)
- [Community](#community)
- [Authors](#authors)

## Installation

```sh
npm install @markprompt/docusaurus-theme-search
```

## Usage

### Basic Usage

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
        projectKey: 'Your Markprompt key',
      },
    }),
};
```

Now a search button will appears on your docusaurus page.

### Swizzling

The Markprompt `SearchBar` can be swizzled. This allows you to fully customize the prompt. To swizzle, run:

```js
npx docusaurus swizzle '@markprompt/docusaurus-theme-search' SearchBar --typescript
```

Choose `Wrap`, and confirm.

This is useful for example if you want to add another search provider in addition to Markprompt. Typically you will want to wrap `<Markprompt.Root>` in a fragment and add your custom search provider.

```tsx
export default function SearchBar() {
  const { siteConfig } = useDocusaurusContext();
  const markpromptConfig = siteConfig.themeConfig.markprompt;

  return (
    <>
      <YourSearchComponent />
      <Markprompt.Root {...markpromptConfig}>
    </>
  )
}
```

## Example

An example is available on <https://github.com/motifland/markprompt-js/tree/main/examples/with-docusaurus>.

## Community

- [Twitter @markprompt](https://twitter.com/markprompt)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://twitter.com/markprompt)).
