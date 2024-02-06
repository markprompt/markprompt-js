import crypto from 'node:crypto';

import { rest, type RestRequest } from 'msw';
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
  submitChat,
  SubmitChatOptions,
  SubmitChatReturn,
  SubmitChatYield,
} from './index.js';
import { formatEvent, getChunk } from '../../../test/utils.js';

describe('submitChat', () => {
  const encoder = new TextEncoder();
  let markpromptData: unknown = '';
  const markpromptDebug = '';
  let response: string[] | string | object = [];
  let request: RestRequest;
  let requestBody: SubmitChatOptions = {};
  let stream: ReadableStream;
  let malformattedJson = false;

  let status = 200;

  const server = setupServer(
    rest.post(DEFAULT_SUBMIT_CHAT_OPTIONS.apiUrl!, async (req, res, ctx) => {
      request = req;
      requestBody = await req.json();

      if (status >= 400) {
        return res(
          ctx.status(status),
          ctx.text(
            typeof response !== 'string' ? JSON.stringify(response) : response,
          ),
        );
      }

      if (requestBody?.stream === false) {
        return res(
          ctx.status(status),
          ctx.set('Content-Type', 'application/json'),
          ctx.set(
            'x-markprompt-data',
            encoder.encode(JSON.stringify(markpromptData)).toString(),
          ),
          ctx.set(
            'x-markprompt-debug-info',
            encoder.encode(JSON.stringify(markpromptDebug)).toString(),
          ),
          ctx.json(response),
        );
      }

      stream = new ReadableStream({
        start(controller) {
          if (Array.isArray(response)) {
            let i = 0;
            for (const chunk of response) {
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

      return res(
        ctx.delay('real'),
        ctx.status(status),
        ctx.set(
          'x-markprompt-data',
          encoder.encode(JSON.stringify(markpromptData)).toString(),
        ),
        ctx.set(
          'x-markprompt-debug-info',
          encoder.encode(JSON.stringify(markpromptDebug)).toString(),
        ),
        ctx.body(stream),
      );
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
      expect(error.message).toBe('A projectKey is required.');
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

    const chunks: unknown[] = [];

    for await (const chunk of submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
    )) {
      chunks.push(chunk);
    }

    const lastChunk: SubmitChatReturn = chunks[chunks.length - 1];
    expect(request).toBeDefined();
    expect(lastChunk.content).toBe('According to my calculator 1 + 2 = 3');
  });

  test('endpoint is called with the default options if none are provided', async () => {
    for await (const _chunk of submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
    )) {
      // do nothing
    }

    const { apiUrl: _apiUrl, ...rest } = DEFAULT_SUBMIT_CHAT_OPTIONS;

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
    expect(chunkWithReferences.references).toStrictEqual(references);
  });

  test('yields promptId', async () => {
    const promptId = 'test-id';

    markpromptData = { promptId };

    response = ['According to my calculator ', '1 + 2 = 3'];

    const chunks: SubmitChatYield[] = [];
    for await (const chunk of submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
    )) {
      // do nothing
      chunks.push(chunk);
    }

    const chunkWithPromptId = chunks.find((x) => x.promptId);
    expect(chunkWithPromptId.promptId).toStrictEqual(promptId);
  });

  test('yields conversationId', async () => {
    const conversationId = 'test-id';

    markpromptData = { conversationId };

    response = ['According to my calculator ', '1 + 2 = 3'];

    const chunks: SubmitChatYield[] = [];
    for await (const chunk of submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
    )) {
      chunks.push(chunk);
    }

    const chunkWithConversationId = chunks.find((x) => x.conversationId);
    expect(chunkWithConversationId.conversationId).toStrictEqual(
      conversationId,
    );
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
      expect(error.message).toBe('test');
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
      expect(error.message).toBe('Internal Server Error');
    }
  });

  test('throws when malformatted json is provided', async () => {
    const conversationId = 'test-id';

    markpromptData = { conversationId };

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
      expect(error.message).toBe('Malformed response from Markprompt API');
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

    const conversationId = 'test-id';
    const promptId = 'test-id';
    const references = [
      {
        file: { path: '/page1', source: { type: 'file-upload' } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];

    markpromptData = { conversationId, promptId, references };

    for await (const json of submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      { stream: false },
    )) {
      await expect(json).toStrictEqual({
        content: 'According to my calculator 1 + 2 = 3',
        role: 'assistant',
        promptId,
        conversationId,
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
      expect(error.message).toBe('Malformed response from Markprompt API');
    }
  });
});
