import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import type { ThemeConfig as MarkpromptThemeConfig } from '@markprompt/docusaurus-theme-search';
import dotenv from 'dotenv';
import { themes } from 'prism-react-renderer';

dotenv.config();

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
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    markprompt: {
      // Set the project key here, on in a `.env` file. You can obtain
      // the project key in the Markprompt dashboard, under
      // project settings.
      projectKey: 'YOUR-PROJECT-KEY',
      trigger: { floating: false },
      chat: {
        systemPrompt: 'You are a friendly AI who loves to help people.',
      },
      search: { enabled: true },
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
      theme: themes.github,
      darkTheme: themes.dracula,
    },
  } satisfies Preset.ThemeConfig & MarkpromptThemeConfig,
} satisfies Config;

module.exports = config;
