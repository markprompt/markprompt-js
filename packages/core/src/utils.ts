import type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessage,
} from 'openai/resources/index.mjs';

import type { ChatCompletionMetadata, FileSectionReference } from './types.js';

import type {} from 'openai';

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

export function isChatCompletion(json: unknown): json is ChatCompletion {
  return (
    typeof json === 'object' &&
    json !== null &&
    'object' in json &&
    json.object === 'chat.completion'
  );
}

export const isFunctionCall = (
  json: unknown,
): json is ChatCompletionMessage.FunctionCall => {
  return (
    typeof json === 'object' &&
    json !== null &&
    'name' in json &&
    typeof json.name === 'string' &&
    'arguments' in json &&
    typeof json.arguments === 'string'
  );
};

export const isFunctionCallKey = (
  key: string,
): key is keyof ChatCompletionMessage.FunctionCall => {
  return ['name', 'arguments'].includes(key);
};

export const isChatCompletionChunk = (
  json: unknown,
): json is ChatCompletionChunk => {
  return (
    typeof json === 'object' &&
    json !== null &&
    'object' in json &&
    typeof json.object === 'string' &&
    json.object === 'chat.completion.chunk'
  );
};
