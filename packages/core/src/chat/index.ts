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
  const {
    debug,
    policiesOptions,
    messageTagOptions,
    retrievalOptions,
    ...resolvedOptions
  } = defaults(
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

  const messageId = crypto.randomUUID();

  const readEvents = async function* () {
    const eventsRes = await fetch(
      `${resolvedOptions.apiUrl}/chat/events?messageId=${messageId}&projectKey=${projectKey}`,
      {
        method: 'GET',
        headers: new Headers({
          'X-Markprompt-API-Version': '2024-05-21',
          ...(resolvedOptions.headers ? resolvedOptions.headers : {}),
        }),
        signal,
      },
    );

    if (!eventsRes.ok || !eventsRes.body) {
      // todo remove
      console.error('Failed to fetch events', eventsRes);
      return;
    }

    const eventsStream = eventsRes.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .getReader();

    while (true) {
      const { value: event, done } = await eventsStream.read();
      if (done) return;
      if (!event) continue;
      if (event.data === '[DONE]') continue;

      // todo: deal with this better
      // need a standard format and try/catch
      const eventJson = JSON.parse(event.data);
      yield {
        event: eventJson.message,
      };
    }
  };

  const readChat = async function* () {
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
        messageTags: messageTagOptions,
        retrieval: retrievalOptions,
        additionalMetadata,
        messageId,
      }),
      signal,
    });
    const data = parseEncodedJSONHeader(res, 'x-markprompt-data');

    checkAbortSignal(options.signal);

    if (res.headers.get('Content-Type')?.includes('application/json')) {
      const json: unknown = await res.json();

      if (
        isChatCompletion(json) &&
        isMarkpromptMetadata(data) &&
        json.choices?.[0]
      ) {
        return { ...json.choices[0].message, ...data };
      }
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

    if (isMarkpromptMetadata(data)) {
      yield data;
    }

    if (!res.ok || !res.body) {
      checkAbortSignal(options.signal);

      const text = await res.text();

      try {
        const json: unknown = JSON.parse(text);
        if (
          json &&
          typeof json === 'object' &&
          'error' in json &&
          typeof json.error === 'string'
        ) {
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

    const completion = {};

    const stream = res.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .getReader();

    while (true) {
      const { value: event, done } = await stream.read();
      if (done) return;
      if (!event) continue;
      if (event.data === '[DONE]') continue;

      const json: unknown = JSON.parse(event.data);
      if (!isChatCompletionChunk(json)) {
        throw new Error('Malformed response from Markprompt API', {
          cause: json,
        });
      }

      mergeWith(completion, json.choices?.[0]?.delta, concatStrings);
      /**
       * If we do not yield a structuredClone here, the completion object will
       * become read-only/frozen and TypeErrors will be thrown when trying to
       * merge the next chunk into it.
       */
      yield structuredClone(completion);
    }
  };

  /*
  Quite a bit is happening here.
  We have two generators that need to run in parallel: the chat and the events.
  In order to run these both at the same time, we use Promise.race
  We wrap the generators with a type ('events' | 'chat') so that we can distingish between them in Promise.race
  
  However, we "lose" the value of whichever generator finishes second in Promise.race
  So, we keep the promise of that each generator.next() returns, and only re-run it
  if it is the one that finished first (i.e. if it is the value that actually got consumed)
  For the other generator, we keep the value around and pass it to the next Promise.race

  Once we get a value from Promise.race, we can distinguish between events and chat using the 'type' field
  and do whatever we need to do with them. 
  **/

  // create both generators
  const eventsGenerator = readEvents();
  const chatGenerator = readChat();

  // wrap them so that we can distingish between them in Promise.race
  const wrappedEventsGenerator = {
    next: async () => {
      const { value, done } = await eventsGenerator.next();
      return { type: 'events' as const, value, done };
    },
  };

  const wrappedChatGenerator = {
    next: async () => {
      const { value, done } = await chatGenerator.next();
      return { type: 'chat' as const, value, done };
    },
  };

  let metadata: ChatCompletionMetadata | undefined;
  const events: string[] = [];

  let chatPromise: ReturnType<typeof wrappedChatGenerator.next> | undefined;
  let eventsPromise: ReturnType<typeof wrappedEventsGenerator.next> | undefined;

  while (true) {
    checkAbortSignal(options.signal);

    // get the next yielded value if we don't already have one for each generator
    // todo: should we not do this if the generator has already ended?
    chatPromise = chatPromise ?? wrappedChatGenerator.next();
    eventsPromise = eventsPromise ?? wrappedEventsGenerator.next();

    // get the next event from either the chat or events generator
    const result = await Promise.race([chatPromise, eventsPromise]);

    const isChatObject = result.type === 'chat';
    const isEventObject = result.type === 'events';

    // don't end if the event stream is done
    if (isEventObject && result.done) continue;
    // but end if the chat stream is done
    if (isChatObject && result.done) break;

    // for whichever generator finished first (actually got consumed),
    // remove its promise so that we can get its next value in the next iteration
    if (isEventObject) {
      eventsPromise = undefined;
    }
    if (isChatObject) {
      chatPromise = undefined;
    }

    // now we can handle the values based on which generator they came from
    if (isEventObject && result.value) {
      events.push(result.value.event);
      yield structuredClone({ events });
    }

    if (isChatObject && result.value) {
      const value = result.value;
      // if it's metadata, yield it and also save it
      if (isMarkpromptMetadata(value)) {
        metadata = value;
        yield metadata;
        continue;
      }

      if (result.done && isChatCompletionMessage(value) && metadata) {
        return { ...value, ...metadata };
      }

      // its not metadata and not a full message, so just yield it
      yield value;
    }
  }
}

function concatStrings(dest: unknown, src: unknown): unknown {
  if (typeof dest === 'string' && typeof src === 'string') {
    return dest + src;
  }

  return undefined;
}
