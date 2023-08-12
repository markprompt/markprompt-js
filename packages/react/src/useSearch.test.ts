import {
  DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
  SearchResult,
} from '@markprompt/core';
import { waitFor } from '@testing-library/react';
import { renderHook, cleanup } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  describe,
  expect,
  it,
  afterAll,
  afterEach,
  beforeAll,
  vi,
} from 'vitest';

import { UseSearchResult, useSearch } from './useSearch';

let searchResults: SearchResult[] = [];
let status = 200;

const submitSearchQuery = vi.fn(() => searchResults);
const submitAlgoliaDocsearchQuery = vi.fn();

vi.mock('@markprompt/core', () => ({
  submitSearchQuery,
  submitAlgoliaDocsearchQuery,
}));

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  searchResults = [];
  status = 200;
  server.resetHandlers();
  cleanup();
  vi.resetAllMocks();
});

const server = setupServer(
  rest.get(
    DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.apiUrl!,
    async (_req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.body(JSON.stringify({ data: searchResults })),
      );
    },
  ),
);

describe('useSearch', () => {
  it('should return a default state', () => {
    const { result } = renderHook(() =>
      useSearch({
        projectKey: 'TEST_PROJECT_KEY',
        options: { enabled: true },
      }),
    );

    expect(result.current).toStrictEqual({
      state: 'indeterminate',
      searchResults: [],
      searchQuery: '',
      setSearchQuery: expect.any(Function),
      submitSearchQuery: expect.any(Function),
      abort: expect.any(Function),
    } satisfies UseSearchResult);
  });

  it('should return a state with search results', async () => {
    const { result } = renderHook(() =>
      useSearch({
        projectKey: 'TEST_PROJECT_KEY',
        options: { enabled: true },
      }),
    );

    searchResults = [
      {
        matchType: 'title',
        file: {
          title: 'Home page',
          path: '/',
          source: {
            type: 'file-upload',
          },
        },
      },
      {
        matchType: 'leadHeading',
        file: {
          path: '/page1',
          source: {
            type: 'file-upload',
          },
        },
        meta: {
          leadHeading: { value: 'Page 1' },
        },
      },
      {
        matchType: 'content',
        snippet: 'Page 2 snippet',
        file: {
          path: '/page2',
          source: {
            type: 'file-upload',
          },
        },
      },
    ];

    await result.current.submitSearchQuery('react');

    await waitFor(() => {
      expect(result.current.searchResults[0]?.href).toBe(
        searchResults[0].file.path,
      );
      expect(result.current.searchResults[0]?.title).toBe(
        searchResults[0].file.title,
      );
      expect(result.current.searchResults[1]?.title).toBe(
        searchResults[1].meta?.leadHeading?.value,
      );
      expect(result.current.searchResults[2]?.title).toBe(
        searchResults[2].snippet,
      );
    });
  });

  it.skip('should allow Algolia as a search provider', async () => {
    const { result } = renderHook(() =>
      useSearch({
        projectKey: 'TEST_PROJECT_KEY',
        options: {
          enabled: true,
          provider: {
            name: 'algolia',
            apiKey: 'test',
            appId: 'test',
            indexName: 'test',
          },
        },
      }),
    );

    await result.current.submitSearchQuery('react');

    await waitFor(() => expect(submitAlgoliaDocsearchQuery).toHaveBeenCalled());
  });
});
