import { type SubmitPromptOptions } from '@markprompt/core';
import type { FlattenedSearchResult } from '@markprompt/react';

type MarkpromptOptions = SubmitPromptOptions & {
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
  search?: {
    /**
     * Enable search
     * @default false
     **/
    enable?: boolean;
    /** Callback to transform a search result into an href */
    getResultHref?: (result: FlattenedSearchResult) => string;
  };
  prompt?: {
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
  trigger?: {
    /**
     * `aria-label` for the open button
     * @default "Open Markprompt"
     **/
    label?: string;
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
