# `@markprompt/core`

`@markprompt/core` is the core library for Markprompt, a conversational AI component for your website, trained on your data.

It contains core functionality for Markprompt and allows you to build abstractions on top of it.

<br />
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@markprompt/core">
    <img alt="" src="https://badgen.net/npm/v/@markprompt/core">
  </a>
  <a aria-label="License" href="https://github.com/motifland/markprompt-js/blob/main/packages/core/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/@markprompt/core">
  </a>
</p>

## Table of Contents

- [`@markprompt/core`](#markpromptcore)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API](#api)
    - [`submitPrompt(prompt, projectKey, onAnswerChunk, onReferences, onError, options?)`](#submitpromptprompt-projectkey-onanswerchunk-onreferences-onerror-options)
      - [Arguments](#arguments)
      - [Options](#options)
      - [Returns](#returns)
  - [Community](#community)
  - [Authors](#authors)
  - [License](#license)

## Installation

```sh
npm install @markprompt/core
```

In browsers with [esm.sh](https://esm.sh):

```html
<script type="module">
  import { submitPrompt } from 'https://esm.sh/@markprompt/core';
</script>
```

## Usage

```js
import { submitPrompt } from '@markprompt/core';

// user input
const prompt = 'Hello, Markprompt!';
// can be obtained in your project settings on markprompt.com
const projectKey = '<project-key>';

// called when a new answer chunk is available
// should be concatenated to previous chunks
function onAnswerChunk(chunk) {
  // process an answer chunk
}

// called when references are available
function onReferences(references) {
  // process references
}

// called when submitPrompt encounters an error
const onError(error) {
  // handle errors
}

// optional options, defaults displayed
const options = {
  model: 'gpt-3.5-turbo', // supports all OpenAI models
  iDontKnowMessage: 'Sorry, I am not sure how to answer that.',
  completionsUrl: 'https://api.markprompt.com/v1/completions', // or your own completions API endpoint,
};

await submitPrompt(prompt, projectKey, onAnswerChunk, onReferences, onError, options);
```

## API

### `submitPrompt(prompt, projectKey, onAnswerChunk, onReferences, onError, options?)`

Submit a prompt the the Markprompt API.

#### Arguments

- `prompt` (`string`): Prompt to submit to the model
- `projectKey` (`string`): The key of your project
- `onAnswerChunk` (`function`): Answers come in via streaming. This function is called when a new chunk arrives
- `onReferences` (`function`): This function is called when a chunk includes references.
- `onError` (`function`): called when an error occurs
- [`options`](#options) (`object`): Optional options object

#### Options

- `completionsUrl` (`string`): URL at which to fetch completions
- `iDontKnowMessage` (`string`): Message returned when the model does not have an answer
- `model` (`OpenAIModelId`): The OpenAI model to use
- `promptTemplate` (`string`): The prompt template
- `temperature` (`number`): The model temperature
- `topP` (`number`): The model top P
- `frequencyPenalty` (`number`): The model frequency penalty
- `presencePenalty` (`number`): The model present penalty
- `maxTokens` (`number`): The max number of tokens to include in the response
- `sectionsMatchCount` (`number`): The number of sections to include in the prompt context
- `sectionsMatchThreshold` (`number`): The similarity threshold between the input question and selected sections
- `signal` (`AbortSignal`): AbortController signal

#### Returns

A promise that resolves when the response is fully handled.

## Community

- [Twitter @markprompt](https://twitter.com/markprompt)
- [Twitter @motifland](https://twitter.com/motifland)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Motif](https://motif.land)
([@motifland](https://twitter.com/motifland)).

## License

[MIT](./LICENSE) © [Motif](https://motif.land)
