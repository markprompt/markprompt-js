import {
  Markprompt,
  openMarkprompt,
  type MarkpromptOptions,
} from '@markprompt/react';
import React from 'react';
import { render } from 'react-dom';

function getHTMLElement(
  value: HTMLElement | string,
  environment: typeof window = window,
): HTMLElement {
  if (typeof value !== 'string') return value;
  const el = environment.document.querySelector<HTMLElement>(value);
  if (!el) throw new Error(`Could not find element with selector "${value}"`);
  return el;
}

let node: HTMLElement;

/**
 * Render a markprompt dialog.
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
  if (!node) node = getHTMLElement(container);
  render(<Markprompt projectKey={projectKey} {...options} />, node);
}

export { markprompt, openMarkprompt };
