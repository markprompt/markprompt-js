import type { SearchOptions } from '@algolia/client-search';
import defaults from 'defaults';

import { DEFAULT_OPTIONS } from './constants.js';
import type { DocSearchHit } from './docsearch.js';
import type {
  BaseOptions,
  FileReferenceFileData,
  FileSectionReferenceSectionData,
} from './types.js';
import { getErrorMessage, isAbortError } from './utils.js';

export interface SubmitSearchQueryOptions {
  /**
   * Maximum amount of results to return
   * @default 8
   **/
  limit?: number;
  /**
   * Custom provider configuration
   * @default undefined
   **/
  provider?: AlgoliaProvider;
  /**
   * AbortController signal
   * @default undefined
   **/
  signal?: AbortSignal;
}

export interface AlgoliaProvider {
  name: 'algolia';
  /**
   * Algolia API key
   **/
  apiKey: string;
  /**
   * Algolia application ID
   **/
  appId: string;
  /**
   * Algolia index name
   **/
  indexName: string;
  /**
   * Algolia search parameters, like `facetFilters`
   **/
  searchParameters?: SearchOptions;
}

export interface SearchResultSection extends FileSectionReferenceSectionData {
  content?: string;
  snippet?: string;
}

export interface SearchResult extends SearchResultSection {
  /**
   * Reference file.
   */
  file: FileReferenceFileData;
  /**
   * Match type.
   */
  matchType: 'title' | 'leadHeading' | 'content';
}

export interface SearchResultsResponse {
  debug?: unknown;
  data: SearchResult[];
}

export type AlgoliaDocSearchHit = DocSearchHit;

export interface AlgoliaDocSearchResultsResponse {
  hits: AlgoliaDocSearchHit[];
}

export const DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS: SubmitSearchQueryOptions = {
  limit: 8,
};

/**
 * Submit a search query to the Markprompt Search API.
 * @param query - Search query
 * @param projectKey - Project key for the project
 * @param [options] - Optional parameters
 * @returns Search results
 */
export async function submitSearchQuery(
  query: string,
  projectKey: string,
  options: SubmitSearchQueryOptions & BaseOptions = {},
): Promise<SearchResultsResponse | undefined> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { limit = DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.limit, apiUrl } =
      options ?? {};

    const resolvedOptions = defaults(
      { limit, apiUrl },
      {
        ...DEFAULT_OPTIONS,
        ...DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
      },
    );

    const params = new URLSearchParams({
      query,
      projectKey,
      limit: String(resolvedOptions.limit),
    });

    const res = await fetch(
      `${resolvedOptions.apiUrl}/search?${params.toString()}`,
      {
        method: 'GET',
        signal: options?.signal,
        headers: new Headers({
          'X-Markprompt-API-Version': '2023-12-01',
          ...(resolvedOptions.headers ? resolvedOptions.headers : {}),
        }),
      },
    );

    if (!res.ok) {
      const message = await getErrorMessage(res);
      throw new Error(
        `Failed to fetch search results: ${message || 'Unknown error'}`,
      );
    }

    return res.json();
  } catch (error) {
    if (isAbortError(error)) {
      // do nothing on AbortError's, this is expected
      return undefined;
    }
    throw error;
  }
}

/**
 * Submit a search query to the Algolia Docsearch API.
 * @param query - Search query
 * @param [options] - Optional parameters
 * @returns Search results
 */
export async function submitAlgoliaDocsearchQuery(
  query: string,
  options?: SubmitSearchQueryOptions,
): Promise<AlgoliaDocSearchResultsResponse | undefined> {
  try {
    const provider = options?.provider;
    if (provider?.name !== 'algolia') {
      throw new Error(`Unknown provider: ${provider?.name}`);
    }

    const { limit = DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.limit } = options ?? {};

    const res = await fetch(
      `https://${provider.appId}-dsn.algolia.net/1/indexes/${provider.indexName}/query`,
      {
        method: 'POST',
        body: JSON.stringify({
          query,
          hitsPerPage: limit,
          getRankingInfo: 1,
          ...options?.provider?.searchParameters,
        }),
        signal: options?.signal,
        headers: {
          'X-Algolia-API-Key': provider.apiKey,
          'X-Algolia-Application-Id': provider.appId,
        },
      },
    );

    if (!res.ok) {
      const message = await getErrorMessage(res);
      throw new Error(
        `Failed to fetch search results: ${message || 'Unknown error'}`,
      );
    }

    return res.json();
  } catch (error) {
    if (isAbortError(error)) {
      // do nothing on AbortError's, this is expected
      return undefined;
    }
    throw error;
  }
}
