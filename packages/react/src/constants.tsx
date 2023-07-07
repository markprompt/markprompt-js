import {
  DEFAULT_SUBMIT_PROMPT_OPTIONS,
  DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
  type Source,
} from '@markprompt/core';

import type { MarkpromptOptions, SectionHeading } from './types.js';

const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const removeFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return fileName;
  }
  return fileName.substring(0, lastDotIndex);
};

const defaultTransformReferenceId = (
  referenceId: string,
): { href: string; text: string } => {
  return {
    href: removeFileExtension(referenceId),
    text: capitalize(removeFileExtension(referenceId.split('/').slice(-1)[0])),
  };
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

const defaultGetHref = (
  filePath: string,
  sectionHeading: SectionHeading | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _source: Source,
): string => {
  const path = pathToHref(filePath);
  console.log('In here', path, JSON.stringify(sectionHeading));
  if (sectionHeading?.id) {
    return `${path}#${sectionHeading.id}`;
  } else if (sectionHeading?.value) {
    return `${path}#${sectionHeading.slug}`;
  }
  return path;
};

export const DEFAULT_MARKPROMPT_OPTIONS: MarkpromptOptions = {
  display: 'dialog',
  close: {
    label: 'Close Markprompt',
  },
  description: {
    hide: true,
    text: 'Markprompt',
  },
  prompt: {
    ...DEFAULT_SUBMIT_PROMPT_OPTIONS,
    label: 'Ask me anything…',
    placeholder: 'Ask me anything…',
    cta: 'Ask Docs AI…',
  },
  references: {
    loadingText: 'Fetching relevant pages…',
    heading: 'Answer generated from the following sources:',
    transformReferenceId: defaultTransformReferenceId,
  },
  search: {
    ...DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
    enabled: false,
    getHref: defaultGetHref,
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
