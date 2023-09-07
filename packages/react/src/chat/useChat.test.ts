import { DEFAULT_SUBMIT_CHAT_OPTIONS } from '@markprompt/core';
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let body: any;

const server = setupServer(
  rest.post(DEFAULT_SUBMIT_CHAT_OPTIONS.apiUrl!, async (_req, res, ctx) => {
    body = await _req.json();
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

  afterEach(() => {
    response = [];
    body = undefined;

    server.resetHandlers();
  });

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
    expect(result.current.promptId).toBe('');
    expect(result.current.messages).toEqual([]);
  });

  it('should add a new chat message when submitChat is called', async () => {
    const { result, waitFor } = renderHook(() =>
      useChat({ projectKey: 'test-key' }),
    );

    response = ['Hi! ', 'How are you?'];

    act(() => result.current.submitChat('Hello'));

    await waitFor(() =>
      expect(result.current.messages[0].answer).toBe('Hi! How are you?'),
    );
  });

  it('should update the state of the message as it streams', async () => {
    const { result, waitFor } = renderHook(() =>
      useChat({ projectKey: 'test-key' }),
    );

    response = ['Hi! ', 'How are you?'];

    act(() => result.current.submitChat('Hello'));

    await waitFor(() =>
      expect(result.current.messages[0].state).toBe('preload'),
    );

    await waitFor(() =>
      expect(result.current.messages[0].state).toBe('streaming-answer'),
    );

    await waitFor(() => expect(result.current.messages[0].state).toBe('done'));
  });

  it('should cancel the previous request when submitChat is called', async () => {
    const { result, waitFor } = renderHook(() =>
      useChat({ projectKey: 'test-key' }),
    );

    response = ['Hi! ', 'How are you?'];

    act(() => result.current.submitChat('Hello'));
    act(() => result.current.submitChat('Hello'));

    await waitFor(() => expect(result.current.messages.length).toBe(2));
    expect(result.current.messages[0].state).toBe('cancelled');
  });

  it('should convert messages to the proper shape for the API', async () => {
    const { result, waitFor } = renderHook(() =>
      useChat({ projectKey: 'test-key' }),
    );

    response = ['Hi! ', 'How are you?'];

    act(() => result.current.submitChat('Hello'));

    await waitFor(() =>
      expect(body?.messages).toEqual([
        {
          content: 'Hello',
          role: 'user',
        },
      ]),
    );
  });
});
