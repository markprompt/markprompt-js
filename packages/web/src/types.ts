import { type Options as CoreOptions } from '@markprompt/core';

type MarkpromptOptions = CoreOptions & {
  /** props for the close modal button */
  close?: {
    /** aria-label for the close modal button */
    label?: string;
  };
  /** props for the description */
  description?: {
    /** whether to hide the description, default: `true` */
    hidden?: boolean;
    /** text for the description */
    text?: string;
  };
  /** props for the prompt */
  prompt?: {
    /** label for the prompt input, default: `Your prompt` */
    label?: string;
    /** placeholder for the prompt input, default: `Ask me anything…` */
    placeholder?: string;
  };
  references?: {
    /** callback to transform a reference id into an href and text */
    transformReferenceId: (referenceId: string) => {
      href: string;
      text: string;
    };
    loadingText?: string;
    referencesText?: string;
  };
  /** props for the trigger */
  trigger?: {
    /** aria-label for the trigger button */
    label?: string;
  };
  /** props for the title */
  title?: {
    /** whether to hide the title, default: `true` */
    hidden?: boolean;
    /** text for the title: default `Ask me anything` */
    text?: string;
  };
};

export type { MarkpromptOptions };
