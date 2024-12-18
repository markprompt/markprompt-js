import { DEFAULT_OPTIONS } from '@markprompt/core/constants';
import type {
  SearchResult,
  AlgoliaDocSearchHit,
} from '@markprompt/core/search';
import { waitFor, renderHook, act } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  describe,
  expect,
  it,
  afterAll,
  afterEach,
  beforeAll,
  vi,
  test,
} from 'vitest';

import { type UseSearchResult, useSearch } from './useSearch.js';

let searchResults: SearchResult[] | AlgoliaDocSearchHit[] = [];
let status = 200;

const server = setupServer(
  http.get(`${DEFAULT_OPTIONS.apiUrl}/search`, () => {
    return HttpResponse.json(
      { data: searchResults },
      {
        status: status,
      },
    );
  }),
  http.post('https://test-dsn.algolia.net/1/indexes/test/query', () => {
    return HttpResponse.json(
      { data: searchResults },
      {
        status: status,
      },
    );
  }),
);

describe('useSearch', () => {
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
    vi.resetAllMocks();
  });

  it('should return a default state', () => {
    const { result } = renderHook(() =>
      useSearch({
        projectKey: 'TEST_PROJECT_KEY',
      }),
    );

    expect(result.current).toStrictEqual({
      state: 'indeterminate',
      searchResults: [],
      searchQuery: '',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      setSearchQuery: expect.any(Function),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      submitSearchQuery: expect.any(Function),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      abort: expect.any(Function),
    } satisfies UseSearchResult);
  });

  it('should return a state with search results', async () => {
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

    const { result } = renderHook(() =>
      useSearch({
        projectKey: 'TEST_PROJECT_KEY',
      }),
    );

    await result.current.submitSearchQuery('react');
    await waitFor(() => expect(result.current.searchResults.length).toBe(3));

    expect(result.current.searchResults[0]?.href).toBe(
      searchResults[0]?.file.path,
    );
    expect(result.current.searchResults[0]?.title).toBe(
      searchResults[0]?.file.title,
    );
    expect(result.current.searchResults[1]?.title).toBe(
      searchResults[1]?.meta?.leadHeading?.value,
    );
    expect(result.current.searchResults[2]?.title).toBe(
      searchResults[2]?.snippet,
    );
  });

  test.skip('should allow Algolia as a search provider', async () => {
    searchResults = [
      {
        url: 'https://markprompt.com/docs/hit',
        hierarchy: {
          lvl0: 'React',
          lvl1: 'React introduction',
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null,
          lvl6: null,
        },
        _highlightResult: {
          hierarchy: {
            lvl0: {
              value: 'React',
              matchLevel: 'full',
              matchedWords: ['react'],
            },
            lvl1: {
              value: 'React introduction',
              matchLevel: 'partial',
              matchedWords: ['react'],
            },
          },
        },
      },
    ] as AlgoliaDocSearchHit[];

    const { result } = renderHook(() =>
      useSearch({
        projectKey: 'TEST_PROJECT_KEY',
        searchOptions: {
          provider: {
            name: 'algolia',
            apiKey: 'test',
            appId: 'test',
            indexName: 'test',
          },
        },
      }),
    );

    await act(() => result.current.submitSearchQuery('react'));
    await waitFor(() => expect(result.current.searchResults.length).toBe(1));
  });
});
