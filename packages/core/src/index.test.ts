import { type RestRequest, rest } from 'msw';
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

import { submitPrompt } from './index.js';
import { DEFAULT_SUBMIT_PROMPT_OPTIONS, STREAM_SEPARATOR } from './prompt.js';

const encoder = new TextEncoder();
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

describe('submitPrompt', () => {
  test('require projectKey', async () => {
    // @ts-expect-error We test a missing project key.
    await expect(() => submitPrompt('Explain to me…')).rejects.toThrowError(
      'A projectKey is required',
    );
  });

  test('don’t make requests if the prompt is empty', async () => {
    const onAnswerChunk = vi.fn();
    const onReferences = vi.fn();
    const onError = vi.fn();

    await submitPrompt('', 'testKey', onAnswerChunk, onReferences, onError);

    expect(request).toBeUndefined();
    expect(onAnswerChunk).not.toHaveBeenCalled();
    expect(onReferences).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test('make a request', async () => {
    const onAnswerChunk = vi.fn().mockReturnValue(true);
    const onReferences = vi.fn();
    const onError = vi.fn();

    response = [
      '["https://calculator.example"]',
      STREAM_SEPARATOR,
      'According to my calculator ',
      '1 + 2 = 3',
    ];

    await submitPrompt(
      'How much is 1+2?',
      'testKey',
      onAnswerChunk,
      onReferences,
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
    const onError = vi.fn();

    response = [
      '["https://calculator.example"]' +
        STREAM_SEPARATOR +
        'According to my calculator ',
      '1 + 2 = 3',
    ];

    await submitPrompt(
      'How much is 1+2?',
      'testKey',
      onAnswerChunk,
      onReferences,
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
    const onError = vi.fn();

    status = 500;
    response = ['Internal Server Error'];

    await submitPrompt(
      'How much is 1+2?',
      'testKey',
      onAnswerChunk,
      onReferences,
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
    const onError = vi.fn();

    response = [
      'This is invalid JSON',
      STREAM_SEPARATOR,
      'According to my calculator ',
      '1 + 2 = 3',
    ];

    await submitPrompt(
      'How much is 1+2?',
      'testKey',
      onAnswerChunk,
      onReferences,
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
    const onError = vi.fn();

    response = [
      'This is invalid JSON',
      STREAM_SEPARATOR,
      'According to my calculator ',
      '1 + 2 = 3',
    ];

    await submitPrompt(
      'How much is 1+2?',
      'testKey',
      onAnswerChunk,
      onReferences,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk.mock.calls).toStrictEqual([
      ['According to my calculator '],
    ]);
    expect(onReferences).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});
