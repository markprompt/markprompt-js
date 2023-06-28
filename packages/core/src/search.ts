import type { SearchResultsResponse } from './types.js';

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
  searchUrl?: string;
  /**
   * AbortController signal
   * @default undefined
   **/
  signal?: AbortSignal;
}

export const DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS: SubmitSearchQueryOptions = {
  limit: 8,
  searchUrl: 'https://api.markprompt.com/v1/search',
};

/**
 * Submit a search query to the Markprompt Search API endpoint.
 * @param query - Search query
 * @param projectKey - Project key for the project to search
 * @param options - Optional parameters
 * @returns Search results
 */
export async function submitSearchQuery(
  query: string,
  projectKey: string,
  options?: SubmitSearchQueryOptions,
): Promise<SearchResultsResponse | undefined> {
  const {
    limit = DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.limit,
    searchUrl = DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.searchUrl,
  } = options ?? {};

  const params = new URLSearchParams({
    query,
    projectKey,
    limit: String(limit),
  });

  try {
    const response = await fetch(`${searchUrl}?${params.toString()}`, {
      method: 'GET',
      signal: options?.signal,
    });

    if (!response.ok) {
      const error = (await response.json())?.error;
      throw new Error(
        `Failed to fetch search results: ${error || 'Unknown error'}`,
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // do nothing on AbortError's, this is expected
      return undefined;
    } else {
      throw error;
    }
  }
}
