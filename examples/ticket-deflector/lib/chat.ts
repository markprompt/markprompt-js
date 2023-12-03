/* eslint-disable @typescript-eslint/no-explicit-any */
import defaults from 'defaults';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

import { DEFAULT_SUBMIT_CHAT_OPTIONS } from './constants';
import { FileSectionReference, SubmitChatGeneratorYield } from './types';
import {
  isFileSectionReferences,
  isJsonResponse,
  parseEncodedJSONHeader,
} from './utils';

export type SubmitChatGeneratorReturn =
  AsyncGenerator<SubmitChatGeneratorYield>;

export interface ChatMessage {
  role: 'assistant' | 'function' | 'system' | 'user';
  name?: string;
  content: string | null;
  received?: string;
}

export async function* submitChatGenerator(
  messages: ChatMessage[],
  projectKey: string,
  options: any = {},
  debug?: boolean,
): SubmitChatGeneratorReturn {
  if (!projectKey) {
    throw new Error('A projectKey is required.');
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return;
  }

  const { apiUrl, ...resolvedOptions } = defaults(
    { ...options },
    DEFAULT_SUBMIT_CHAT_OPTIONS,
  );

  console.log(
    'Sending',
    JSON.stringify(
      {
        projectKey,
        messages: messages.filter(
          (m) => m.role === 'user' || m.role === 'assistant',
        ),
        ...resolvedOptions,
      },
      null,
      2,
    ),
  );

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      projectKey,
      messages: messages.filter(
        (m) => m.role === 'user' || m.role === 'assistant',
      ),
      ...resolvedOptions,
    }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text();
    throw new Error(text);
  }

  if (options.signal?.aborted) throw options.signal.reason;

  const data = parseEncodedJSONHeader(res, 'x-markprompt-data');
  const debugInfo = parseEncodedJSONHeader(res, 'x-markprompt-debug-info');

  if (debug && debugInfo) {
    // eslint-disable-next-line no-console
    console.debug(JSON.stringify(debugInfo, null, 2));
  }

  let references: FileSectionReference[] = [];
  let conversationId: string | undefined;
  let promptId: string | undefined;

  if (typeof data === 'object' && data !== null) {
    if ('conversationId' in data && typeof data.conversationId === 'string') {
      conversationId = data.conversationId;
    }

    if ('promptId' in data && typeof data.promptId === 'string') {
      promptId = data.promptId;
    }

    if ('references' in data && isFileSectionReferences(data.references)) {
      references = data.references;
    }
  }

  yield { references, conversationId, promptId, content: null };

  if (options.signal?.aborted) throw options.signal.reason;

  if (res.headers.get('Content-Type') === 'application/json') {
    const json = await res.json();

    if (isJsonResponse(json)) {
      const { text, ...rest } = Object.fromEntries(
        Object.entries(json).filter(([, value]) => Boolean(value)),
      );

      yield {
        role: 'assistant',
        content: text ?? '',
        received: new Date().toISOString(),
        ...rest,
      };
    }

    return;
  }

  const decoder = new TextDecoder();
  const reader = res.body.getReader();
  let done = false;
  let value: Uint8Array | undefined;
  const chunk_messages: Record<string, unknown>[] = [];

  const returnValue: SubmitChatGeneratorYield = {
    content: null,
    received: new Date().toISOString(),
  };

  const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
    if (event.type !== 'event') return;

    if (event.data === '[DONE]') {
      return;
    }

    const json = JSON.parse(event.data);
    const chunk_message: Record<string, unknown> = json['choices'][0]['delta'];
    chunk_messages.push(chunk_message);

    if ('role' in chunk_message)
      returnValue.role = chunk_message[
        'role'
      ] as SubmitChatGeneratorYield['role'];

    if ('content' in chunk_message)
      returnValue.content = ((returnValue.content ?? '') +
        chunk_message['content']) as SubmitChatGeneratorYield['content'];
  });

  while (!done) {
    ({ value, done } = await reader.read());
    const string = decoder.decode(value);
    parser.feed(string);
    yield returnValue;
  }

  yield returnValue;
}
