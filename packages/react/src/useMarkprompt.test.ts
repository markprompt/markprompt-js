import { MARKPROMPT_COMPLETIONS_URL, STREAM_SEPARATOR } from '@markprompt/core';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

import { useMarkprompt } from './useMarkprompt.js';

const encoder = new TextEncoder();
let response: string[] = [];
let status = 200;
let stream: ReadableStream;
const server = setupServer(
  rest.post(MARKPROMPT_COMPLETIONS_URL, async (req, res, ctx) => {
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
  status = 200;
  server.resetHandlers();
});

describe('useMarkprompt', () => {
  test('initial state', () => {
    const { result } = renderHook(() =>
      useMarkprompt({ projectKey: 'TEST_PROJECT_KEY' }),
    );

    expect(result.current).toStrictEqual({
      abort: expect.any(Function),
      activeSearchResult: undefined,
      answer: '',
      isSearchActive: false,
      isSearchEnabled: false,
      prompt: '',
      references: [],
      searchResults: [],
      state: 'indeterminate',
      submitPrompt: expect.any(Function),
      submitSearchQuery: expect.any(Function),
      updateActiveSearchResult: expect.any(Function),
      updatePrompt: expect.any(Function),
    });
  });

  test('submit', async () => {
    const { result } = renderHook(() =>
      useMarkprompt({ projectKey: 'TEST_PROJECT_KEY' }),
    );

    act(() => {
      result.current.updatePrompt('How much is 1+2?');
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
});
