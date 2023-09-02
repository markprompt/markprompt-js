import {
  Markprompt,
  openMarkprompt,
  type MarkpromptOptions,
  ChatView,
  type ChatViewProps,
} from '@markprompt/react';
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';

function getHTMLElement(
  value: HTMLElement | string,
  environment: typeof window = window,
): HTMLElement {
  if (typeof value !== 'string') return value;
  const el = environment.document.querySelector<HTMLElement>(value);
  if (!el) throw new Error(`Could not find element with selector "${value}"`);
  return el;
}

let root: Root;

/**
 * Render a Markprompt dialog.
 *
 * @param projectKey Your Markprompt project key
 * @param container The element or selector to render Markprompt into
 * @param options Options for customizing Markprompt
 */
function markprompt(
  projectKey: string,
  container: HTMLElement | string,
  options?: MarkpromptOptions,
): void {
  if (!root) root = createRoot(getHTMLElement(container));
  root.render(<Markprompt projectKey={projectKey} {...options} />);
}

let chatRoot: Root;

type MarkpromptChatOptions = Omit<ChatViewProps, 'projectKey'>;

/**
 * Render a standalone Markprompt chat view.
 */
function markpromptChat(
  projectKey: string,
  container: HTMLElement | string,
  options?: MarkpromptChatOptions,
): void {
  if (!chatRoot) chatRoot = createRoot(getHTMLElement(container));
  chatRoot.render(<ChatView projectKey={projectKey} {...options} />);
}

export {
  markprompt,
  openMarkprompt,
  type MarkpromptOptions,
  markpromptChat,
  type MarkpromptChatOptions,
};
