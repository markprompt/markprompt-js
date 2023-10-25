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
