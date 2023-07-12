import type { SearchResultsResponse } from './types.js';
import { getErrorMessage } from './utils.js';

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
   * AbortController signal
   * @default undefined
   **/
  signal?: AbortSignal;
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
  const {
    limit = DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.limit,
    apiUrl = DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.apiUrl,
  } = options ?? {};

  const params = new URLSearchParams({
    query,
    projectKey,
    limit: String(limit),
  });

  try {
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
    if (error instanceof DOMException && error.name === 'AbortError') {
      // do nothing on AbortError's, this is expected
      return undefined;
    } else {
      throw error;
    }
  }
}
