import defaults from 'defaults';
import { EventSourceParserStream } from 'eventsource-parser/stream';
import mergeWith from 'lodash-es/mergeWith.js';

import type {
  Chat,
  SubmitChatOptions,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMetadata,
} from './types.js';
import {
  checkAbortSignal,
  isChatCompletion,
  isChatCompletionChunk,
  isChatCompletionMessage,
  isMarkpromptMetadata,
  isNoStreamingData,
  isValidSubmitChatOptionsKey,
  parseEncodedJSONHeader,
} from './utils.js';
import { DEFAULT_OPTIONS } from '../constants.js';
import type { BaseOptions } from '../types.js';

export * from './types.js';
export * from './utils.js';

export type SubmitChatYield =
  Chat.Completions.ChatCompletionChunk.Choice.Delta & ChatCompletionMetadata;

export type SubmitChatReturn = ChatCompletionMessage & ChatCompletionMetadata;

export const DEFAULT_SUBMIT_CHAT_OPTIONS = {
  frequencyPenalty: 0,
  iDontKnowMessage: 'Sorry, I am not sure how to answer that.',
  model: 'gpt-4o',
  presencePenalty: 0,
  temperature: 0.1,
  topP: 1,
  stream: true,
  outputFormat: 'markdown',
} as const satisfies SubmitChatOptions;

export async function* submitChat(
  messages: ChatCompletionMessageParam[],
  projectKey: string,
  options: SubmitChatOptions & BaseOptions = {},
): AsyncGenerator<SubmitChatYield, SubmitChatReturn | undefined> {
  if (!projectKey) {
    throw new Error('A projectKey is required.');
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return;
  }

  const validOptions: SubmitChatOptions & BaseOptions = Object.fromEntries(
    Object.entries(options).filter(([key]) => isValidSubmitChatOptionsKey(key)),
  );

  const { signal, tools, toolChoice, additionalMetadata, ...cloneableOpts } =
    validOptions;
  const { debug, policiesOptions, retrievalOptions, ...resolvedOptions } =
    defaults(
      {
        ...cloneableOpts,
        // Only include known tool properties
        tools: tools?.map((tool) => ({
          function: tool.function,
          type: tool.type,
        })),
        toolChoice: toolChoice,
      },
      {
        ...DEFAULT_OPTIONS,
        // If assistantId is provided, do not set default values,
        // as it will then override the assistant-provided values
        // in case that allowClientSideOverrides is set for the
        // assistant.
        ...(validOptions.assistantId ? {} : DEFAULT_SUBMIT_CHAT_OPTIONS),
      },
    ) as BaseOptions & SubmitChatOptions;

  const res = await fetch(`${resolvedOptions.apiUrl}/chat`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-Markprompt-API-Version': '2024-05-21',
      ...(resolvedOptions.headers ? resolvedOptions.headers : {}),
    }),
    body: JSON.stringify({
      projectKey,
      messages,
      debug,
      ...resolvedOptions,
      policies: policiesOptions,
      retrieval: retrievalOptions,
      additionalMetadata,
    }),
    signal,
  });

  const data = parseEncodedJSONHeader(res, 'x-markprompt-data');

  checkAbortSignal(options.signal);

  if (res.headers.get('Content-Type')?.includes('application/json')) {
    const json = await res.json();

    if (
      isChatCompletion(json) &&
      isMarkpromptMetadata(data) &&
      json.choices?.[0]
    ) {
      return { ...json.choices[0].message, ...data };
    } else {
      if (isMarkpromptMetadata(data)) {
        yield data;
      }

      if (isNoStreamingData(json)) {
        yield {
          content: json.text,
          references: json.references,
          steps: json.steps,
          role: 'assistant',
        };

        return;
      }

      throw new Error('Malformed response from Markprompt API', {
        cause: json,
      });
    }
  }

  if (isMarkpromptMetadata(data)) {
    yield data;
  }

  if (!res.ok || !res.body) {
    checkAbortSignal(options.signal);

    const text = await res.text();

    try {
      const json = JSON.parse(text);
      if (json.error) {
        throw new Error(json.error);
      }
    } catch {
      // ignore
    }

    throw new Error(text, {
      cause: { status: res.status, statusText: res.statusText },
    });
  }

  checkAbortSignal(options.signal);

  // eslint-disable-next-line prefer-const
  const completion = {};

  const stream = res.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
    .getReader();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value: event, done } = await stream.read();

    if (done) break;
    if (!event) continue;

    if (event.data === '[DONE]') {
      continue;
    }

    // eslint-disable-next-line prefer-const
    const json = JSON.parse(event.data);

    if (!isChatCompletionChunk(json)) {
      throw new Error('Malformed response from Markprompt API', {
        cause: json,
      });
    }

    mergeWith(completion, json.choices?.[0]?.delta, concatStrings);

    checkAbortSignal(options.signal);
    /**
     * If we do not yield a structuredClone here, the completion object will
     * become read-only/frozen and TypeErrors will be thrown when trying to
     * merge the next chunk into it.
     */
    yield structuredClone(completion);
  }

  checkAbortSignal(options.signal);

  if (isChatCompletionMessage(completion) && isMarkpromptMetadata(data)) {
    return { ...completion, ...data };
  }
}

function concatStrings(dest: unknown, src: unknown): unknown {
  if (typeof dest === 'string' && typeof src === 'string') {
    return dest + src;
  }

  return undefined;
}
