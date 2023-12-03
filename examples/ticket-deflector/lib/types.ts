export interface SubmitChatGeneratorYield {
  role?: 'assistant' | 'function' | 'system' | 'user';
  content: string | null;
  conversationId?: string;
  promptId?: string;
  references?: FileSectionReference[];
  received?: string;
}

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

export interface FileReferenceFileData {
  title?: string;
  path: string;
  meta?: object;
  source: Source;
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

export interface FileSectionReference extends FileSectionReferenceSectionData {
  file: FileReferenceFileData;
}

export interface ChatCompletionsJsonResponse {
  text: string | null;
  references: FileSectionReference[];
  promptId: string;
  conversationId: string;
}
