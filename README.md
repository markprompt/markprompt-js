<a href="https://markprompt.com">
  <img alt="Markprompt – Enterprise-grade AI chatbots for your website and docs" src="https://github.com/motifland/markprompt-js/assets/504893/9df7ac5a-1ac3-4b33-9bb3-a146d119ed73">
  <h1 align="center">Markprompt</h1>
</a>

Markprompt is a platform for building GPT-powered prompts. It takes Markdown, Markdoc, MDX, reStructuredText, HTML and plain text files (from a GitHub repo, website or file uploads), and creates embeddings that you can use to create a prompt, for instance using the companion [headless Markprompt React components or our prebuilt dialog](https://markprompt.com/docs#components). Markprompt also offers analytics, so you can gain insights on how visitors interact with your docs.

<br />

<p align="center">
  <a href="https://twitter.com/markprompt">
    <img src="https://img.shields.io/twitter/follow/markprompt?style=flat&label=%40markprompt&logo=twitter&color=0bf&logoColor=fff" alt="Twitter" />
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt-js/blob/main/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/markprompt">
  </a>
</p>

## Components

This repo contains various UI libraries for building prompts based on the Markprompt API:

- [`@markprompt/core`](packages/core#readme) — shared utility functions to speak with the Markprompt API
- [`@markprompt/react`](packages/react#readme) — a headless React component
- [`@markprompt/web`](packages/web#readme) — a pre-built Markprompt dialog, based on `@markprompt/react`, built with Preact for bundle-size savings. Viable for use with vanilla JavaScript or any framework.
- [`@markprompt/docusaurus-theme-search`](packages/docusaurus-theme-search#readme) — a Markprompt search theme for Docusaurus

and some example implementations:

- [`with-next`](examples/with-next#readme) — a web application based on `@markprompt/react`, `@markprompt/web`, and Next.js
- [`with-markprompt-web`](examples/with-markprompt-web#readme) — a web application based on `@markprompt/web` and Vite
- [`with-css-modules`](examples/with-css-modules#readme) — a web application based on `@markprompt/react`, Vite and CSS Modules
- [`with-docusaurus`](examples/with-docusaurus#readme) — a Docusaurus project with `@markprompt/docusaurus-theme-search`
- [`with-docusaurus-swizzled`](examples/with-docusaurus-swizzled#readme) — a Docusaurus project with Markprompt and [theme-search-algolia](https://docusaurus.io/docs/api/themes/@docusaurus/theme-search-algolia)

## Documentation

To use the Markprompt platform as is, please refer to the [Markprompt documentation](https://markprompt.com/docs).

## Community

- [Twitter @markprompt](https://twitter.com/markprompt)
- [Twitter @motifland](https://twitter.com/motifland)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

Created by the team behind [Motif](https://motif.land)
([@motifland](https://twitter.com/motifland)).

## License

[MIT](./LICENSE) © [Motif](https://motif.land)
