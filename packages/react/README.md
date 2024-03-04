# Markprompt React

[Markprompt](https://markprompt.com)'s `@markprompt/react` library offers you
both a simple, accessible, prebuilt React component that you can include in your
codebase, as well as a set of React primitives that you can use to build your
own custom Markprompt UI.

The `<Markprompt />` component is built with [Radix'](https://www.radix-ui.com/)
[`Dialog component`](https://www.radix-ui.com/docs/primitives/components/dialog)
and allows for limited control over the Markprompt UI, mostly offering you the
ability to change texts as well as how prompt references and search results are
linked to your website.

The `Markprompt.*` primitives offer you a fully customizable way to build your
own UI and have full control.

In combination with
[`@markprompt/css`](https://github.com/motifland/markprompt-js/tree/main/packages/css),
the `<Markprompt />` component is a drop-in solution for most websites. You can
also opt to provide your own styles, or override ours to your liking.

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

Install `@markprompt/react` via NPM or your favorite package manager:

```sh
npm install @markprompt/react
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

replacing `YOUR-PROJECT-KEY` with the key associated to your project. It can be
obtained in the project settings on [Markprompt.com](https://markprompt.com/)
under "Project key".

## Documentation

The full documentation for the package can be found on the
[Markprompt docs](https://markprompt.com/docs/sdk).

## Templates

Get a head start by cloning a fully-fledged AI application from our
[templates repository](https://github.com/markprompt/templates).

## Community

- [X](https://x.com/markprompt)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://x.com/markprompt)).

## License

[MIT](./LICENSE) © [Markprompt](https://markprompt.com)
