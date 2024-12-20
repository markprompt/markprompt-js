/* eslint-disable react-refresh/only-export-components */

import {
  Markprompt,
  openMarkprompt,
  closeMarkprompt,
  type MarkpromptOptions,
  type ChatViewProps,
  ChatView,
  type StandaloneTicketDeflectionFormProps,
  StandaloneTicketDeflectionForm,
} from '@markprompt/react';
import { createRoot } from 'react-dom/client';

function getHTMLElement(
  value: HTMLElement | string,
  environment: typeof window = window,
): HTMLElement {
  if (typeof value !== 'string') return value;
  const el = environment.document.querySelector<HTMLElement>(value);
  if (!el) throw new Error(`Could not find element with selector "${value}"`);
  return el;
}

type Root = ReturnType<typeof createRoot>;

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

type ChatOptions = Omit<ChatViewProps, 'activeView' | 'projectKey'>;

/**
 * Render the Markprompt chat view.
 * Useful when you want to incorporate the chat view into your own UI.
 * @param projectKey Your Markprompt project key
 * @param container The element or selector to render the chat view into
 * @param options Options for customizing the chat view
 */
function markpromptChat(
  projectKey: string,
  container: HTMLElement | string,
  options?: ChatOptions,
): void {
  if (!chatRoot) chatRoot = createRoot(getHTMLElement(container));
  chatRoot.render(
    <ChatView
      projectKey={projectKey}
      {...options}
      chatOptions={{
        ...options?.chatOptions,
        enabled: true,
      }}
    />,
  );
}

let ticketDeflectionFormRoot: Root;

type TicketDeflectionFormOptions = StandaloneTicketDeflectionFormProps;

/**
 * Render the Markprompt ticket deflection form.
 * Useful for incorporating the ticket deflection form into your own UI.
 * @param container The element or selector to render the form into
 * @param options Options for customizing the form
 */
function ticketDeflectionForm(
  container: HTMLElement | string,
  options: TicketDeflectionFormOptions,
): void {
  if (!ticketDeflectionFormRoot) {
    ticketDeflectionFormRoot = createRoot(getHTMLElement(container));
  }

  ticketDeflectionFormRoot.render(
    <StandaloneTicketDeflectionForm {...options} />,
  );
}

export {
  markprompt,
  openMarkprompt,
  closeMarkprompt,
  type MarkpromptOptions,
  markpromptChat,
  type ChatOptions,
  ticketDeflectionForm,
  type TicketDeflectionFormOptions,
};
