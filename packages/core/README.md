# Markprompt Core

`@markprompt/core` is the core library for Markprompt, a conversational AI
component for your website, trained on your data.

It contains core functionality for Markprompt and allows you to build
abstractions on top of it.

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
  import {
    submitChat,
    submitSearchQuery,
    submitFeedback,
  } from 'https://esm.sh/@markprompt/core';
</script>
```

## Usage

```js
import { submitChat } from '@markprompt/core';

for await (const chunk of submitChat(
  [{ content: 'What is Markprompt?', role: 'user' }],
  'YOUR-PROJECT-KEY',
  {
    model: 'gpt-4o',
    systemPrompt: 'You are a helpful AI assistant'
  }
)) {
  console.debug(chunk);
}
```

## API

### `submitChat(messages: ChatMessage[], projectKey: string, options?)`

Submit a prompt to the Markprompt Completions API.

#### Arguments

- `messages` (`ChatMessage[]`): Chat messages to submit to the model
- `projectKey` (`string`): Project key for the project
- [`options`](#options) (`SubmitChatOptions`): Optional parameters

#### Options

All options are optional.

- `threadId` (`string`): Thread ID
- `iDontKnowMessage` (`string`): Message returned when the model does not have
  an answer
- `model` (`OpenAIModelId`): The OpenAI model to use
- `systemPrompt` (`string`): The prompt template
- `temperature` (`number`): The model temperature
- `topP` (`number`): The model top P
- `frequencyPenalty` (`number`): The model frequency penalty
- `presencePenalty` (`number`): The model present penalty
- `maxTokens` (`number`): The max number of tokens to include in the response
- `sectionsMatchCount` (`number`): The number of sections to include in the
  prompt context
- `sectionsMatchThreshold` (`number`): The similarity threshold between the
- `signal` (`AbortSignal`): AbortController signal
- `tools`: (`OpenAI.ChatCompletionTool[]`): A list of tools the model may call
- `toolChoice`: (`OpenAI.ChatCompletionToolChoiceOption`): Controls which (if
  any) function is called by the model

#### Returns

A promise that resolves when the response is fully handled.

### `submitSearchQuery(query, projectKey, options?)`

Submit a search query to the Markprompt Search API.

#### Arguments

- `query` (`string`): Search query
- `projectKey` (`string`): Project key for the project
- [`options`](#options) (`object`): Optional parameters

#### Options

- `limit` (`number`): Maximum amount of results to return
- `signal` (`AbortSignal`): AbortController signal

#### Returns

A list of search results.

### `submitFeedback(feedback, projectKey, options?)`

Submit feedback to the Markprompt Feedback API about a specific prompt.

#### Arguments

- `feedback` (`object`): Feedback to submit
- `feedback.feedback` (`object`): Feedback data
- `feedback.feedback.vote` (`"1" | "-1" | "escalated"`): Vote
- `feedback.messageId` (`string`): Message ID
- `projectKey` (`string`): Project key for the project
- `options` (`object`): Optional parameters
- `options.onFeedbackSubmitted` (`function`): Callback function when feedback is
  submitted
- `options.signal` (`AbortSignal`): AbortController signal

#### Returns

A promise that resolves when the feedback is submitted. Has no return value.

## Documentation

The full documentation for the package can be found on the
[Markprompt docs](https://markprompt.com/docs/sdk).

## Community

- [X](https://x.com/markprompt)

## Authors

This library is created by the team behind [Markprompt](https://markprompt.com)
([@markprompt](https://x.com/markprompt)).

## License

[MIT](./LICENSE) © [Markprompt](https://markprompt.com)
