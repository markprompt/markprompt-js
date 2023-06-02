import type { SearchResultsResponse } from './types.js';

export const DEFAULT_SEARCH_URL = 'https://api.markprompt.com/v1/search';
export const DEFAULT_SEARCH_LIMIT = 5;

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
  options?: {
    limit?: number;
    searchUrl?: string;
    signal?: AbortSignal;
  },
): Promise<SearchResultsResponse | undefined> {
  const { limit = DEFAULT_SEARCH_LIMIT, searchUrl = DEFAULT_SEARCH_URL } =
    options ?? {};

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
      throw new Error('Failed to fetch search results');
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
