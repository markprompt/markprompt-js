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
      projectKey: 'YOUR-MARKPROMPT-PROJECT-KEY',
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
        // Set custom mappings between Algolia records and Markprompt results:
        getHref: (result) => result.url,
        getHeading: (result) => result.pageTitle,
        getTitle: (result) => result.pageDescription,
        getSubtitle: (result) => result.pageContent,
      },
    },
  },
};

module.exports = config;
```
