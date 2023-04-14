# `@markprompt/core`

`@markprompt/core` is the core library for Markprompt, a conversational AI component for your website, trained on your data.

It contains core functionality for Markprompt and allows you to build abstractions on top of it.

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

# Usage

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
