Markprompt is AI for customer support.

<br />

<p align="center">
  <a href="https://x.com/markprompt">
    <img src="https://img.shields.io/twitter/follow/markprompt?style=flat&label=%40markprompt&logo=twitter&color=0bf&logoColor=fff" alt="X" />
  </a>
  <a aria-label="License" href="https://github.com/markprompt/markprompt-js/blob/main/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/markprompt">
  </a>
</p>

## Components

This repo contains various UI libraries for building prompts based on the
Markprompt API:

- [`@markprompt/core`](packages/core#readme) — shared utility functions to speak
  with the Markprompt API.
- [`@markprompt/react`](packages/react#readme) — a React component.
- [`@markprompt/web`](packages/web#readme) — a pre-built Markprompt component,
  based on `@markprompt/react`, built with Preact for bundle-size savings.
  Viable for use with vanilla JavaScript or any framework.
- [`@markprompt/docusaurus-theme-search`](packages/docusaurus-theme-search#readme)
  — a Markprompt search theme for Docusaurus.

and some example implementations:

- [`with-css-modules`](examples/with-css-modules#readme) — a web application based on `@markprompt/react`, Vite and CSS Modules.
- [`with-custom-trigger`](examples/with-custom-trigger#readme) — a reference implementation of `@markprompt/web` using a custom trigger button.
- [`with-custom-trigger-react`](examples/with-custom-trigger-react#readme) — a reference implementation of `@markprompt/react` using a custom trigger button.
- [`with-docusaurus`](examples/with-docusaurus#readme) — a Docusaurus project with `@markprompt/docusaurus-theme-search`.
- [`with-docusaurus-algolia`](examples/with-docusaurus-algolia#readme) — a Docusaurus project with `@markprompt/docusaurus-theme-search` and our Algolia
  integration.
- [`with-docusaurus-swizzled`](examples/with-docusaurus-swizzled#readme) — a Docusaurus project with Markprompt and [theme-search-algolia](https://docusaurus.io/docs/api/themes/@docusaurus/theme-search-algolia).
- [`with-init`](examples/with-init#readme) — a web application based on
  `@markprompt/web` using a global instance of Markprompt.
- [`with-markprompt-web`](examples/with-markprompt-web#readme) — a web application based on `@markprompt/web` and Vite. based on `@markprompt/react`, Vite and CSS Modules.
- [`with-next`](examples/with-next#readme) — a web application based on `@markprompt/react`, `@markprompt/web`, and Next.js.
- [`with-clear-storage`](examples/with-clear-storage/#readme) - a web application based on `@markprompt/react` and the Next.js App Router showcasing an explicit storage reset.
- [`with-function-calling`](examples/with-function-calling#readme) — a web application based on `@markprompt/react` and Next.js showcasing the use for [OpenAI function calling](https://platform.openai.com/docs/guides/function-calling).
- [`with-automatic-ticket-creation`](examples/with-automatic-ticket-creation#readme) — a web application based on `@markprompt/web` and Vite showcasing automatic ticket creation.

## Running examples

To run examples from this monorepo:

```sh
pnpm turbo dev --filter with-markprompt-web...
```

## Publish

To publish an updated version:

```sh
# bump the package's version
pnpm version
pnpm publish
```

## Documentation

To use the Markprompt platform as is, please refer to the
[Markprompt documentation](https://markprompt.com/docs).

## Community

- [X](https://x.com/14__ai)

## Authors

This library is created by the team behind [14.ai](https://14.ai)
([@14__ai](https://x.com/14__ai)).

## License

[MIT](./LICENSE) © [14.ai](https://14.ai)
