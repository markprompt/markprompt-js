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
<link rel="stylesheet" href="https://esm.sh/@markprompt/css@0.1.1?css" />
```

```js
import '@markprompt/css';
```

Call the `markprompt` function with your project key:

```js
import { markprompt } from '@markprompt/web';

const markpromptEl = document.querySelector('#markprompt');

markprompt('<project-key>', markpromptEl, {
  references: {
    transformReferenceId: (referenceId) => ({
      text: referenceId.replace('-', ' '),
      href: `/docs/${referenceId}`,
    }),
  },
});
```

where `project-key` can be obtained in your project settings on [Markprompt.com](https://markprompt.com/).

Options are optional and allow you to configure texts the component to some extent. You will most likely want to pass `transformReferenceId` to transform your reference ids into links to your corresponding documentation.

```ts
type Options = {
  /** Props for the close modal button */
  close?: {
    /** Aria-label for the close modal button */
    label?: string;
  };
  /** Props for the description */
  description?: {
    /** Whether to hide the description, default: `true` */
    hide?: boolean;
    /** Text for the description */
    text?: string;
  };
  /** Props for the prompt */
  prompt?: {
    /** Label for the prompt input, default: `Your prompt` */
    label?: string;
    /** Placeholder for the prompt input, default: `Ask me anything…` */
    placeholder?: string;
  };
  references?: {
    /** Callback to transform a reference id into an href and text */
    transformReferenceId?: (referenceId: string) => {
      href: string;
      text: string;
    };
    /** Loading text, default: `Fetching relevant pages…` */
    loadingText?: string;
    /** References title, default: `Answer generated from the following sources:` */
    referencesText?: string;
  };
  /** Props for the trigger */
  trigger?: {
    /** Aria-label for the trigger button */
    label?: string;
  };
  /** Props for the title */
  title?: {
    /** Whether to hide the title, default: `true` */
    hide?: boolean;
    /** Text for the title: default `Ask me anything` */
    text?: string;
  };
};
```

Styles are easily overridable for customization via targeting classes. Additionally, see the [styling section](https://markprompt.com/docs#styling) in our documentation for a full list of variables.

## Usage via `<script>` tag

Besides initializing the Markprompt component yourselves from JavaScript, you can load the script from a CDN. You can attach the options for the Markprompt component to the window prior to loading our script:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@markprompt/css@0.1.1/markprompt.css"
/>
<script>
  window.markprompt = {
    projectKey: `<your-project-key>`,
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
  src="https://unpkg.com/@markprompt/web@0.4.1/dist/init.js"
></script>
```

## Documentation

The full documentation for `@markprompt/web` can be found on the [Markprompt docs](https://markprompt.com/docs#%40markprompt%2Fweb).

## Community

- [Twitter @markprompt](https://twitter.com/markprompt)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://twitter.com/markprompt)).
