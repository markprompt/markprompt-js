import { rest, type RestRequest } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

import { DEFAULT_SUBMIT_CHAT_OPTIONS, submitChat } from './index.js';
import { STREAM_SEPARATOR } from './prompt.js';

const encoder = new TextEncoder();
let markpromptData = '';
let markpromptDebug = '';
let response: string[] = [];
let status = 200;
let request: RestRequest;
let stream: ReadableStream;

const server = setupServer(
  rest.post(DEFAULT_SUBMIT_CHAT_OPTIONS.apiUrl!, async (req, res, ctx) => {
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
      ctx.set('x-markprompt-debug-info', markpromptDebug),
      ctx.body(stream),
    );
  }),
);

describe('submitChat', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const consoleMock = vi.spyOn(console, 'debug').mockImplementation(() => {});

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterAll(() => {
    server.close();
    consoleMock.mockReset();
  });

  afterEach(() => {
    response = [];
    markpromptData = '';
    status = 200;
    server.resetHandlers();
  });

  test('require projectKey', async () => {
    await expect(() =>
      // @ts-expect-error We test a missing project key.
      submitChat([]),
    ).rejects.toThrowError('A projectKey is required');
  });

  test('don’t make requests if the prompt is empty', async () => {
    const onAnswerChunk = vi.fn();
    const onReferences = vi.fn();
    const onPromptId = vi.fn();
    const onError = vi.fn();

    await submitChat(
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

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
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

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
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

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk.mock.calls).toStrictEqual([
      [DEFAULT_SUBMIT_CHAT_OPTIONS.iDontKnowMessage],
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

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
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

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
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

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
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

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
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

  test('logs debug info', async () => {
    const onAnswerChunk = vi.fn();
    const onReferences = vi.fn();
    const onPromptId = vi.fn();
    const onError = vi.fn();

    markpromptDebug = encoder.encode(JSON.stringify('test')).toString();

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onPromptId,
      onError,
      {},
      true,
    );

    expect(request).toBeDefined();

    // eslint-disable-next-line no-console
    expect(consoleMock).toHaveBeenCalledWith(JSON.stringify('test', null, 2));
  });

  test('expect onError to be called when an error occurs', async () => {
    const onAnswerChunk = vi.fn();
    const onReferences = vi.fn();
    const onPromptId = vi.fn();
    const onError = vi.fn();

    const mockFetch = vi.spyOn(global, 'fetch').mockImplementation(() => {
      throw new Error('test');
    });

    try {
      response = [
        '["https://calculator.example"]',
        STREAM_SEPARATOR,
        'According to my calculator ',
        '1 + 2 = 3',
      ];

      await submitChat(
        [{ content: 'How much is 1+2?', role: 'user' }],
        'testKey',
        onAnswerChunk,
        onReferences,
        onPromptId,
        onError,
      );

      expect(request).toBeDefined();
      expect(onError).toHaveBeenCalledWith(new Error('test'));
    } finally {
      mockFetch.mockRestore();
    }
  });
});
