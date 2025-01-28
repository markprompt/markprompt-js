import type { ChatCompletionContentPart } from 'openai/resources/index.mjs';

import type { FileSectionReference } from './types.js';

export type RequiredKeys<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;

export type ArrayToUnion<T> = T extends (infer U)[]
  ? U
  : T extends readonly (infer U)[]
    ? U
    : never;

export const isKeyOf = <T extends object>(
  obj: T,
  key: PropertyKey,
): key is keyof T => Object.hasOwn(obj, key);

export const getErrorMessage = async (res: Response): Promise<string> => {
  const text = await res.text();

  try {
    const json: unknown = JSON.parse(text);
    if (
      json &&
      typeof json === 'object' &&
      'error' in json &&
      typeof json.error === 'string'
    ) {
      return json?.error ?? text;
    }
  } catch {
    return text;
  }

  return text;
};

export function isAbortError(err: unknown): err is DOMException {
  return (
    (err instanceof DOMException && err.name === 'AbortError') ||
    (err instanceof Error && err.message.includes('AbortError'))
  );
}

export function isFileSectionReferences(
  data: unknown,
): data is FileSectionReference[] {
  return (
    Array.isArray(data) &&
    typeof data.at(0)?.file?.path === 'string' &&
    typeof data.at(0)?.file?.source?.type === 'string'
  );
}

export function getMessageTextContent(m: {
  content?: null | string | ChatCompletionContentPart[];
}) {
  if (!m.content) {
    return;
  }

  if (typeof m.content === 'string') {
    return m.content;
  }

  return m.content.reduce((acc, x) => {
    if (x.type === 'text') {
      return `${acc} ${x.text}`;
    }

    return acc;
  }, '');
}
