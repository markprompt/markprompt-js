# `@markprompt/web`

A prebuilt version of the Markprompt dialog, based on `@markprompt/react`, built with Preact for bundle-size savings. Viable for use from vanilla JavaScript or any framework.

<br />
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/markprompt">
    <img alt="" src="https://badgen.net/npm/v/markprompt">
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt/blob/main/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/markprompt">
  </a>
</p>

## Installation

Install the package from NPM:

```sh
npm add @markprompt/web @markprompt/css
```

## Usage

Include the CSS on your page, via a link tag or by importing it in your JavaScript:

```html
<!-- load from a CDN: -->
<link rel="stylesheet" href="https://esm.sh/@markprompt/css@0.2.0?css" />
```

```js
import '@markprompt/css';
```

Call the `markprompt` function with your project key:

```js
import { markprompt } from '@markprompt/web';

const markpromptEl = document.querySelector('#markprompt');

markprompt('YOUR-PROJECT-KEY', markpromptEl, {
  references: {
    transformReferenceId: (referenceId) => ({
      text: referenceId.replace('-', ' '),
      href: `/docs/${referenceId}`,
    }),
  },
});
```

where `YOUR-PROJECT-KEY` can be obtained in your project settings on [Markprompt.com](https://markprompt.com/).

Options are optional and allow you to configure the texts used in the component to some extent. You will most likely want to pass `transformReferenceId` to transform your reference ids into links to your corresponding documentation and `getResultHref` to transform search result paths into links to your documentation.

```ts
import {
  type SubmitPromptOptions,
  type SubmitSearchQueryOptions,
} from '@markprompt/core';
import type { SearchResultWithMetadata } from '@markprompt/react';

type MarkpromptOptions = {
  /**
   * Display format.
   * @default "dialog"
   **/
  display?: 'plain' | 'dialog';
  close?: {
    /**
     * `aria-label` for the close modal button
     * @default "Close Markprompt"
     **/
    label?: string;
  };
  description?: {
    /**
     * Visually hide the description
     * @default true
     **/
    hide?: boolean;
    /**
     * Description text
     **/
    text?: string;
  };
  prompt?: SubmitPromptOptions & {
    /**
     * Label for the prompt input
     * @default "Ask me anything…"
     **/
    label?: string;
    /**
     * Placeholder for the prompt input
     * @default "Ask me anything…"
     **/
    placeholder?: string;
    /**
     * When search is enabled, this label is used for the CTA button
     * that opens the prompt.
     * @default "Ask Docs AI…"
     **/
    cta?: string;
  };
  references?: {
    /**
     * Callback to transform a reference id into an href and text
     **/
    transformReferenceId: (referenceId: string) => {
      href: string;
      text: string;
    };
    /** Loading text, default: `Fetching relevant pages…` */
    loadingText?: string;
    /**
     * References title
     * @default "Answer generated from the following sources:"
     **/
    referencesText?: string;
  };
  /**
   * Enable and configure search functionality
   */
  search?: SubmitSearchQueryOptions & {
    /**
     * Enable search
     * @default false
     **/
    enabled?: boolean;
    /** Callback to transform a search result into an href */
    getResultHref?: (
      path: string,
      sectionHeading: SectionHeading | undefined,
      source: Source,
    ) => string;
  };
  trigger?: {
    /**
     * `aria-label` for the open button
     * @default "Open Markprompt"
     **/
    label?: string;
    /**
     * Placeholder text for non-floating element.
     * @default "Ask docs"
     **/
    placeholder?: string;
    /**
     * Should the trigger button be displayed as a floating button at the bottom right of the page?
     * Setting this to false will display a trigger button in the element passed
     * to the `markprompt` function.
     */
    floating?: boolean;
  };
  title?: {
    /**
     * Visually hide the title
     * @default true
     **/
    hide?: boolean;
    /**
     * Text for the title
     * @default "Ask me anything"
     **/
    text?: string;
  };
  /**
   * Show Markprompt branding
   * @default true
   **/
  showBranding?: boolean;
};
```

Styles are easily overridable for customization via targeting classes. Additionally, see the [styling section](https://markprompt.com/docs#styling) in our documentation for a full list of variables.

## Usage via `<script>` tag

Besides initializing the Markprompt component yourselves from JavaScript, you can load the script from a CDN. You can attach the options for the Markprompt component to the window prior to loading our script:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@markprompt/css@0.2.0/markprompt.css"
/>
<script>
  window.markprompt = {
    projectKey: `YOUR-PROJECT-KEY`,
    container: `#markprompt`,
    options: {
      references: {
        transformReferenceId: (referenceId) => ({
          text: referenceId.replace('-', ' '),
          href: `/docs/${referenceId}`,
        }),
      },
    },
  };
</script>
<script
  async
  src="https://unpkg.com/@markprompt/web@0.5.0/dist/init.js"
></script>
```

## API

### `markprompt(projectKey, container, options?)`

Render a Markprompt dialog button.

#### Arguments

- `projectKey` (`string`): Your Markprompt project key.
- `container` (`HTMLElement | string`): The element or selector to render Markprompt into.
- `options` (`object`): Options for customizing Markprompt.

#### Options

- `projectKey` (`string`): The project key associated to your project. It can be obtained in the project settings on [Markprompt.com](https://markprompt.com/) under "Project key".
- `close` (`object`): Options for the close modal button
- `close.label` (`string`): `aria-label` for the close modal button (Default: `Close Markprompt`)
- `description` (`object`): Options for the description
- `description.hide` (`boolean`): Visually hide the description (Default: `true`)
- `description.text` (`string`): Description text
- `prompt` (`object`): Options for the prompt
- `prompt.label` (`string`): Label for the prompt input (Default: `Ask me anything…`)
- `prompt.placeholder` (`string`): Placeholder for the prompt input (Default: `Ask me anything…`)
- `prompt.cta` (`string`): When search is enabled, this label is used for the CTA button that opens the prompt (Default: `Ask Docs AI…`)
- `prompt.completionsUrl` (`string`): URL at which to fetch completions. (Default: `https://api.markprompt.com/v1/completions`)
- `prompt.iDontKnowMessage` (`string`): Message returned when the model does not have an answer. (Default: `Sorry, I am not sure how to answer that.`)
- `prompt.model` (`string`): The OpenAI model to use. (Default: `gpt-3.5-turbo`)
- `prompt.promptTemplate` (`string`): The prompt template. (Default: `You are a very enthusiastic company representative who loves to help people! Given the following sections from the documentation (preceded by a section id), answer the question using only that information, outputted in Markdown format. If you are unsure and the answer is not explicitly written in the documentation, you can say 'I don't know' and the question will be passed to the OpenAI model to answer.\n\n# Sections\n\n{{#each sections}}\n## {{this.id}}\n\n{{this.content}}\n\n{{/each}}\n\n# Question\n\n{{question}}\n\n# Answer\n\n`)
- `prompt.temperature` (`number`): The model temperature. (Default: `0.1`)
- `prompt.topP` (`number`): The model top P. (Default: `1`)
- `prompt.frequencyPenalty` (`number`): The model frequency penalty. (Default: `0`)
- `prompt.presencePenalty` (`number`): The model presence penalty. (Default: `0`)
- `prompt.maxTokens` (`number`): The max number of tokens to include in the response. (Default: `500`)
- `prompt.sectionsMatchCount` (`number`): The number of sections to include in the prompt context. (Default: `10`)
- `prompt.sectionsMatchThreshold` (`number`): The similarity threshold between the input question and selected sections. (Default: `0.5`)
- `prompt.signal` (`AbortSignal`): AbortController signal.
- `references` (`object`): Options for the references
- `references.transformReferenceId` (`function`): Callback to transform a reference id into an href and text
- `references.loadingText` (`string`): Loading text (Default: `Fetching relevant pages…`)
- `references.referencesText` (`string`): References title (Default: `Answer generated from the following sources:`)
- `search` (`object`): Options for search
- `search.enable` (`boolean`): Enable search (Default: `false`)
- `search.getResultHref` (`function`): Callback to transform a search result into an href
- `search.enable` (`boolean`): Whether or not to enable search. (Default: `true`)
- `search.limit` (`number`): Maximum amount of results to return. (Default: `5`)
- `search.searchUrl` (`string`): URL at which to fetch search results. (Default: `https://api.markprompt.com/v1/search`)
- `search.signal` (`AbortSignal`): AbortController signal.
- `trigger` (`object`): Options for the trigger
- `trigger.customElement` (`boolean`): Use a custom element as the trigger. Will disable rendering any trigger element. Use `openMarkprompt()` to trigger the Markprompt dialog. (Default: `false`)
- `trigger.label` (`string`): `aria-label` for the open button (Default: `Open Markprompt`)
- `trigger.placeholder` (`string`): Placeholder text for non-floating element (Default: `Ask docs`)
- `title` (`object`): Options for the title
- `title.hide` (`boolean`): Visually hide the title (Default: `true`)
- `title.text` (`string`): Title text (Default: `Ask me anything`)
- `showBranding` (`boolean`): Show Markprompt branding (Default: `true`)

When rendering the Markprompt component, it will render a search input-like button by default. You have two other options:

- set `trigger.floating = true` to render a floating button
- set `trigger.customElement = true`, then `import { openMarkprompt } from '@markprompt/react'` and call `openMarkprompt()` from your code. This gives you the flexibility to render your own trigger element and attach whatever event handlers you would like and/or open the Markprompt dialog programmatically.

## Documentation

The full documentation for `@markprompt/web` can be found on the [Markprompt docs](https://markprompt.com/docs#javascript).

## Community

- [Twitter](https://twitter.com/markprompt)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://twitter.com/markprompt)).

## License

[MIT](./LICENSE) © [Motif](https://motif.land)
