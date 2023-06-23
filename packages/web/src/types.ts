import {
  type Source,
  type SubmitPromptOptions,
  type SubmitSearchQueryOptions,
} from '@markprompt/core';
import type { SectionHeading } from '@markprompt/react';

type MarkpromptOptions = {
  close?: {
    /**
     * `aria-label` for the close modal button
     * @default "Close Markprompt"
     **/
    label?: string;
  };
  description?: {
    /**
     * Visually hide the description
     * @default true
     **/
    hide?: boolean;
    /**
     * Description text
     **/
    text?: string;
  };
  prompt?: SubmitPromptOptions & {
    /**
     * Label for the prompt input
     * @default "Ask me anything…"
     **/
    label?: string;
    /**
     * Placeholder for the prompt input
     * @default "Ask me anything…"
     **/
    placeholder?: string;
    /**
     * When search is enabled, this label is used for the CTA button
     * that opens the prompt.
     * @default "Ask Docs AI…"
     **/
    cta?: string;
  };
  references?: {
    /**
     * Callback to transform a reference id into an href and text
     **/
    transformReferenceId: (referenceId: string) => {
      href: string;
      text: string;
    };
    /** Loading text, default: `Fetching relevant pages…` */
    loadingText?: string;
    /**
     * References title
     * @default "Answer generated from the following sources:"
     **/
    referencesText?: string;
  };
  /**
   * Enable and configure search functionality
   */
  search?: SubmitSearchQueryOptions & {
    /**
     * Enable search
     * @default false
     **/
    enabled?: boolean;
    /** Callback to transform a search result into an href */
    getResultHref?: (
      path: string,
      sectionHeading: SectionHeading | undefined,
      source: Source,
    ) => string;
  };
  trigger?: {
    /**
     * `aria-label` for the open button
     * @default "Open Markprompt"
     **/
    label?: string;
    /**
     * Placeholder text for non-floating element.
     * @default "Ask docs"
     **/
    placeholder?: string;
    /**
     * Should the trigger button be displayed as a floating button at the bottom right of the page?
     * Setting this to false will display a trigger button in the element passed
     * to the `markprompt` function.
     */
    floating?: boolean;
  };
  title?: {
    /**
     * Visually hide the title
     * @default true
     **/
    hide?: boolean;
    /**
     * Text for the title
     * @default "Ask me anything"
     **/
    text?: string;
  };
  /**
   * Show Markprompt branding
   * @default true
   **/
  showBranding?: boolean;
};

export type { MarkpromptOptions };
