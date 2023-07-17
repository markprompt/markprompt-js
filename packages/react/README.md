# Markprompt React

[Markprompt](https://markprompt.com)'s `@markprompt/react` library offers you both a simple, accessible, prebuilt React component that you can include in your codebase, as well as a set of React primitives that you can use to build your own custom Markprompt UI.

The `<Markprompt />` component is built with [Radix'](https://www.radix-ui.com/) [`Dialog component`](https://www.radix-ui.com/docs/primitives/components/dialog) and allows for limited control over the Markprompt UI, mostly offering you the ability to change texts as well as how prompt references and search results are linked to your website.

The `Markprompt.*` primitives offer you a fully customizable way to build your own UI and have full control.

In combination with [`@markprompt/css`](https://github.com/motifland/markprompt-js/tree/main/packages/css), the `<Markprompt />` component is a drop-in solution for most websites. You can also opt to provide your own styles, or override ours to your liking.

<br />
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@markprompt/react">
    <img alt="" src="https://badgen.net/npm/v/@markprompt/react">
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt-js/blob/main/packages/react/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/@markprompt/react">
  </a>
</p>

## Installation

Install the `@markprompt/react` package via `npm`, `yarn` or `pnpm`:

```sh
# npm
npm install @markprompt/react

# yarn
yarn add @markprompt/react

# pnpm
pnpm add @markprompt/react
```

## Usage

Example:

```jsx
import `@markprompt/css`;
import { Markprompt } from '@markprompt/react';

export function Component() {
  return <Markprompt projectKey="YOUR-PROJECT-KEY" />;
}
```

replacing `YOUR-PROJECT-KEY` with the key associated to your project. It can be obtained in the project settings on [Markprompt.com](https://markprompt.com/) under "Project key".

## API

### `<Markprompt />`

The pre-built Markprompt component. It accepts the following props:

- `projectKey` (`string`): The project key associated to your project. It can be obtained in the project settings on [Markprompt.com](https://markprompt.com/) under "Project key"
- `display` (`plain | dialog`): The way to display the prompt (Default: `dialog`)
- `close` (`object`): Options for the close modal button
- `close.label` (`string`): `aria-label` for the close modal button (Default: `Close Markprompt`)
- `close.visible` (`boolean`): Show the close button (Default: `true`)
- `description` (`object`): Options for the description
- `description.hide` (`boolean`): Visually hide the description (Default: `true`)
- `description.text` (`string`): Description text
- `prompt` (`object`): Options for the prompt
- `prompt.label` (`string`): Label for the prompt input (Default: `Ask AI`)
- `prompt.tabLabel` (`string`): Label for the tab bar (Default: `Ask AI`)
- `prompt.placeholder` (`string`): Placeholder for the prompt input (Default: `Ask AI…`)
- `prompt.apiUrl` (`string`): URL at which to fetch completions. (Default: `https://api.markprompt.com/v1/completions`)
- `prompt.iDontKnowMessage` (`string`): Message returned when the model does not have an answer. (Default: `Sorry, I am not sure how to answer that.`)
- `prompt.model` (`string`): The OpenAI model to use. (Default: `gpt-3.5-turbo`)
- `prompt.promptTemplate` (`string`): The prompt template. (Default: `You are a very enthusiastic company representative who loves to help people! Given the following sections from the documentation (preceded by a section id), answer the question using only that information, outputted in Markdown format. If you are unsure and the answer is not explicitly written in the documentation, say \"{{I_DONT_KNOW}}\".\n\nContext sections:\n---\n{{CONTEXT}}\n\nQuestion: \"{{PROMPT}}\"\n\nAnswer (including related code snippets if available):\n`)
- `prompt.temperature` (`number`): The model temperature. (Default: `0.1`)
- `prompt.topP` (`number`): The model top P. (Default: `1`)
- `prompt.frequencyPenalty` (`number`): The model frequency penalty. (Default: `0`)
- `prompt.presencePenalty` (`number`): The model presence penalty. (Default: `0`)
- `prompt.maxTokens` (`number`): The max number of tokens to include in the response. (Default: `500`)
- `prompt.sectionsMatchCount` (`number`): The number of sections to include in the prompt context. (Default: `10`)
- `prompt.sectionsMatchThreshold` (`number`): The similarity threshold between the input question and selected sections. (Default: `0.5`)
- `prompt.signal` (`AbortSignal`): AbortController signal
- `references` (`object`): Options for the references
- `references.getHref` (`function`): Callback to transform a reference into an href
- `references.getLabel` (`function`): Callback to transform a reference into an label to show for the link
- `references.loadingText` (`string`): Loading text (Default: `Fetching relevant pages…`)
- `references.heading` (`string`): Heading for the references panel (Default: `Answer generated from the following sources:`)
- `search` (`object`): Options for search
- `search.enabled` (`boolean`): Whether or not to enable search. (Default: `true`)
- `search.getHref` (`function`): Callback to transform a search result into an href
- `search.getHref` (`function`): Callback to transform a search result into an href
- `search.getHeading` (`function`): Callback to transform a search result into a heading
- `search.getTitle` (`function`): Callback to transform a search result into a title
- `search.getSubtitle` (`function`): Callback to transform a search result into a subtitle
- `search.label` (`string`): Label for the search input, not shown but used for `aria-label` (Default: `Search docs…`)
- `search.tabLabel` (`string`): Label for the tab bar (Default: `Search`)
- `search.placeholder` (`string`): Placeholder for the search input (Default: `Search docs…`)
- `search.limit` (`number`): Maximum amount of results to return. (Default: `5`)
- `search.apiUrl` (`string`): URL at which to fetch search results. (Default: `https://api.markprompt.com/v1/search`)
- `search.provider` (`object`): A custom search provider configuration, such as Algolia
- `search.signal` (`AbortSignal`): AbortController signal
- `trigger` (`object`): Options for the trigger
- `trigger.customElement` (`boolean`): Use a custom element as the trigger. Will disable rendering any trigger element. Use `openMarkprompt()` to trigger the Markprompt dialog. (Default: `false`)
- `trigger.label` (`string`): `aria-label` for the open button (Default: `Open Markprompt`)
- `trigger.placeholder` (`string`): Placeholder text for non-floating element (Default: `Ask docs`)
- `title` (`object`): Options for the title
- `title.hide` (`boolean`): Visually hide the title (Default: `true`)
- `title.text` (`string`): Title text (Default: `Ask AI`)

When rendering the Markprompt component, it will render a search input-like button by default. You have two other options:

- set `trigger.floating = true` to render a floating button
- set `trigger.customElement = true`, then `import { openMarkprompt } from '@markprompt/react'` and call `openMarkprompt()` from your code. This gives you the flexibility to render your own trigger element and attach whatever event handlers you would like and/or open the Markprompt dialog programmatically.

### `openMarkprompt()`

A function to open the Markprompt dialog programmatically. Takes no arguments.

### `<Answer />`

Render the markdown answer from the Markprompt API. It accepts the same props as [`react-markdown`](https://github.com/remarkjs/react-markdown#props), except `children`.

### `<AutoScroller />`

A component automatically that scrolls to the bottom. It accepts the following props:

- `autoScroll` (`boolean`): Whether or not to enable automatic scrolling. (Default: `true`)
- `scrollBehaviour` (`string`): The behaviour to use for scrolling. (Default: `smooth`)

All other props will be passed to the underlying `<div>` element.

### `<Close />`

A button to close the Markprompt dialog and abort an ongoing request. It accepts the same props as [Radix UI `Dialog.Close`](https://www.radix-ui.com/docs/primitives/components/dialog#close).

### `<Content />`

The Markprompt dialog content. It accepts the same props as [Radix UI `Dialog.Content`](https://www.radix-ui.com/docs/primitives/components/dialog#content), with the following additional prop:

### `<Description />`

A visually hidden aria description. It accepts the same props as [Radix UI `Dialog.Description`](https://www.radix-ui.com/docs/primitives/components/dialog#description), with the following additional prop:

- `hide` (`boolean`): Hide the description.

### `<Form />`

A form which, when submitted, submits the current prompt. It accepts the same props as `<form>`.

### `<Overlay />`

The Markprompt dialog overlay. It accepts the same props as [Radix UI `Dialog.Overlay`](https://www.radix-ui.com/docs/primitives/components/dialog#overlay).

### `<Portal />`

The Markprompt dialog portal. It accepts the same props as [Radix UI `Dialog.Portal`](https://www.radix-ui.com/docs/primitives/components/dialog#portal).

### `<Prompt />`

The Markprompt input prompt. User input will update the prompt in the Markprompt context. It accepts the following props:

- `label` (`ReactNode`): The label for the input.
- `labelClassName` (`string`): The class name of the label element.

### `<References />`

Render the references that Markprompt returns. It accepts the following props:

- `RootComponent` (`Component`): The wrapper component to render. (Default: `'ul'`)
- `ReferenceComponent` (`Component`): The component to render for each reference. (Default: '`li`')

### `<Root />`

The Markprompt context provider and dialog root. It accepts the [Radix UI `Dialog.Root`](https://www.radix-ui.com/docs/primitives/components/dialog#root) props and the `useMarkprompt`options as props.

### `<Title />`

A visually hidden aria title. It accepts the same props as [Radix UI `Dialog.Title`](https://www.radix-ui.com/docs/primitives/components/dialog#title), with the following additional prop:

- `hide` (`boolean`): Hide the title.

### `<Trigger />`

A button to open the Markprompt dialog. It accepts the same props as [Radix UI `Dialog.Trigger`](https://www.radix-ui.com/docs/primitives/components/dialog#trigger).

### `useMarkprompt(options)`

Create an interactive stateful Markprompt prompt and search experience, it takes the following options:

- `projectKey` (`string`): The project key for the Markprompt project.
- `isSearchActive` (`boolean`): Whether or not search is currently active. (Default: `false`)
- `promptOptions` (`object`): Options for the prompt.
- `promptOptions.apiUrl` (`string`): URL at which to fetch completions. (Default: `https://api.markprompt.com/v1/completions`)
- `promptOptions.iDontKnowMessage` (`string`): Message returned when the model does not have an answer. (Default: `Sorry, I am not sure how to answer that.`)
- `promptOptions.model` (`string`): The OpenAI model to use. (Default: `gpt-3.5-turbo`)
- `promptOptions.promptTemplate` (`string`): The prompt template. (Default: `You are a very enthusiastic company representative who loves to help people! Given the following sections from the documentation (preceded by a section id), answer the question using only that information, outputted in Markdown format. If you are unsure and the answer is not explicitly written in the documentation, say \"{{I_DONT_KNOW}}\".\n\nContext sections:\n---\n{{CONTEXT}}\n\nQuestion: \"{{PROMPT}}\"\n\nAnswer (including related code snippets if available):\n`)
- `promptOptions.temperature` (`number`): The model temperature. (Default: `0.1`)
- `promptOptions.topP` (`number`): The model top P. (Default: `1`)
- `promptOptions.frequencyPenalty` (`number`): The model frequency penalty. (Default: `0`)
- `promptOptions.presencePenalty` (`number`): The model presence penalty. (Default: `0`)
- `promptOptions.maxTokens` (`number`): The max number of tokens to include in the response. (Default: `500`)
- `promptOptions.sectionsMatchCount` (`number`): The number of sections to include in the prompt context. (Default: `10`)
- `promptOptions.sectionsMatchThreshold` (`number`): The similarity threshold between the input question and selected sections. (Default: `0.5`)
- `promptOptions.signal` (`AbortSignal`): AbortController signal.
- `searchOptions` (`object`): Options for search.
- `searchOptions.enabled` (`boolean`): Whether or not to enable search. (Default: `false`)
- `searchOptions.limit` (`number`): Maximum amount of results to return. (Default: `5`)
- `searchOptions.apiUrl` (`string`): URL at which to fetch search results. (Default: `https://api.markprompt.com/v1/search`)
- `searchOptions.signal` (`AbortSignal`): AbortController signal.

## Documentation

The full documentation for the component can be found on the [Markprompt docs](https://markprompt.com/docs#react).

## Starter Template

For a working setup based on Next.js + Tailwind, check out the [Markprompt starter template](https://github.com/motifland/markprompt-starter-template).

## Community

- [Twitter](https://twitter.com/markprompt)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://twitter.com/markprompt)).

## License

[MIT](./LICENSE) © [Markprompt](https://markprompt.com)
