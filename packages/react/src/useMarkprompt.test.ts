import {
  DEFAULT_SUBMIT_PROMPT_OPTIONS,
  DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS,
  STREAM_SEPARATOR,
  SearchResult,
} from '@markprompt/core';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

import { useMarkprompt } from './useMarkprompt.js';

const encoder = new TextEncoder();
let response: string[] = [];
let searchResults: SearchResult[] = [];
let status = 200;
let stream: ReadableStream;
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
  rest.post(DEFAULT_SUBMIT_PROMPT_OPTIONS.apiUrl!, async (_req, res, ctx) => {
    stream = new ReadableStream({
      start(controller) {
        for (const chunk of response) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller?.close();
      },
    });
    return res(ctx.status(status), ctx.body(stream));
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
  searchResults = [];
  status = 200;
  server.resetHandlers();
});

describe('useMarkprompt', () => {
  test('initial state', () => {
    const { result } = renderHook(() =>
      useMarkprompt({
        projectKey: 'TEST_PROJECT_KEY',
      }),
    );

    expect(result.current).toStrictEqual({
      abort: expect.any(Function),
      activeView: 'prompt',
      answer: '',
      isSearchEnabled: false,
      searchProvider: undefined,
      prompt: '',
      references: [],
      searchQuery: '',
      searchResults: [],
      state: 'indeterminate',
      setActiveView: expect.any(Function),
      setPrompt: expect.any(Function),
      setSearchQuery: expect.any(Function),
      submitFeedback: expect.any(Function),
      submitPrompt: expect.any(Function),
      submitSearchQuery: expect.any(Function),
    });
  });

  test('submitPrompt', async () => {
    const { result } = renderHook(() =>
      useMarkprompt({ projectKey: 'TEST_PROJECT_KEY' }),
    );

    act(() => {
      result.current.setPrompt('How much is 1+2?');
    });

    response = [
      '["https://calculator.example"]',
      STREAM_SEPARATOR,
      'According to my calculator ',
      '1 + 2 = 3',
    ];
    await result.current.submitPrompt();
    await waitFor(() =>
      expect(result.current.answer).toBe(
        'According to my calculator 1 + 2 = 3',
      ),
    );
  });

  test('submitSearchQuery', async () => {
    const { result } = renderHook(() =>
      useMarkprompt({
        projectKey: 'TEST_PROJECT_KEY',
        searchOptions: { enabled: true },
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
});
