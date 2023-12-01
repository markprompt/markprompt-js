import type { OpenAI } from 'openai';

import type { ChatCompletionMetadata, FileSectionReference } from './types.js';

export const getErrorMessage = async (res: Response): Promise<string> => {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return json?.error ?? text;
  } catch {
    return text;
  }
};

export const parseEncodedJSONHeader = (
  response: Response,
  name: string,
): unknown | undefined => {
  try {
    const headerValue = response.headers.get(name);
    if (headerValue) {
      const headerArray = new Uint8Array(headerValue.split(',').map(Number));
      const decoder = new TextDecoder();
      const decodedValue = decoder.decode(headerArray);
      return JSON.parse(decodedValue);
    }
  } catch (e) {
    // Do nothing
  }
  return undefined;
};

export function isFileSectionReferences(
  data: unknown,
): data is FileSectionReference[] {
  return (
    Array.isArray(data) &&
    Boolean(data[0]?.file?.path) &&
    Boolean(data[0]?.file?.source?.type)
  );
}

export function isAbortError(err: unknown): err is DOMException {
  return (
    (err instanceof DOMException && err.name === 'AbortError') ||
    (err instanceof Error && err.message.includes('AbortError'))
  );
}

function safeStringifyReplacer(seen: WeakSet<object>) {
  return function (key: string, value: unknown) {
    if (value !== null && typeof value === 'object') {
      if (seen.has(value)) {
        return '[Circular]';
      }

      seen.add(value);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newValue: { [s: string]: unknown } | ArrayLike<unknown> =
        Array.isArray(value) ? [] : {};

      for (const [key2, value2] of Object.entries(value)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newValue as any)[key2] = safeStringifyReplacer(seen)(key2, value2);
      }

      seen.delete(value);

      return newValue;
    }

    return value;
  };
}

// Source: https://github.com/sindresorhus/safe-stringify
export function safeStringify(
  object: unknown,
  options?: {
    indentation?: string | number;
  },
): string {
  const seen = new WeakSet();
  return JSON.stringify(
    object,
    safeStringifyReplacer(seen),
    options?.indentation,
  );
}

export function isMarkpromptMetadata(
  json: unknown,
): json is ChatCompletionMetadata {
  return (
    typeof json === 'object' &&
    json !== null &&
    (('conversationId' in json && typeof json.conversationId === 'string') ||
      ('promptId' in json && typeof json.promptId === 'string') ||
      ('references' in json && isFileSectionReferences(json.references)))
  );
}

export function isChatCompletion(json: unknown): json is OpenAI.ChatCompletion {
  return (
    typeof json === 'object' &&
    json !== null &&
    'object' in json &&
    json.object === 'chat.completion'
  );
}

export const isFunctionCall = (
  json: unknown,
): json is OpenAI.ChatCompletionMessageToolCall => {
  return (
    typeof json === 'object' &&
    json !== null &&
    'type' in json &&
    typeof json.type === 'string' &&
    json.type === 'function' &&
    'function' in json &&
    typeof json.function === 'object' &&
    json.function !== null
  );
};

export const isFunctionCallKey = (
  key: string,
): key is keyof OpenAI.ChatCompletionMessageToolCall.Function => {
  return ['name', 'arguments'].includes(key);
};

export const isChatCompletionChunk = (
  json: unknown,
): json is OpenAI.ChatCompletionChunk => {
  return (
    typeof json === 'object' &&
    json !== null &&
    'object' in json &&
    typeof json.object === 'string' &&
    json.object === 'chat.completion.chunk'
  );
};
