import {
  DEFAULT_SUBMIT_CHAT_OPTIONS,
  STREAM_SEPARATOR,
} from '@markprompt/core';
import {
  act,
  renderHook,
  suppressErrorOutput,
} from '@testing-library/react-hooks';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { useChat } from './useChat';

const encoder = new TextEncoder();
let response: string[] = [];
const status = 200;
let stream: ReadableStream;

const server = setupServer(
  rest.post(DEFAULT_SUBMIT_CHAT_OPTIONS.apiUrl!, async (_req, res, ctx) => {
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

describe('useChat', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  afterEach(() => server.resetHandlers());

  afterAll(() => {
    server.close();
  });

  it('should throw an error when the project key is missing', () => {
    const restoreConsole = suppressErrorOutput();

    try {
      // @ts-expect-error - projectKey is missing
      const { result } = renderHook(() => useChat({}));
      expect(result.error).toBeDefined();
      expect(result.error).toBeInstanceOf(Error);
    } finally {
      restoreConsole();
    }
  });

  it('should initialize with promptId as an empty string and messages as an empty array', () => {
    const { result } = renderHook(() => useChat({ projectKey: 'test-key' }));
    expect(result.current.promptId).toEqual('');
    expect(result.current.messages).toEqual([]);
  });

  it('should add a new chat message when submitChat is called', async () => {
    const { result, waitFor } = renderHook(() =>
      useChat({ projectKey: 'test-key' }),
    );

    response = ['[]', STREAM_SEPARATOR, 'Hi! ', 'How are you?'];

    act(() => result.current.submitChat('Hello'));

    await waitFor(() => {
      expect(result.current.messages.length).toBe(1);
      expect(result.current.messages[0].answer).toBe('Hi! How are you?');
    });
  });
});
