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

// User input
const prompt = 'What is Markprompt?';
// Can be obtained in your project settings on markprompt.com
const projectKey = 'YOUR-PROJECT-KEY';

// Called when a new answer chunk is available
// Should be concatenated to previous chunks
function onAnswerChunk(chunk) {
  // Process an answer chunk
}

// Called when references are available
function onReferences(references) {
  // Process references
}

// Called when submitPrompt encounters an error
const onError(error) {
  // Handle errors
}

// Optional parameters, defaults displayed
const options = {
  model: 'gpt-3.5-turbo', // Supports all OpenAI models
  iDontKnowMessage: 'Sorry, I am not sure how to answer that.',
  apiUrl: 'https://api.markprompt.com/v1/completions', // Or your own completions API endpoint
};

await submitPrompt(prompt, projectKey, onAnswerChunk, onReferences, onError, options);
```

## API

### `submitPrompt(prompt, projectKey, onAnswerChunk, onReferences, onError, options?)`

Submit a prompt to the Markprompt Completions API.

#### Arguments

- `prompt` (`string`): Prompt to submit to the model
- `projectKey` (`string`): Project key for the project
- `onAnswerChunk` (`function`): Answers come in via streaming. This function is called when a new chunk arrives
- `onReferences` (`function`): This function is called when receiving the list of references from which the response was created.
- `onError` (`function`): called when an error occurs
- [`options`](#options) (`object`): Optional parameters

#### Options

- `apiUrl` (`string`): URL at which to fetch completions
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

### `submitSearchQuery(query, projectKey, options?)`

Submit a search query to the Markprompt Search API.

#### Arguments

- `query` (`string`): Search query
- `projectKey` (`string`): Project key for the project
- [`options`](#options) (`object`): Optional parameters

#### Options

- `apiUrl` (`string`): URL at which to fetch search results
- `limit` (`number`): Maximum amount of results to return
- `signal` (`AbortSignal`): AbortController signal

#### Returns

A list of search results.

## Community

- [Twitter](https://twitter.com/markprompt)
- [Discord](https://discord.gg/MBMh4apz6X)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://twitter.com/markprompt)).

## License

[MIT](./LICENSE) © [Markprompt](https://markprompt.com)
