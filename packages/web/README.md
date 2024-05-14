# Markprompt Web

A prebuilt version of the Markprompt dialog, based on `@markprompt/react`, built
with Preact for bundle-size savings. Viable for use from vanilla JavaScript or
any framework.

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

Include the CSS on your page, via a link tag or by importing it in your
JavaScript:

```html
<!-- load from a CDN: -->
<link rel="stylesheet" href="https://esm.sh/@markprompt/css@0.30.1?css" />
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
    getHref: (reference) => reference.file.path.replace(/\.[^.]+$/, '');
    getLabel: (reference) => {
      return reference.meta?.leadHeading?.value || reference.file?.title;
    }
  },
});
```

where `YOUR-PROJECT-KEY` can be obtained in your project settings on
[Markprompt.com](https://markprompt.com/).

Options are optional and allow you to configure the texts and links used in the component to some extent. You will most likely want to pass `references.getHref` and `reference.getLabel` to transform your prompt references into links to your corresponding documentation, and `search.getHref` to transform search result paths into links to your documentation.

Styles are easily overridable for customization via targeting classes.
Additionally, see the [theming section](https://markprompt.com/docs/sdk/theming) in our documentation for a full list of variables.

## Usage via `<script>` tag

Besides initializing the Markprompt component yourselves from JavaScript, you
can load the script from a CDN. You can attach the options for the Markprompt
component to the window prior to loading our script:

```html
<link rel="stylesheet" href="https://esm.sh/@markprompt/css@latest?css" />
<script>
  window.markprompt = {
    projectKey: `YOUR-PROJECT-KEY`,
    container: `#markprompt`,
    options: {
      references: {
        getHref: (reference) => reference.file?.path?.replace(/\.[^.]+$/, ''),
        getLabel: (reference) => {
          return reference.meta?.leadHeading?.value || reference.file?.title;
        },
      },
    },
  };
</script>
<script type="module" src="https://esm.sh/@markprompt/web@latest/init"></script>

<div id="markprompt"></div>
```

> [!IMPORTANT]
> Consider locking the versions of your dependencies to avoid breaking changes. Always use versions that have been published at the same time.


## API

### `markprompt(projectKey, container, options?)`

Render a Markprompt dialog button.

#### Arguments

- `projectKey` (`string`): Your Markprompt project key.
- `container` (`HTMLElement | string`): The element or selector to render
  Markprompt into.
- `options` (`object`): Options for customizing Markprompt, see above.

When rendering the Markprompt component, it will render a search input-like
button by default. You have two other options:

- set `trigger.floating = true` to render a floating button
- set `trigger.customElement = true`, then
  `import { openMarkprompt } from '@markprompt/react'` and call
  `openMarkprompt()` from your code. This gives you the flexibility to render
  your own trigger element and attach whatever event handlers you would like
  and/or open the Markprompt dialog programmatically.

### `markpromptOpen()`

Open the Markprompt dialog programmatically.

### `markpromptClose()`

Close the Markprompt dialog programmatically.

### `markpromptChat(projectKey, container, options?)`

Render the Markprompt chat view standalone, outside of a dialog.

- `projectKey` (`string`): Your Markprompt project key.
- `container` (`HTMLElement | string`): The element or selector to render
  Markprompt into.
- `options` (`object`): Options for customizing Markprompt.

### `ticketDeflectionForm(container, options)`

Renders a standalone ticket deflection form into the provided container.

- `container` (`HTMLElement | string`): The element or selector to render the form into.
- `options` (`object`): Options for customizing the form, see below.

## Documentation

Find the full documentation and implementation examples for the SDK on the
[Markprompt docs](https://markprompt.com/docs/sdk).

## Community

- [X](https://x.com/markprompt)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://x.com/markprompt)).

## License

[MIT](./LICENSE) © [Markprompt](https://markprompt.com)
