# Example with Docusaurus search plugin

This example shows you how to use Markprompt in [Docusaurus](https://docusaurus.io/) using the `@markprompt/docusaurus-theme-search` plugin.

## Installation

```
$ npm install
```

## Local development

```
$ npm start
```

This command starts a local development server. Most changes are reflected live without having to restart the server.

## Configuration

### Usage with other search providers

If you are using another search provider, you can:

1. Use swizzling to combine both search plugins. Please refer to the [Docusaurus example with swizzling](https://github.com/motifland/markprompt-js/tree/main/examples/with-docusaurus-swizzled) for an example with Algolia.
2. If using Algolia specifically, use the Markprompt Algolia integration. Please refer to the [Docusaurus example with Algolia](https://github.com/motifland/markprompt-js/tree/main/examples/with-docusaurus-algolia) for an example.

### Custom link mappings

If you need to set up custom link mappings between search results or prompt references and your website page URLs, you need to do the following:

1. Create a JS file in your project source, e.g. in `./src/markprompt-config.js`, and paste the following:

```js
if (typeof window !== 'undefined') {
  window.markpromptConfigExtras = {
    references: {
      // References link mappings:
      getHref: (reference) => reference.file?.path?.replace(/\.[^.]+$/, ''),
      getLabel: (reference) =>
        reference.meta?.leadHeading?.value || reference.file?.title,
    },
    search: {
      // Search results link mappings:
      getHref: (result) => result.url,
      getHeading: (result) => result.hierarchy?.lvl0,
      getTitle: (result) => result.hierarchy?.lvl1,
      getSubtitle: (result) => result.hierarchy?.lvl2,
    },
  };
}
```

Adapt the mapping functions to fit your needs.

2. Import the file as a client module in `docusaurus.config.js`:

```js
/** @type {import('@docusaurus/types').Config} */
const config = {
  // ...
  clientModules: [require.resolve('./src/markprompt-config.js')],
  // ...
};

module.exports = config;
```

### CSS

To avoid interference between Markprompt styles and the default styles from `@docusaurus/preset-classic`, add the following to your custom CSS (`./src/css/custom.css`):

```css
ul.MarkpromptSearchResults {
  margin: 0 !important;
  padding-left: 0 !important;
}

:where(.MarkpromptSearchResult a) {
  color: inherit !important;
  text-decoration: none !important;
}

:where([aria-selected='true'] .MarkpromptSearchResultLink) {
  background-color: var(--markprompt-primary) !important;
  color: var(--markprompt-primaryForeground) !important;
}
```
