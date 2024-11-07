import type {
  AlgoliaDocSearchHit,
  SearchResult,
} from '@markprompt/core/search';
import type { FileSectionReference } from '@markprompt/core/types';

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
  }
  const leadHeading = result.meta?.leadHeading;
  if (result.matchType === 'leadHeading' && leadHeading?.value) {
    return result.file.title;
  }
  return leadHeading?.value || result.file.title;
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
  display: 'sheet',
  layout: 'panels',
  apiUrl: 'https://api.markprompt.com',
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
    votes: true,
    csat: true,
    csatReason: true,
    heading: 'Was this response helpful?',
    headingCSAT: 'How helpful was this?',
    headingCSATReason: 'Could you tell us more?',
    thankYouCSATReason: 'Thank you!',
  },
  chat: {
    enabled: true,
    label: 'Ask AI',
    tabLabel: 'Ask AI',
    placeholder: 'Ask AI…',
    history: true,
    showCopy: true,
    errorText: () => {
      return (
        <p className="MarkpromptDefaultError">
          Sorry, it looks like the bot is having a hard time! Please try again
          in a few minutes.
        </p>
      );
    },
    avatars: {
      visible: true,
    },
  },
  references: {
    loadingText: 'Fetching context…',
    heading: 'Related articles',
    getHref: defaultGetHref,
    getLabel: defaultPromptGetLabel,
    filter: undefined,
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
      prompt: `You act as an expert summarizer.

- You must write in the first person, as if you were the user writing a support ticket. Failure to do so will result in severe penalties.
- Your task is to generate a short and precise summary of the user's input only.
- You focus on the user message, and omit assistant messages unless strictly needed.
- You must not include any references to creating a support ticket.
- You must write a standalone summary, with no greetings or other extra text.
- The summary must not be longer than the user messages. You will be penalized if it is longer.
- You must output your response in plain text.
- You must stricly adhere to these rules to avoid penalties.

Example:
- I am having an issue with setting up my payment processor.
- I can no longer log in to my account.`,
      messageText: 'Need more help?',
      messageButton: {
        text: 'Create a support ticket',
        hasIcon: true,
        hasText: true,
      },
      form: {
        emailLabel: 'Email',
        emailPlaceholder: '',
        nameLabel: 'Name',
        namePlaceholder: '',
        submitLabel: 'Submit case',
        summaryLabel: 'How can we help?',
        summaryLoading: 'Generating summary…',
        summaryPlaceholder: 'Please describe your issue',
        ticketCreatedError: 'An error occurred while creating the case.',
        ticketCreatedOk: 'Thank you! We will get back to you shortly.',
        uploadFileLabel: 'Attach a file',
        hasFileUploadInput: false,
        maxFileSizeError:
          'Total file size is too large to upload. Maximum allowed size is 4.5MB.',
      },
      chat: {
        title: 'Get help',
        subtitle: 'How can we help?',
        placeholder: ['I am having trouble with...', 'Send a message'],
        openTicketFormLabel: 'Create case',
        openTicketFormLoading: 'Creating case…',
        disclaimerView: {
          message:
            'Answers generated with AI. Consider checking important information.',
        },
      },
    },
  },
} satisfies MarkpromptOptions;
