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
    name?: string;
  };
}

export interface FileSectionReference extends FileSectionReferenceSectionData {
  /**
   * Referenced file.
   */
  file: FileReferenceFileData;
}

export interface FileSectionReferenceSectionData {
  /**
   * Metadata associated to the file section.
   */
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
  /**
   * File title.
   */
  title?: string;
  /**
   * File path, e.g. URL or GitHub file path.
   */
  path: string;
  /**
   * File metadata.
   */
  meta?: object;
  /**
   * File source.
   */
  source: Source;
}

export interface BaseOptions {
  apiUrl?: string;
  headers?: { [key: string]: string };
}
