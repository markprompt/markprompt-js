import Emittery from 'emittery';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import type { MarkpromptOptions, View, ViewOptions } from './types.js';
import type { ChatCompletionMessageParam } from '@markprompt/core/chat';

export function isPresent<T>(t: T | undefined | null): t is T {
  return t !== undefined && t !== null;
}

export function markdownToString(markdown = '', maxLength = 200): string {
  const tree = fromMarkdown(markdown);
  const string = toString(tree);

  return string.length > maxLength ? `${string.slice(0, maxLength)}…` : string;
}

export function isIterable(obj: unknown): boolean {
  // Checks for null and undefined
  if (obj == null) {
    return false;
  }

  // Type guard to check if obj is an object first
  if (typeof obj !== 'object') {
    return false;
  }

  // Now we can safely check for Symbol.iterator
  return (
    typeof (obj as { [Symbol.iterator]?: unknown })[Symbol.iterator] ===
    'function'
  );
}

/**
 * Returns a function that can be used to filter down objects
 * to the ones that have a defined non-null value under the key `k`.
 *
 * @example
 * ```ts
 * const filesWithUrl = files.filter(file => file.url);
 * files[0].url // In this case, TS might still treat this as undefined/null
 *
 * const filesWithUrl = files.filter(hasPresentKey("url"));
 * files[0].url // TS will know that this is present
 * ```
 *
 * See https://github.com/microsoft/TypeScript/issues/16069
 * why is that useful.
 */
export function hasPresentKey<K extends string | number | symbol>(k: K) {
  return <T, V>(a: T & { [k in K]?: V | null }): a is T & { [k in K]: V } =>
    a[k] !== undefined && a[k] !== null;
}

/**
 * Returns a function that can be used to filter down objects
 * to the ones that have a specific value V under a key `k`.
 *
 * @example
 * ```ts
 * type File = { type: "image", imageUrl: string } | { type: "pdf", pdfUrl: string };
 * const files: File[] = [];
 *
 * const imageFiles = files.filter(file => file.type === "image");
 * files[0].type // In this case, TS will still treat it  as `"image" | "pdf"`
 *
 * const filesWithUrl = files.filter(hasValueKey("type", "image" as const));
 * files[0].type // TS will now know that this is "image"
 * files[0].imageUrl // TS will know this is present, because already it excluded the other union members.
 *
 * Note: the cast `as const` is necessary, otherwise TS will only know that type is a string.
 * ```
 *
 * See https://github.com/microsoft/TypeScript/issues/16069
 * why is that useful.
 */
export function hasValueAtKey<K extends string | number | symbol, V>(
  k: K,
  v: V,
) {
  return <T>(a: T & { [k in K]: any }): a is T & { [k in K]: V } => a[k] === v;
}

export const isStoredError = (
  value: unknown,
): value is {
  type: 'error';
  name: string;
  message: string;
  cause?: string;
  stack?: string;
} => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    value.type === 'error'
  );
};

/**
 * Returns the default view based on the user-provided view and the enabled views.
 */
export function getDefaultView(
  userProvidedDefaultView: View | undefined,
  options: MarkpromptOptions,
): View {
  const isSearchEnabled =
    options?.search?.enabled ?? DEFAULT_MARKPROMPT_OPTIONS.search.enabled;

  const isChatEnabled =
    options?.chat?.enabled ?? DEFAULT_MARKPROMPT_OPTIONS.chat.enabled;

  if (userProvidedDefaultView === 'search' && isSearchEnabled) {
    return userProvidedDefaultView;
  }

  if (userProvidedDefaultView === 'chat' && isChatEnabled) {
    return userProvidedDefaultView;
  }

  if (isSearchEnabled) {
    return 'search';
  }

  return 'chat';
}

export const emitter = new Emittery<{
  open: { view?: View; options?: ViewOptions };
  close: undefined;
}>();

/**
 * Open Markprompt programmatically. Useful for building a custom trigger
 * or opening the Markprompt dialog in response to other user actions.
 */
export function openMarkprompt(
  view?: View,
  options?: ViewOptions,
): Promise<void> {
  return emitter.emit('open', { view, options });
}

/**
 * Close Markprompt programmatically. Useful for building a custom trigger
 * or closing the Markprompt dialog in response to other user actions.
 */
export function closeMarkprompt(): Promise<void> {
  return emitter.emit('close');
}

export function getMessageTextContent(m: ChatCompletionMessageParam) {
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
