export {
  submitFeedback,
  type SubmitFeedbackOptions,
  type SubmitFeedbackBody,
  DEFAULT_SUBMIT_FEEDBACK_OPTIONS,
} from './feedback.js';

export {
  submitPrompt,
  type SubmitPromptOptions,
  DEFAULT_SUBMIT_PROMPT_OPTIONS,
  STREAM_SEPARATOR,
} from './prompt.js';

export {
  submitSearchQuery,
  submitAlgoliaDocsearchQuery,
  type SubmitSearchQueryOptions,
  DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
} from './search.js';

export {
  type FileSectionReference,
  type FileReferenceFileData,
  type OpenAIModelId,
  type OpenAIChatCompletionsModelId,
  type OpenAICompletionsModelId,
  type OpenAIEmbeddingsModelId,
  type SearchResult,
  type SearchResultSection,
  type SearchResultsResponse,
  type AlgoliaDocSearchHit,
  type AlgoliaDocSearchResultsResponse,
  type Source,
  type SourceType,
} from './types.js';
