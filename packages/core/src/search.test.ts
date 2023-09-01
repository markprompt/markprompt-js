import { rest } from 'msw';
import { setupServer } from 'msw/node';
import type { PartialDeep } from 'type-fest/index.d.ts';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

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
      return res(ctx.status(status), ctx.body(JSON.stringify({ data })));
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
});

afterEach(() => {
  status = 200;
  server.resetHandlers();
});

describe('submitSearchQuery', () => {
  test('submitSearchQuery gives results', async () => {
    const result = await submitSearchQuery('react', 'testKey');
    expect(result?.data).toStrictEqual(searchResults);
  });

  test('submitSearchQuery with limit', async () => {
    const result = await submitSearchQuery('react', 'testKey', { limit: 2 });
    expect(result?.data).toStrictEqual(searchResults.slice(0, 2));
  });

  test('submitSearchQuery with Algolia provider', async () => {
    const result = await submitAlgoliaDocsearchQuery('react', {
      provider: algoliaProvider,
    });
    expect(result?.hits).toStrictEqual(algoliaSearchHits);
  });
});
