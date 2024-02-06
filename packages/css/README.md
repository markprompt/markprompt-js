# `@markprompt/css`

Common CSS for [Markprompt](https://markprompt.com) components.

<br />
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@markprompt/css">
    <img alt="" src="https://badgen.net/npm/v/@markprompt/css">
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt-js/blob/main/packages/css/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/@markprompt/css">
  </a>
</p>

## Installation

```sh
npm install @markprompt/css
```

## Usage

With a bundler:

```js
import '@markprompt/css';
```

With a CDN:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@markprompt/css@0.22.0/markprompt.css"
/>
```

This package adds styling for various CSS classes. All styling is applied using
the [`:where()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:where) pseudo
class, so you can override all styling manually.

## API

Styling can be customized using the following CSS variables.

- `--markprompt-background`
- `--markprompt-foreground`
- `--markprompt-muted`
- `--markprompt-mutedForeground`
- `--markprompt-border`
- `--markprompt-border-accent`
- `--markprompt-input`
- `--markprompt-primary`
- `--markprompt-primaryForeground`
- `--markprompt-primaryMuted`
- `--markprompt-secondary`
- `--markprompt-secondaryForeground`
- `--markprompt-primaryHighlight`
- `--markprompt-secondaryHighlight`
- `--markprompt-overlay`
- `--markprompt-ring`
- `--markprompt-radius`
- `--markprompt-button-radius`
- `--markprompt-text-size`
- `--markprompt-text-size-xs`
- `--markprompt-text-size-code`
- `--markprompt-button-icon-size`
- `--markprompt-icon-stroke-width`
- `--markprompt-shadow`
- `--markprompt-ring-shadow`
- `--markprompt-ring-offset-shadow`
- `--markprompt-error-background`
- `--markprompt-error-foreground`

## Community

- [X](https://x.com/markprompt)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://x.com/markprompt)).

## License

[MIT](./LICENSE) © [Markprompt](https://markprompt.com)
