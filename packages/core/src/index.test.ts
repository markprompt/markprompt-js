import { type RestRequest, rest } from 'msw';
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
  submitPrompt,
  type SearchResult,
  submitSearchQuery,
  type AlgoliaDocSearchHit,
  submitAlgoliaDocsearchQuery,
  submitFeedback,
  DEFAULT_SUBMIT_FEEDBACK_OPTIONS,
} from './index.js';
import { DEFAULT_SUBMIT_PROMPT_OPTIONS, STREAM_SEPARATOR } from './prompt.js';
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

const encoder = new TextEncoder();
let markpromptData = '';
let response: string[] = [];
let status = 200;
let request: RestRequest;
let stream: ReadableStream;

const server = setupServer(
  rest.post(DEFAULT_SUBMIT_PROMPT_OPTIONS.apiUrl!, async (req, res, ctx) => {
    request = req;
    stream = new ReadableStream({
      start(controller) {
        for (const chunk of response) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller?.close();
      },
    });

    return res(
      ctx.status(status),
      ctx.set('x-markprompt-data', markpromptData),
      ctx.body(stream),
    );
  }),
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
  rest.post(DEFAULT_SUBMIT_FEEDBACK_OPTIONS.apiUrl, async (req, res, ctx) => {
    return res(ctx.status(status), ctx.body(JSON.stringify({ status: 'ok' })));
  }),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  response = [];
  markpromptData = '';
  status = 200;
  server.resetHandlers();
});

describe('submitPrompt', () => {
  test('require projectKey', async () => {
    await expect(() =>
      // @ts-expect-error We test a missing project key.
      submitPrompt('Explain to me…'),
    ).rejects.toThrowError('A projectKey is required');
  });

  test('don’t make requests if the prompt is empty', async () => {
    const onAnswerChunk = vi.fn();
    const onReferences = vi.fn();
    const onPromptId = vi.fn();
    const onError = vi.fn();

    await submitPrompt(
      [],
      'testKey',
      onAnswerChunk,
      onReferences,
      onPromptId,
      onError,
    );

    expect(request).toBeUndefined();
    expect(onAnswerChunk).not.toHaveBeenCalled();
    expect(onReferences).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test('make a request', async () => {
    const onAnswerChunk = vi.fn().mockReturnValue(true);
    const onReferences = vi.fn();
    const onPromptId = vi.fn();
    const onError = vi.fn();

    response = [
      '["https://calculator.example"]',
      STREAM_SEPARATOR,
      'According to my calculator ',
      '1 + 2 = 3',
    ];

    await submitPrompt(
      [{ message: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk.mock.calls).toStrictEqual([
      ['According to my calculator '],
      ['1 + 2 = 3'],
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  test('parse a chunk compound of the stream separator', async () => {
    const onAnswerChunk = vi.fn().mockReturnValue(true);
    const onReferences = vi.fn();
    const onPromptId = vi.fn();
    const onError = vi.fn();

    response = [
      '["https://calculator.example"]' +
        STREAM_SEPARATOR +
        'According to my calculator ',
      '1 + 2 = 3',
    ];

    await submitPrompt(
      [{ message: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk.mock.calls).toStrictEqual([
      ['According to my calculator '],
      ['1 + 2 = 3'],
    ]);
    expect(onError).not.toHaveBeenCalled();
  });

  test('handle error status code', async () => {
    const onAnswerChunk = vi.fn();
    const onReferences = vi.fn();
    const onPromptId = vi.fn();
    const onError = vi.fn();

    status = 500;
    response = ['Internal Server Error'];

    await submitPrompt(
      [{ message: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk.mock.calls).toStrictEqual([
      [DEFAULT_SUBMIT_PROMPT_OPTIONS.iDontKnowMessage],
    ]);
    expect(onReferences).not.toHaveBeenCalled();
    expect(onError.mock.calls).toStrictEqual([
      [new Error('Internal Server Error')],
    ]);
  });

  test('ignore invalid references', async () => {
    const onAnswerChunk = vi.fn().mockReturnValue(true);
    const onReferences = vi.fn();
    const onPromptId = vi.fn();
    const onError = vi.fn();

    response = [
      'This is invalid JSON',
      STREAM_SEPARATOR,
      'According to my calculator ',
      '1 + 2 = 3',
    ];

    await submitPrompt(
      [{ message: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk.mock.calls).toStrictEqual([
      ['According to my calculator '],
      ['1 + 2 = 3'],
    ]);
    expect(onReferences).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test('stop if onAnswerChunk returns false', async () => {
    const onAnswerChunk = vi.fn().mockReturnValue(false);
    const onReferences = vi.fn();
    const onPromptId = vi.fn();
    const onError = vi.fn();

    response = [
      'This is invalid JSON',
      STREAM_SEPARATOR,
      'According to my calculator ',
      '1 + 2 = 3',
    ];

    await submitPrompt(
      [{ message: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk.mock.calls).toStrictEqual([
      ['According to my calculator '],
    ]);
    expect(onReferences).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test('calls back user-provided onReferences', async () => {
    const onAnswerChunk = vi.fn();
    const onReferences = vi.fn();
    const onPromptId = vi.fn();
    const onError = vi.fn();

    const references = [
      {
        file: { path: '/page1', source: { type: 'file-upload' } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];

    const encoder = new TextEncoder();

    markpromptData = encoder.encode(JSON.stringify({ references })).toString();

    response = [
      '["https://calculator.example"]',
      STREAM_SEPARATOR,
      'According to my calculator ',
      '1 + 2 = 3',
    ];

    await submitPrompt(
      [{ message: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk).toHaveBeenCalled();
    expect(onReferences).toHaveBeenCalledWith(references);
    expect(onError).not.toHaveBeenCalled();
  });
});

test('calls back user-provided onPromptId', async () => {
  const onAnswerChunk = vi.fn();
  const onReferences = vi.fn();
  const onPromptId = vi.fn();
  const onError = vi.fn();

  const promptId = 'test-id';

  const encoder = new TextEncoder();

  markpromptData = encoder.encode(JSON.stringify({ promptId })).toString();

  response = [
    '["https://calculator.example"]',
    STREAM_SEPARATOR,
    'According to my calculator ',
    '1 + 2 = 3',
  ];

  await submitPrompt(
    [{ message: 'How much is 1+2?', role: 'user' }],
    'testKey',
    onAnswerChunk,
    onReferences,
    onPromptId,
    onError,
  );

  expect(request).toBeDefined();
  expect(onAnswerChunk).toHaveBeenCalled();
  expect(onPromptId).toHaveBeenCalledWith(promptId);
  expect(onError).not.toHaveBeenCalled();
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

describe('submitFeedback', () => {
  test('require projectKey', async () => {
    // @ts-expect-error We test a missing project key.
    await expect(() => submitFeedback()).rejects.toThrowError(
      'A projectKey is required',
    );
  });

  test('makes a request', async () => {
    const response = await submitFeedback(
      'testKey',
      {
        feedback: { vote: '1' },
        promptId: 'test-id',
        messageIndex: 1,
      },
      { apiUrl: DEFAULT_SUBMIT_FEEDBACK_OPTIONS.apiUrl },
    );

    expect(response).toStrictEqual({ status: 'ok' });
  });
});
