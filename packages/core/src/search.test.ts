import { rest } from 'msw';
import { setupServer } from 'msw/node';
import type { PartialDeep } from 'type-fest/index.d.ts';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

import {
  DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
  submitAlgoliaDocsearchQuery,
  submitSearchQuery,
  type AlgoliaDocSearchHit,
  type SearchResult,
} from './index.js';
import type { AlgoliaProvider } from './search.js';

const searchResults: SearchResult[] = [
  {
    matchType: 'title',
    file: {
      title: 'Home page',
      path: '/',
      source: { type: 'file-upload' },
    },
  },
  {
    matchType: 'leadHeading',
    file: { path: '/page1', source: { type: 'file-upload' } },
    meta: { leadHeading: { value: 'Page 1' } },
  },
  {
    matchType: 'content',
    snippet: 'Page 2 snippet',
    file: { path: '/page2', source: { type: 'file-upload' } },
  },
];

const algoliaSearchHits: PartialDeep<AlgoliaDocSearchHit>[] = [
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
];

const algoliaProvider: AlgoliaProvider = {
  name: 'algolia',
  apiKey: 'algolia-test-api-key',
  appId: 'algolia-test-app-id',
  indexName: 'algolia-test-index-name',
};

let status = 200;
const wait = 0;

const server = setupServer(
  rest.get(
    DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.apiUrl!,
    async (req, res, ctx) => {
      const url = new URL(req.url);
      const searchParams = new URLSearchParams(url.search);
      const limit = searchParams.get('limit');
      let data = searchResults;
      if (limit !== null) {
        data = searchResults.slice(0, parseInt(limit));
      }
      if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait));
      }
      return res(
        ctx.status(status),
        ctx.body(
          status === 200
            ? JSON.stringify({ data })
            : JSON.stringify({ error: 'Internal Server Error' }),
        ),
      );
    },
  ),
  rest.post(
    `https://${algoliaProvider.appId}-dsn.algolia.net/1/indexes/${algoliaProvider.indexName}/query`,
    async (req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.body(JSON.stringify({ hits: algoliaSearchHits })),
      );
    },
  ),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  server.close();
  vi.restoreAllMocks();
});

afterEach(() => {
  status = 200;
  vi.resetAllMocks();
  server.resetHandlers();
});

describe('submitSearchQuery', () => {
  test('gives results', async () => {
    const result = await submitSearchQuery('react', 'testKey');
    expect(result?.data).toStrictEqual(searchResults);
  });

  test('gives results equal to limit', async () => {
    const result = await submitSearchQuery('react', 'testKey', { limit: 2 });
    expect(result?.data).toStrictEqual(searchResults.slice(0, 2));
  });

  test('throws an error on invalid status code', async () => {
    status = 500;

    try {
      await submitSearchQuery('react', 'testKey');
    } catch (error) {
      expect((error as Error).message).toBe(
        'Failed to fetch search results: Internal Server Error',
      );
    }
  });

  test('throws when an error occurs', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockImplementation(() => {
      throw new Error('test');
    });

    try {
      await expect(submitSearchQuery('react', 'testKey')).rejects.toStrictEqual(
        new Error('test'),
      );
    } finally {
      mockFetch.mockRestore();
    }
  });
});

describe('submitAlgoliaDocsearchQuery', () => {
  test('gives results', async () => {
    const result = await submitAlgoliaDocsearchQuery('react', {
      provider: algoliaProvider,
    });
    expect(result?.hits).toStrictEqual(algoliaSearchHits);
  });

  test('throws with unknown provider', async () => {
    await expect(
      submitAlgoliaDocsearchQuery('react', {
        // @ts-expect-error - provider is not a valid provider
        provider: { name: 'test' },
      }),
    ).rejects.toStrictEqual(new Error(`Unknown provider: test`));
  });
});
