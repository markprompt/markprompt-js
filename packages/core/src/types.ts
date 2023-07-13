export type OpenAIChatCompletionsModelId = 'gpt-4' | 'gpt-3.5-turbo';

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

export type RequiredKeys<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;

export type SourceType =
  | 'github'
  | 'motif'
  | 'website'
  | 'file-upload'
  | 'api-upload';

export type Source = {
  type: SourceType;
  data?: {
    url?: string;
    domain?: string;
  };
};

export type SearchResult = {
  file: FileReferenceFileData;
  matchType: 'title' | 'leadHeading' | 'content';
} & SearchResultSection;

export type SearchResultSection = {
  content?: string;
  snippet?: string;
} & FileSectionReferenceSectionData;

export type FileSectionReference = {
  file: FileReferenceFileData;
} & FileSectionReferenceSectionData;

export type FileSectionReferenceSectionData = {
  meta?: {
    leadHeading?: {
      id?: string;
      depth?: number;
      value?: string;
      slug?: string;
    };
  };
};

export type FileReferenceFileData = {
  title?: string;
  path: string;
  meta?: any;
  source: Source;
};

export type SearchResultsResponse = {
  debug?: any;
  data: SearchResult[];
};
