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

In [Motif](https://motif.land), paste the following import statement in an MDX, JSX or TSX file:

```jsx
import { Markprompt } from 'https://esm.sh/markprompt';
```

If you have a Node-based setup, install the `markprompt` package via npm or yarn:

```sh
# npm
npm install markprompt

# Yarn
yarn add markprompt
```

## Usage

Example:

```jsx
import { Markprompt } from 'markprompt';

function MyPrompt() {
  return <Markprompt projectKey="<project-key>" model="gpt-4" />;
}
```

where `project-key` can be obtained in your project settings, and `model` is the identifier of the OpenAI model to use for completions. Supported models are:

- Chat completions: `gpt-4` `gpt-4-0314` `gpt-4-32k` `gpt-4-32k-0314` `gpt-3.5-turbo` `gpt-3.5-turbo-0301`
- Completions: `text-davinci-003`, `text-davinci-002`, `text-curie-001`, `text-babbage-001`, `text-ada-001`, `davinci`, `curie`, `babbage`, `ada`

If no model is specified, `gpt-3.5-turbo` will be used.

## Styling

The Markprompt component is styled using [Tailwind CSS](https://tailwindcss.com/), and therefore requires a working Tailwind configuration. We are planning to make it headless, for more flexible options.

## Configuration

You can pass the following props to the component:

| Prop               | Default value                            | Description                                                     |
| ------------------ | ---------------------------------------- | --------------------------------------------------------------- |
| `iDontKnowMessage` | Sorry, I am not sure how to answer that. | Fallback message in can no answer is found.                     |
| `placeholder`      | 'Ask me anything...'                     | Message to show in the input box when no text has been entered. |

Example:

```jsx
<Markprompt
  project="..."
  model="..."
  iDontKnowMessage="Sorry, I don't know!"
  placeholder="Ask Acme docs..."
/>
```

## Whitelisting your domain

Usage of the [Markprompt API](https://markprompt.com) is subject to quotas, depending on the plan you have subscribed to. Markprompt has systems in place to detect abuse and excessive usage, but we nevertheless recommend being cautious when offering a prompt interface on a public website. In any case, the prompt will **only work on domains you have whitelisted** through the [Markprompt dashboard](https://markprompt.com).

## Passing an authorization token

If you cannot use a whitelisted domain, for instance when developing on localhost, you can alternatively pass an authorization token:

```jsx
<Markprompt model="..." token="<PROJECT_ACCESS_TOKEN>" />
```

You can obtain this token in the project settings. This token is tied to a specific project, so adding the `project` prop will not have any effect.

**Important:** Make sure to keep this token private, and never publish code that exposes it. If your token has been compromised, you can generate a new one in the settings.

## Community

- [Twitter @markprompt](https://twitter.com/markprompt)
- [Twitter @motifland](https://twitter.com/motifland)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Motif](https://motif.land)
([@motifland](https://twitter.com/motifland)).

## License

MIT
