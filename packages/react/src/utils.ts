import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';

export function isPresent<T>(t: T | undefined | null | void): t is T {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (obj as any)[Symbol.iterator] === 'function';
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
  return function <T, V>(
    a: T & { [k in K]?: V | null },
  ): a is T & { [k in K]: V } {
    return a[k] !== undefined && a[k] !== null;
  };
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function <T>(a: T & { [k in K]: any }): a is T & { [k in K]: V } {
    return a[k] === v;
  };
}
