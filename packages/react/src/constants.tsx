import {
  DEFAULT_SUBMIT_PROMPT_OPTIONS,
  DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
} from '@markprompt/core';
import Slugger from 'github-slugger';

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

const defaultGetResultHref = (
  filePath: string,
  sectionHeading: SectionHeading | undefined,
): string => {
  const p = pathToHref(filePath);
  if (sectionHeading?.id) {
    return `${p}#${sectionHeading.id}`;
  } else if (sectionHeading?.value) {
    // Do not reuse a Slugger instance, as it will
    // append `-1`, `-2`, ... to links if it encounters the
    // same link twice.
    const slugger = new Slugger();
    return `${p}#${slugger.slug(sectionHeading.value)}`;
  }
  return p;
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
    transformReferenceId: defaultTransformReferenceId,
    loadingText: 'Fetching relevant pages…',
    referencesText: 'Answer generated from the following sources:',
  },
  search: {
    ...DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
    enabled: false,
    getResultHref: defaultGetResultHref,
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
