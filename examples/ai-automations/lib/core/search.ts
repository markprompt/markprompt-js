import type { SearchOptions } from '@algolia/client-search';

import type {
  AlgoliaDocSearchResultsResponse,
  SearchResultsResponse,
} from './types';
import { getErrorMessage, isAbortError } from './utils';

export interface SubmitSearchQueryOptions {
  /**
   * Maximum amount of results to return
   * @default 8
   **/
  limit?: number;
  /**
   * URL at which to fetch search results
   * @default "https://api.markprompt.com/v1/search"
   **/
  apiUrl?: string;
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

export const DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS: SubmitSearchQueryOptions = {
  limit: 8,
  apiUrl: 'https://api.markprompt.com/v1/search',
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
  options?: SubmitSearchQueryOptions,
): Promise<SearchResultsResponse | undefined> {
  try {
    const {
      limit = DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.limit,
      apiUrl = DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.apiUrl,
    } = options ?? {};

    const params = new URLSearchParams({
      query,
      projectKey,
      limit: String(limit),
    });

    const res = await fetch(`${apiUrl}?${params.toString()}`, {
      method: 'GET',
      signal: options?.signal,
    });

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
    } else {
      throw error;
    }
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
    } else {
      throw error;
    }
  }
}
