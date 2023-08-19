# Example with Docusaurus search plugin

This example shows you how to use Markprompt with Algolia in [Docusaurus 2](https://docusaurus.io/) using the `@markprompt/docusaurus-theme-search` plugin.

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

To add Algolia to the Markprompt component, you need to add you Algolia keys to the Markprompt configuration in `docusaurus.config.js`. Furthermore, depending on the shape of your Algolia index, you may need to define custom mappings between Algolia records and Markprompt results. Here is a full example:

```js
const config = {
  // ...
  themes: ['@markprompt/docusaurus-theme-search'],
  themeConfig: {
    markprompt: {
      projectKey: 'YOUR-PROJECT-KEY',
      // By setting `floating` to false, use the standard
      // navbar search component.
      trigger: { floating: false },
      search: {
        enabled: true,
        provider: {
          name: 'algolia',
          apiKey: 'YOUR-ALGOLIA-API-KEY',
          appId: 'YOUR-ALGOLIA-APP-ID',
          indexName: 'YOUR-ALGOLIA-INDEX-NAME',
        },
      },
    },
  },
};

module.exports = config;
```

### Custom link mappings

If you need to set up custom link mappings between Algolia results or prompt references and your website page URLs, you need to do the following:

1. Create a JS file in your project source, e.g. in `./src/markprompt-config.js`, and paste the following:

```js
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
```

Adapt the mapping functions to fit your needs. 2. Import the file as a client module in `docusaurus.config.js`:

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
