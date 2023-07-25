// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const lightCodeTheme = require('prism-react-renderer/themes/github');

require('dotenv').config();

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Markprompt + Algolia demo',
  tagline: 'Markprompt in Docusaurus',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://markprompt-docusaurus.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  themes: ['@markprompt/docusaurus-theme-search'],

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
        references: {
          getHref: (reference) => reference.file?.path?.replace(/\.[^.]+$/, ''),
          getLabel: (reference) => {
            return reference.meta?.leadHeading?.value || reference.file?.title;
          },
        },
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
      navbar: {
        title: 'Markprompt',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            href: 'https://github.com/motifland/markprompt-js/blob/main/examples/with-docusaurus',
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
