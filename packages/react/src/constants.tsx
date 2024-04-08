import {
  type AlgoliaDocSearchHit,
  type FileSectionReference,
  type SearchResult,
} from '@markprompt/core';

import type { MarkpromptOptions } from './types.js';

const removeFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');

  if (lastDotIndex === -1) {
    return fileName;
  }

  return fileName.substring(0, lastDotIndex);
};

const filePathToHref = (path: string): string => {
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

function trimContent(text: string): string {
  // we don't use String.prototype.trim() because we
  // don't want to remove line terminators from Markdown
  return text.trimStart().trimEnd();
}

function removeLeadHeading(text: string, heading?: string): string {
  // This needs to be revised. When returning the search result, the endpoint
  // provides a snippet of the content around the search term (to avoid sending
  // entire sections). This snippet may contain the start of the section
  // content, and this content may start with a heading (the leadHeading).
  // We don't want this leadHeading to be part of the content snippet.
  // Since it's a snippet, we can't assume that the leadHeading will always be
  // the first line. Instead, we have to check it in the string itself.
  const trimmedContent = trimContent(text);
  if (!heading) {
    return trimmedContent;
  }
  const pattern = new RegExp(`^#{1,}\\s${heading}\\s?`);
  return trimContent(trimmedContent.replace(pattern, ''));
}

function createKWICSnippet(
  content: string,
  normalizedSearchQuery: string,
): string {
  const trimmedContent = content.trim().replace(/\n/g, ' ');
  const index = trimmedContent
    .toLocaleLowerCase()
    .indexOf(normalizedSearchQuery);

  if (index === -1) {
    return trimmedContent.slice(0, 200);
  }

  const rawSnippet = trimmedContent.slice(Math.max(0, index - 50), index + 150);

  const words = rawSnippet.split(/\s+/);
  if (words.length > 3) {
    return words.slice(1, words.length - 1).join(' ');
  }
  return words.join(' ');
}

const defaultPromptGetLabel = (reference: FileSectionReference): string => {
  if (reference.meta?.leadHeading?.value) {
    return reference.meta.leadHeading.value;
  }

  if (reference.file?.title) {
    return reference.file.title;
  }

  const fileName = reference.file.path.split('/').pop();
  if (fileName) return removeFileExtension(fileName);

  return reference.file?.path;
};

const isAlgoliaSearchResult = (
  result: FileSectionReference | SearchResult | AlgoliaDocSearchHit,
): result is AlgoliaDocSearchHit => {
  return '_highlightResult' in result;
};

const defaultGetHref = (
  result: FileSectionReference | SearchResult | AlgoliaDocSearchHit,
): string | undefined => {
  if (isAlgoliaSearchResult(result)) {
    return result.url;
  }

  let path = '';

  if (result.file.source.type === 'github') {
    // If it's a repo, it's probably a file with an extension,
    // and names such as "index".
    path = filePathToHref(result.file.path);
  } else {
    path = result.file.path;
  }

  if (result.meta?.leadHeading?.id) {
    return `${path}#${result.meta.leadHeading.id}`;
  }

  if (result.meta?.leadHeading?.value) {
    return `${path}#${result.meta.leadHeading.slug}`;
  }

  return path;
};

const defaultGetSearchResultHeading = (
  result: SearchResult | AlgoliaDocSearchHit,
): string | undefined => {
  if (isAlgoliaSearchResult(result)) {
    return result.hierarchy?.lvl0 || undefined;
  }

  if (result.matchType === 'title') {
    return undefined;
  } else {
    const leadHeading = result.meta?.leadHeading;
    if (result.matchType === 'leadHeading' && leadHeading?.value) {
      return result.file.title;
    } else {
      return leadHeading?.value || result.file.title;
    }
  }
};

const defaultGetSearchResultTitle = (
  result: SearchResult | AlgoliaDocSearchHit,
  query: string,
): string | undefined => {
  if (isAlgoliaSearchResult(result)) {
    return result.hierarchy?.lvl1 || undefined;
  }

  if (result.matchType === 'title') {
    return result.file.title;
  }

  const leadHeading = result.meta?.leadHeading;
  if (result.matchType === 'leadHeading' && leadHeading?.value) {
    return leadHeading.value;
  }

  const normalizedSearchQuery = query.toLowerCase();
  // Fast and hacky way to remove the lead heading from
  // the content, which we don't want to be part of the snippet.
  const trimmedContent = removeLeadHeading(
    result.snippet || '',
    result.meta?.leadHeading?.value,
  );

  return createKWICSnippet(trimmedContent, normalizedSearchQuery);
};

const defaultGetSearchResultSubtitle = (
  result: SearchResult | AlgoliaDocSearchHit,
): string | undefined => {
  if (isAlgoliaSearchResult(result)) {
    return result.hierarchy?.lvl2 || undefined;
  }

  return undefined;
};

export const DEFAULT_MARKPROMPT_OPTIONS = {
  display: 'dialog',
  layout: 'panels',
  branding: {
    show: true,
    type: 'plain',
  },
  close: {
    label: 'Close Markprompt',
    visible: true,
    hasIcon: true,
  },
  description: {
    hide: true,
    text: 'Markprompt',
  },
  feedback: {
    enabled: true,
    heading: 'Was this response helpful?',
  },
  chat: {
    enabled: true,
    label: 'Ask AI',
    tabLabel: 'Ask AI',
    placeholder: 'Ask AI…',
    history: true,
    showCopy: true,
    errorText: () => (
      <p className="MarkpromptDefaultError">
        Sorry, it looks like the bot is having a hard time! Please try again in
        a few minutes.
        {/* We should find a better way to display this message. */}
        {/* <details>
          <summary>Error info</summary>
          <code>
            {props.error.name}: {props.error.message}
          </code>
        </details> */}
      </p>
    ),
    avatars: {
      visible: true,
    },
  },
  references: {
    loadingText: 'Fetching context…',
    heading: 'Sources',
    getHref: defaultGetHref,
    getLabel: defaultPromptGetLabel,
  },
  search: {
    enabled: false,
    getHref: defaultGetHref,
    getHeading: defaultGetSearchResultHeading,
    getTitle: defaultGetSearchResultTitle,
    getSubtitle: defaultGetSearchResultSubtitle,
    label: 'Search documentation',
    tabLabel: 'Search',
    placeholder: 'Search documentation',
  },
  trigger: {
    label: 'Ask AI',
    placeholder: 'Ask AI',
    floating: true,
    customElement: false,
  },
  title: {
    hide: true,
    text: 'Ask AI',
  },
  integrations: {
    createTicket: {
      enabled: false,
      provider: 'zendesk',
      apiUrl: 'https://api.markprompt.com/create-ticket',
      prompt:
        'I want to create a support case. Please summarize the conversation so far for sending it to a support agent. Return only the summary itself without assistant commentary. Use short paragraphs. Include relevant code snippets.',
      messageText: 'Is the AI not helpful?',
      messageButton: {
        text: 'Create a support ticket',
        hasIcon: true,
        hasText: true,
      },
      view: {
        title: 'Create a case',
        nameLabel: 'Your name',
        namePlaceholder: '',
        emailLabel: 'Email',
        emailPlaceholder: '',
        summaryLabel: 'How can we help?',
        summaryPlaceholder: 'Please describe your issue',
        summaryLoading: 'Generating summary…',
        submitLabel: 'Submit case',
        ticketCreatedOk: 'Ticket created successfully!',
        ticketCreatedError: 'An error occurred while creating the case',
      },
    },
  },
} satisfies MarkpromptOptions;
