// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const lightCodeTheme = require('prism-react-renderer/themes/github');

require('dotenv').config();

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Markprompt with swizzling',
  tagline: 'Markprompt with swizzling',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-test-site.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig & import('@markprompt/docusaurus-theme-search').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      markprompt: {
        // Set the project key here, on in a `.env` file. You can obtain
        // the project key in the Markprompt dashboard, under
        // project settings.
        projectKey: 'YOUR-MARKPROMPT-KEY',
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
      navbar: {
        title: 'Markprompt + Algolia demo',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            href: 'https://github.com/motifland/markprompt-js/blob/main/examples/with-docusaurus-swizzled',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        copyright: `Copyright © ${new Date().getFullYear()} Markprompt. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
