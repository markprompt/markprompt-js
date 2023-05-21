import { type Options as CoreOptions } from '@markprompt/core';

type MarkpromptOptions = CoreOptions & {
  /** Props for the close modal button */
  close?: {
    /** Aria-label for the close modal button */
    label?: string;
  };
  /** Props for the description */
  description?: {
    /** Whether to hide the description, default: `true` */
    hide?: boolean;
    /** Text for the description */
    text?: string;
  };
  /** Props for the prompt */
  prompt?: {
    /** Label for the prompt input, default: `Your prompt` */
    label?: string;
    /** Placeholder for the prompt input, default: `Ask me anything…` */
    placeholder?: string;
  };
  references?: {
    /** Callback to transform a reference id into an href and text */
    transformReferenceId: (referenceId: string) => {
      href: string;
      text: string;
    };
    /** Loading text, default: `Fetching relevant pages…` */
    loadingText?: string;
    /** References title, default: `Answer generated from the following sources:` */
    referencesText?: string;
  };
  /** Props for the trigger */
  trigger?: {
    /** Aria-label for the trigger button */
    label?: string;
  };
  /** Props for the title */
  title?: {
    /** Whether to hide the title, default: `true` */
    hide?: boolean;
    /** Text for the title: default `Ask me anything` */
    text?: string;
  };
};

export type { MarkpromptOptions };
