import {
  DEFAULT_SUBMIT_PROMPT_OPTIONS,
  DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
  type FileSectionReference,
} from '@markprompt/core';

import type { MarkpromptOptions } from './types.js';

const removeFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return fileName;
  }
  return fileName.substring(0, lastDotIndex);
};

const pathToHref = (path: string): string => {
  const lastDotIndex = path.lastIndexOf('.');
  let cleanPath = path;
  if (lastDotIndex >= 0) {
    cleanPath = path.substring(0, lastDotIndex);
  }
  if (cleanPath.endsWith('/index')) {
    cleanPath = cleanPath.replace(/\/index/gi, '');
  }
  return cleanPath;
};

const defaultGetHref = (reference: FileSectionReference): string => {
  const path = pathToHref(reference.file.path);
  if (reference.meta?.leadHeading?.id) {
    return `${path}#${reference.meta.leadHeading.id}`;
  } else if (reference.meta?.leadHeading?.value) {
    return `${path}#${reference.meta.leadHeading.slug}`;
  }
  return path;
};

const defaultPromptGetLabel = (reference: FileSectionReference): string => {
  return (
    reference.meta?.leadHeading?.value ||
    reference.file?.title ||
    removeFileExtension(reference.file.path.split('/').slice(-1)[0])
  );
};

export const DEFAULT_MARKPROMPT_OPTIONS: MarkpromptOptions = {
  display: 'dialog',
  close: {
    label: 'Close Markprompt',
    visible: true,
  },
  description: {
    hide: true,
    text: 'Markprompt',
  },
  feedback: {
    enabled: false,
    heading: 'Was this response helpful?',
    confirmationMessage: 'Thank you!',
  },
  prompt: {
    ...DEFAULT_SUBMIT_PROMPT_OPTIONS,
    label: 'Ask me anything…',
    tabLabel: 'Ask AI',
    placeholder: 'Ask me anything…',
    cta: 'Ask Docs AI…',
  },
  references: {
    loadingText: 'Fetching relevant pages…',
    heading: 'Answer generated from the following sources:',
    getHref: defaultGetHref,
    getLabel: defaultPromptGetLabel,
  },
  search: {
    ...DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
    enabled: false,
    getHref: defaultGetHref,
    label: 'Search docs…',
    tabLabel: 'Search',
    placeholder: 'Search docs…',
  },
  trigger: {
    label: 'Open Markprompt',
    placeholder: 'Ask docs',
    floating: true,
    customElement: false,
  },
  title: {
    hide: true,
    text: 'Ask me anything…',
  },
  showBranding: true,
};
