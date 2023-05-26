import React from 'react';
import { createRoot } from 'react-dom/client';

import { Markprompt } from './Markprompt.js';
import { type MarkpromptOptions } from './types.js';

function getHTMLElement(
  value: HTMLElement | string,
  environment: typeof window = window,
): HTMLElement {
  if (typeof value !== 'string') return value;
  const el = environment.document.querySelector<HTMLElement>(value);
  if (!el) throw new Error(`Could not find element with selector "${value}"`);
  return el;
}

/**
 * @param projectKey Your Markprompt project key
 * @param container The element or selector to render Markprompt into
 * @param options Options for customizing Markprompt
 */
export function markprompt(
  projectKey: string,
  container: HTMLElement | string,
  options?: MarkpromptOptions,
) {
  const { render } = createRoot(getHTMLElement(container));
  render(<Markprompt projectKey={projectKey} {...options} />);
}
