import crypto from 'node:crypto';

import {
  http,
  delay,
  HttpResponse,
  type StrictRequest,
  type DefaultBodyType,
} from 'msw';
import { setupServer } from 'msw/node';
import type { OpenAI } from 'openai';
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
  DEFAULT_SUBMIT_CHAT_OPTIONS,
  isChatCompletion,
  isChatCompletionChunk,
  isChatCompletionMessage,
  isMarkpromptMetadata,
  isToolCall,
  isToolCalls,
  parseEncodedJSONHeader,
  submitChat,
  type SubmitChatOptions,
  type SubmitChatReturn,
  type SubmitChatYield,
} from './index.js';
import { formatEvent, getChunk } from '../../../../test/utils.js';
import { DEFAULT_OPTIONS } from '../constants.js';

describe('submitChat', () => {
  const encoder = new TextEncoder();
  let markpromptData: unknown = '';
  let response: string[] | string | object = [];
  let req: StrictRequest<DefaultBodyType>;
  let requestBody: SubmitChatOptions = {};
  let stream: ReadableStream;
  let malformattedJson = false;

  let status = 200;

  const server = setupServer(
    http.post(`${DEFAULT_OPTIONS.apiUrl}/chat`, async ({ request }) => {
      req = request;
      requestBody = (await request.json()) as SubmitChatOptions;

      if (status >= 400) {
        return HttpResponse.text(
          typeof response !== 'string' ? JSON.stringify(response) : response,
          { status: status },
        );
      }

      if (requestBody?.stream === false) {
        return HttpResponse.json(response, {
          status: status,
          headers: {
            'Content-Type': 'application/json',
            'x-markprompt-data': encoder
              .encode(JSON.stringify(markpromptData))
              .toString(),
          },
        });
      }

      stream = new ReadableStream({
        start(controller) {
          if (Array.isArray(response)) {
            let i = 0;
            for (const chunk of response as string[]) {
              controller.enqueue(
                encoder.encode(
                  formatEvent({
                    data: malformattedJson ? chunk : getChunk(chunk, i),
                  }),
                ),
              );
              i++;
            }
            controller.enqueue(encoder.encode(formatEvent({ data: '[DONE]' })));
          } else {
            controller.enqueue(encoder.encode(JSON.stringify(response)));
          }

          controller?.close();
        },
      });
      await delay('real');

      return new Response(stream, {
        status: status,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'x-markprompt-data': encoder
            .encode(JSON.stringify(markpromptData))
            .toString(),
        },
      });
    }),
    http.get(`${DEFAULT_OPTIONS.apiUrl}/chat/events`, async () => {
      if (status >= 400) {
        return HttpResponse.json(
          { error: 'Internal server error' },
          { status: status },
        );
      }

      stream = new ReadableStream({
        start(controller) {
          controller?.close();
        },
      });
      await delay('real');

      return new Response(stream, {
        status: status,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      });
    }),
  );

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterAll(() => {
    server.close();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    response = [];
    requestBody = {};
    markpromptData = '';
    status = 200;
    malformattedJson = false;
    server.resetHandlers();
    vi.resetAllMocks();
  });

  test('require projectKey', async () => {
    try {
      // @ts-expect-error We test a missing project key.
      for await (const _chunk of submitChat([])) {
        // do nothing
      }

      expect.fail('Expected an error to be thrown');
    } catch (error) {
      expect((error as Error).message).toBe('A projectKey is required.');
    }
  });

  test('don’t make requests if the prompt is empty', async () => {
    const chunks: unknown[] = [];
    for await (const chunk of submitChat([], 'test-key')) {
      chunks.push(chunk);
    }

    expect(chunks.length).toBe(0);
  });

  test('make a request', async () => {
    response = ['According to my calculator ', '1 + 2 = 3'];

    const chunks: SubmitChatYield[] = [];

    for await (const chunk of submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
    )) {
      chunks.push(chunk);
    }

    const lastChunk: SubmitChatReturn = chunks[
      chunks.length - 1
    ] as SubmitChatReturn;
    expect(req).toBeDefined();
    expect(lastChunk.content).toBe('According to my calculator 1 + 2 = 3');
  });

  test('endpoint is called with the default options if none are provided', async () => {
    for await (const _chunk of submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
    )) {
      // do nothing
    }

    const { ...rest } = { ...DEFAULT_SUBMIT_CHAT_OPTIONS, ...DEFAULT_OPTIONS };

    expect(requestBody).toStrictEqual({
      messages: [{ content: 'How much is 1+2?', role: 'user' }],
      projectKey: 'testKey',
      ...rest,
    });
  });

  test('ignore invalid or missing references', async () => {
    response = ['According to my calculator ', '1 + 2 = 3'];

    const chunks: SubmitChatYield[] = [];
    for await (const chunk of submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
    )) {
      chunks.push(chunk);
    }

    expect(chunks.every((x) => x.references === undefined)).toBe(true);
  });

  test('yields references', async () => {
    const references = [
      {
        file: { path: '/page1', source: { type: 'file-upload' } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];
    markpromptData = { references };
    response = ['According to my calculator ', '1 + 2 = 3'];

    const chunks: SubmitChatYield[] = [];
    for await (const chunk of submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
    )) {
      chunks.push(chunk);
    }

    const chunkWithReferences = chunks.find((x) => x.references);
    expect(chunkWithReferences?.references).toStrictEqual(references);
  });

  test('yields messageId', async () => {
    const messageId = 'test-id';

    markpromptData = { messageId };

    response = ['According to my calculator ', '1 + 2 = 3'];

    const chunks: SubmitChatYield[] = [];
    for await (const chunk of submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
    )) {
      // do nothing
      chunks.push(chunk);
    }

    const chunkWithMessageId = chunks.find((x) => x.messageId);
    expect(chunkWithMessageId?.messageId).toStrictEqual(messageId);
  });

  test('yields threadId', async () => {
    const threadId = 'test-id';

    markpromptData = { threadId };

    response = ['According to my calculator ', '1 + 2 = 3'];

    const chunks: SubmitChatYield[] = [];
    for await (const chunk of submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
    )) {
      chunks.push(chunk);
    }

    const chunkWithThreadId = chunks.find((x) => x.threadId);
    expect(chunkWithThreadId?.threadId).toStrictEqual(threadId);
  });

  test('throws errors when they occur', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockImplementation(() => {
      throw new Error('test');
    });

    try {
      for await (const _chunk of submitChat(
        [{ content: 'How much is 1+2?', role: 'user' }],
        'testKey',
      )) {
        // do nothing
      }

      expect.fail('Expected an error to be thrown');
    } catch (error) {
      expect((error as Error).message).toBe('test');
    } finally {
      mockFetch.mockRestore();
    }
  });

  test('throws on error status code', async () => {
    status = 500;
    response = 'Internal Server Error';

    try {
      for await (const _chunk of submitChat(
        [{ content: 'How much is 1+2?', role: 'user' }],
        'testKey',
      )) {
        // do nothing
      }

      expect.fail('Expected an error to be thrown');
    } catch (error) {
      expect((error as Error).message).toBe('Internal Server Error');
    }
  });

  test('throws when malformatted json is provided', async () => {
    const threadId = 'test-id';

    markpromptData = { threadId };

    response = ['{ "foo": "bar" }'];

    const chunks: SubmitChatYield[] = [];
    try {
      for await (const chunk of submitChat(
        [{ content: 'How much is 1+2?', role: 'user' }],
        'testKey',
      )) {
        chunks.push(chunk);
      }
    } catch (error) {
      expect((error as Error).message).toBe(
        'Malformed response from Markprompt API',
      );
    }
  });

  test('supports non-streaming mode', async () => {
    response = {
      object: 'chat.completion',
      id: crypto.randomUUID(),
      created: Date.now(),
      model: 'gpt-3.5-turbo',
      choices: [
        {
          index: 0,
          finish_reason: 'stop',
          message: {
            content: 'According to my calculator 1 + 2 = 3',
            role: 'assistant',
          },
          logprobs: null,
        },
      ],
    } satisfies OpenAI.ChatCompletion;

    const threadId = 'test-id';
    const messageId = 'test-id';
    const references = [
      {
        file: { path: '/page1', source: { type: 'file-upload' } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];

    markpromptData = { threadId, messageId, references };

    for await (const json of submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      { stream: false },
    )) {
      expect(json).toStrictEqual({
        content: 'According to my calculator 1 + 2 = 3',
        role: 'assistant',
        messageId,
        threadId,
        references,
      });
    }
  });

  test('non-streaming mode throws when response contains faulty data', async () => {
    response = {
      foo: 'bar',
    };

    try {
      for await (const _json of submitChat(
        [{ content: 'How much is 1+2?', role: 'user' }],
        'testKey',
        { stream: false },
      )) {
        // nothing
      }
    } catch (error) {
      expect((error as Error).message).toBe(
        'Malformed response from Markprompt API',
      );
    }
  });
});

describe('parseEncodedJSONHeader', () => {
  const encoder = new TextEncoder();
  const unencodedObject = { data: 'Some text' };
  const encodedObject = encoder
    .encode(JSON.stringify(unencodedObject))
    .toString();
  const unencodedText = 'Some text';
  const encodedText = encoder.encode(unencodedText).toString();

  test('parses and returns the decoded JSON value from the header', () => {
    const mockResponse = new Response(null, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Encoded-Data': encodedObject,
      },
    });

    const parsedValue = parseEncodedJSONHeader(mockResponse, 'X-Encoded-Data');

    expect(parsedValue).toEqual(unencodedObject);
  });

  test('returns undefined if the header is missing or decoding fails', () => {
    const mockResponse = new Response(null, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    const parsedValue = parseEncodedJSONHeader(mockResponse, 'X-Encoded-Data');

    expect(parsedValue).toBeUndefined();
  });

  test('returns undefined if the header is not a JSON object', () => {
    const mockResponse = new Response(null, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Encoded-Data': encodedText,
      },
    });

    const parsedValue = parseEncodedJSONHeader(mockResponse, 'X-Encoded-Data');

    expect(parsedValue).toBeUndefined();
  });
});

describe('isMarkpromptMetadata', () => {
  test('identifies ChatCompletionMetadata types', () => {
    expect(
      isMarkpromptMetadata({
        threadId: 'test',
        messageId: 'test',
        references: [{ file: { path: 'test', source: { type: 'website' } } }],
      }),
    ).toBeTruthy();

    expect(
      isMarkpromptMetadata({
        foo: 'bar',
      }),
    ).toBeFalsy();
  });
});

describe('isChatCompletion', () => {
  test('identifies ChatCompletionMessage types', () => {
    expect(
      isChatCompletion({
        object: 'chat.completion',
      }),
    ).toBeTruthy();

    expect(
      isChatCompletion({
        foo: 'bar',
      }),
    ).toBeFalsy();
  });
});

describe('isToolCall(s)', () => {
  test('identifies ChatCompletionMessageToolCall types', () => {
    expect(
      isToolCall({
        id: 'test',
        type: 'function',
        function: {},
      }),
    ).toBeTruthy();

    expect(
      isToolCall({
        foo: 'bar',
      }),
    ).toBeFalsy();

    expect(
      isToolCalls([
        {
          id: 'test',
          type: 'function',
          function: {},
        },
      ]),
    ).toBeTruthy();

    expect(
      isToolCalls([
        {
          foo: 'bar',
        },
      ]),
    ).toBeFalsy();
  });
});

describe('isChatCompletionChunk', () => {
  test('identifies ChatCompletionChunk types', () => {
    expect(
      isChatCompletionChunk({
        object: 'chat.completion.chunk',
      }),
    ).toBeTruthy();

    expect(
      isChatCompletionChunk({
        foo: 'bar',
      }),
    ).toBeFalsy();
  });
});

describe('isChatCompletionMessage', () => {
  test('identifies ChatCompletionMessage types', () => {
    expect(
      isChatCompletionMessage({
        content: 'test',
        role: 'assistant',
      }),
    ).toBeTruthy();

    expect(
      isChatCompletionMessage({
        content: null,
        role: 'assistant',
      }),
    ).toBeTruthy();

    expect(
      isChatCompletionMessage({
        foo: 'bar',
      }),
    ).toBeFalsy();
  });
});
