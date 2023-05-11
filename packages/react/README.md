# Markprompt React

A headless React component for building a prompt interface, based on the [Markprompt](https://markprompt.com) API.

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

Check out the starter template for a fully working example: [Markprompt starter template](href="https://github.com/motifland/markprompt-starter-template).

Install the `@markprompt/react` package via npm or yarn:

```sh
# npm
npm install @markprompt/react

# Yarn
yarn add @markprompt/react
```

## Usage

Example:

```jsx
import { Markprompt } from '@markprompt/react';

function MyPrompt() {
  return <Markprompt projectKey="<project-key>" model="gpt-4" />;
}
```

where `<project-key>` can be obtained in your project settings

## Documentation

The full documentation for the component can be found on the [Markprompt docs](https://markprompt.com/docs#react).

## Starter Template

For a working setup based on Next.js + Tailwind, check out the [Markprompt starter template](https://github.com/motifland/markprompt-starter-template).

## Community

- [Twitter @markprompt](https://twitter.com/markprompt)
- [Twitter @motifland](https://twitter.com/motifland)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Motif](https://motif.land)
([@motifland](https://twitter.com/motifland)).
