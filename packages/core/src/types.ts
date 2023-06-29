export type OpenAIChatCompletionsModelId =
  | 'gpt-4'
  | 'gpt-4-0314'
  | 'gpt-4-32k'
  | 'gpt-4-32k-0314'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-0301';

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

export type SearchResultSection = {
  content: string;
  meta?: {
    leadHeading?: {
      id?: string;
      depth: number;
      value: string;
    };
  };
  score: number;
};

export type SourceType =
  | 'github'
  | 'motif'
  | 'website'
  | 'file-upload'
  | 'api-upload';

export type Source = {
  type: SourceType;
  data: {
    url?: string;
    domain?: string;
  };
};

export type SearchResult = {
  path: string;
  meta: {
    title: string;
  };
  source: Source;
  sections: SearchResultSection[];
};

export type SearchResultsResponse = {
  project_id: string;
  data: SearchResult[];
};
