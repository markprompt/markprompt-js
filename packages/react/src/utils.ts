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
