import { Database } from './supabase';

export type TimeInterval = '1h' | '24h' | '7d' | '30d' | '3m' | '1y';
export type TimePeriod = 'hour' | 'day' | 'weekofyear' | 'month' | 'year';
export type HistogramStat = { start: number; end: number; value: number };

export type OpenAIModelIdWithType =
  | { type: 'chat_completions'; value: OpenAIChatCompletionsModelId }
  | { type: 'completions'; value: OpenAICompletionsModelId };

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

export type OpenAIModelId =
  | OpenAIChatCompletionsModelId
  | OpenAICompletionsModelId;

export const SUPPORTED_MODELS: {
  chat_completions: OpenAIChatCompletionsModelId[];
  completions: OpenAICompletionsModelId[];
} = {
  chat_completions: [
    'gpt-4',
    'gpt-4-0314',
    'gpt-4-32k',
    'gpt-4-32k-0314',
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-0301',
  ],
  completions: [
    'text-davinci-003',
    'text-davinci-002',
    'text-curie-001',
    'text-babbage-001',
    'text-ada-001',
    'davinci',
    'curie',
    'babbage',
    'ada',
  ],
};

export type DbUser = Database['public']['Tables']['users']['Row'];
export type Team = Database['public']['Tables']['teams']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Token = Database['public']['Tables']['tokens']['Row'];
export type Domain = Database['public']['Tables']['domains']['Row'];
export type Membership = Database['public']['Tables']['memberships']['Row'];
export type MembershipType =
  Database['public']['Tables']['memberships']['Row']['type'];
export type DbFile = Database['public']['Tables']['files']['Row'];
export type FileSections = Database['public']['Tables']['file_sections']['Row'];

export type FileData = { path: string; name: string; content: string };
export type PathContentData = Pick<FileData, 'path' | 'content'>;
export type ProjectChecksums = Record<FileData['path'], string>;

export class ApiError extends Error {
  readonly code: number;

  constructor(code: number, message?: string | null) {
    super(message || 'API Error');
    this.code = code;
  }
}
