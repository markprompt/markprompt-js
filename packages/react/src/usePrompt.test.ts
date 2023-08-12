import {
  DEFAULT_SUBMIT_PROMPT_OPTIONS,
  STREAM_SEPARATOR,
} from '@markprompt/core';
import { waitFor } from '@testing-library/react';
import {
  act,
  renderHook,
  suppressErrorOutput,
  cleanup,
} from '@testing-library/react-hooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { UsePromptResult, usePrompt } from './usePrompt';

const encoder = new TextEncoder();
let response: string[] = [];
let status = 200;
let stream: ReadableStream;

const server = setupServer(
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
  status = 200;
  server.resetHandlers();
  cleanup();
});

describe('usePrompt', () => {
  it('should return a default state', () => {
    const { result } = renderHook(() =>
      usePrompt({
        projectKey: 'TEST_PROJECT_KEY',
      }),
    );

    expect(result.current).toStrictEqual({
      abort: expect.any(Function),
      answer: '',
      prompt: '',
      references: [],
      state: 'indeterminate',
      setPrompt: expect.any(Function),
      submitFeedback: expect.any(Function),
      abortFeedbackRequest: expect.any(Function),
      submitPrompt: expect.any(Function),
    } satisfies UsePromptResult);
  });

  it('should submit prompts', async () => {
    const { result } = renderHook(() =>
      usePrompt({ projectKey: 'TEST_PROJECT_KEY' }),
    );

    act(() => result.current.setPrompt('How much is 1+2?'));

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

  it('should throw when instantiated without projectKey', async () => {
    const restoreConsole = suppressErrorOutput();

    try {
      const { result } = renderHook(() => usePrompt({ projectKey: '' }));
      expect(result.error).toBeInstanceOf(Error);
    } finally {
      restoreConsole();
    }
  });

  it('should not do requests when submitting without prompt', async () => {
    const { result } = renderHook(() =>
      usePrompt({ projectKey: 'TEST_PROJECT_KEY' }),
    );

    await result.current.submitPrompt();

    expect(result.current.answer).toBe('');
    expect(result.current.state).toBe('indeterminate');
  });

  it('should not throw when aborted', async () => {
    const { result } = renderHook(() =>
      usePrompt({ projectKey: 'TEST_PROJECT_KEY' }),
    );

    act(() => result.current.setPrompt('How much is 1+2?'));
    result.current.submitPrompt();
    result.current.abort();

    expect(result.error).toBeUndefined();
  });
});
