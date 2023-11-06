import type { DocSearchHit } from './docsearch.js';

export type RequiredKeys<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;

export type OpenAIChatCompletionsModelId =
  | 'gpt-4'
  | 'gpt-4-32k'
  | 'gpt-4-1106-preview'
  | 'gpt-3.5-turbo';

export type OpenAICompletionsModelId =
  | 'text-davinci-003'
  | 'text-davinci-002'
  | 'text-curie-001'
  | 'text-babbage-001'
  | 'text-ada-001'
  | 'davinci'
  | 'curie'
  | 'babbage'
  | 'ada';

export type OpenAIEmbeddingsModelId = 'text-embedding-ada-002';

export type OpenAIModelId =
  | OpenAIChatCompletionsModelId
  | OpenAICompletionsModelId
  | OpenAIEmbeddingsModelId;

export type SourceType =
  | 'github'
  | 'motif'
  | 'website'
  | 'file-upload'
  | 'api-upload'
  | 'nango'
  | 'salesforce';

export interface Source {
  type: SourceType;
  data?: {
    url?: string;
    domain?: string;
  };
}

export interface SearchResult extends SearchResultSection {
  file: FileReferenceFileData;
  matchType: 'title' | 'leadHeading' | 'content';
}

export interface SearchResultSection extends FileSectionReferenceSectionData {
  content?: string;
  snippet?: string;
}

export interface FileSectionReference extends FileSectionReferenceSectionData {
  file: FileReferenceFileData;
}

export interface FileSectionReferenceSectionData {
  meta?: {
    leadHeading?: {
      id?: string;
      depth?: number;
      value?: string;
      slug?: string;
    };
  };
}

export interface FileReferenceFileData {
  title?: string;
  path: string;
  meta?: object;
  source: Source;
}

export interface SearchResultsResponse {
  debug?: unknown;
  data: SearchResult[];
}

export type AlgoliaDocSearchHit = DocSearchHit;

export interface AlgoliaDocSearchResultsResponse {
  hits: AlgoliaDocSearchHit[];
}

export interface PromptFeedback {
  vote: '1' | '-1';
}
