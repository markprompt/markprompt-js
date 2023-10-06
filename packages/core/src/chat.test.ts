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

import { submitChatGenerator, SubmitChatGenYield } from './chat.js';
import {
  DEFAULT_SUBMIT_CHAT_OPTIONS,
  FileSectionReference,
  isAbortError,
  submitChat,
} from './index.js';

const encoder = new TextEncoder();
let markpromptData: unknown = '';
let markpromptDebug = '';
let response: string[] = [];
let status = 200;
let request: RestRequest | undefined = undefined;
let requestBody: unknown = {};
const streaming = true;

const server = setupServer(
  rest.post(DEFAULT_SUBMIT_CHAT_OPTIONS.apiUrl!, async (req, res, ctx) => {
    request = req;
    requestBody = await req.json();
    const stream = new ReadableStream({
      start(controller) {
        for (const chunk of response) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller?.close();
      },
    });

    return res(
      ctx.status(status),
      ctx.set('Content-Type', streaming ? 'text/plain' : 'application/json'),
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

// eslint-disable-next-line @typescript-eslint/no-empty-function
const consoleMock = vi.spyOn(console, 'debug').mockImplementation(() => {});

const onAnswerChunk = vi.fn().mockReturnValue(true);
const onReferences = vi.fn();
const onPromptId = vi.fn();
const onConversationId = vi.fn();
const onError = vi.fn();

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  server.close();
  vi.restoreAllMocks();
});

afterEach(() => {
  response = [];
  request = undefined;
  requestBody = {};
  markpromptData = '';
  status = 200;
  server.resetHandlers();
  vi.resetAllMocks();
});

describe('submitChat', () => {
  test('require projectKey', async () => {
    await expect(() =>
      // @ts-expect-error We test a missing project key.
      submitChat([]),
    ).rejects.toThrowError('A projectKey is required');
  });

  test('don’t make requests if the prompt is empty', async () => {
    await submitChat(
      [],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
      onPromptId,
      onError,
    );

    expect(request).toBeUndefined();
    expect(onAnswerChunk).not.toHaveBeenCalled();
    expect(onReferences).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  test('endpoint is called with the default options if none are provided', async () => {
    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
      onPromptId,
      onError,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { apiUrl, ...rest } = DEFAULT_SUBMIT_CHAT_OPTIONS;

    expect(requestBody).toStrictEqual({
      messages: [{ content: 'How much is 1+2?', role: 'user' }],
      projectKey: 'testKey',
      ...rest,
    });
  });

  test('make a request', async () => {
    onAnswerChunk.mockReturnValue(true);

    response = ['According to my calculator ', '1 + 2 = 3'];

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
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
    status = 500;
    response = ['Internal Server Error'];

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
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
    onAnswerChunk.mockReturnValue(true);

    response = ['According to my calculator ', '1 + 2 = 3'];

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
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
    onAnswerChunk.mockReturnValue(false);

    response = ['According to my calculator ', '1 + 2 = 3'];

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
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
    const references = [
      {
        file: { path: '/page1', source: { type: 'file-upload' } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];

    markpromptData = { references };

    response = ['According to my calculator ', '1 + 2 = 3'];

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk).toHaveBeenCalled();
    expect(onReferences).toHaveBeenCalledWith(references);
    expect(onError).not.toHaveBeenCalled();
  });

  test('calls back user-provided onPromptId', async () => {
    const promptId = 'test-id';

    markpromptData = { promptId };

    response = ['According to my calculator ', '1 + 2 = 3'];

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk).toHaveBeenCalled();
    expect(onPromptId).toHaveBeenCalledWith(promptId);
    expect(onError).not.toHaveBeenCalled();
  });

  test('calls back user-provided onConversationId', async () => {
    const conversationId = 'test-id';

    markpromptData = { conversationId };

    response = ['According to my calculator ', '1 + 2 = 3'];

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
      onPromptId,
      onError,
    );

    expect(request).toBeDefined();
    expect(onAnswerChunk).toHaveBeenCalled();
    expect(onConversationId).toHaveBeenCalledWith(conversationId);
    expect(onError).not.toHaveBeenCalled();
  });

  test('logs debug info', async () => {
    const onAnswerChunk = vi.fn();
    const onReferences = vi.fn();
    const onPromptId = vi.fn();
    const onError = vi.fn();

    markpromptDebug = 'test';

    await submitChat(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      onAnswerChunk,
      onReferences,
      onConversationId,
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
    const mockFetch = vi.spyOn(global, 'fetch').mockImplementation(() => {
      throw new Error('test');
    });

    try {
      response = ['According to my calculator ', '1 + 2 = 3'];

      await submitChat(
        [{ content: 'How much is 1+2?', role: 'user' }],
        'testKey',
        onAnswerChunk,
        onConversationId,
        onReferences,
        onPromptId,
        onError,
      );

      expect(request).toBeUndefined();
      expect(onError).toHaveBeenCalledWith(new Error('test'));
    } finally {
      mockFetch.mockRestore();
    }
  });

  test('expect onError to be called when a non-error is thrown', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockImplementation(() => {
      throw 'test';
    });

    try {
      response = ['According to my calculator ', '1 + 2 = 3'];

      await submitChat(
        [{ content: 'How much is 1+2?', role: 'user' }],
        'testKey',
        onAnswerChunk,
        onConversationId,
        onReferences,
        onPromptId,
        onError,
      );

      expect(request).toBeUndefined();
      expect(onError).toHaveBeenCalledWith(new Error('test'));
    } finally {
      mockFetch.mockRestore();
    }
  });
});

describe('submitChatGenerator', () => {
  test('requires projectKey', async () => {
    await expect(async () => {
      // @ts-expect-error We test a missing project key.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const value of submitChatGenerator([])) {
        continue;
      }
    }).rejects.toThrowError('A projectKey is required');
  });

  test('doesn’t make requests if the prompt is empty', async () => {
    let value: SubmitChatGenYield | undefined = undefined;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (value of submitChatGenerator([], 'testKey')) {
      continue;
    }

    expect(request).toBeUndefined();
    expect(value).toBeUndefined();
  });

  test('calls endpoint with the default options if none are provided', async () => {
    let value: SubmitChatGenYield | undefined = undefined;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (value of submitChatGenerator(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
    )) {
      continue;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { apiUrl, ...rest } = DEFAULT_SUBMIT_CHAT_OPTIONS;

    expect(requestBody).toStrictEqual({
      messages: [{ content: 'How much is 1+2?', role: 'user' }],
      projectKey: 'testKey',
      ...rest,
    });
  });

  test('makes a request', async () => {
    response = ['According to my calculator ', '1 + 2 = 3'];

    let value: SubmitChatGenYield | undefined = undefined;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (value of submitChatGenerator(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
    )) {
      continue;
    }

    expect(request).toBeDefined();
  });

  test('handles error status codes', async () => {
    status = 500;
    response = ['Internal Server Error'];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let value: SubmitChatGenYield | undefined = undefined;

    await expect(async () => {
      for await (value of submitChatGenerator(
        [{ content: 'How much is 1+2?', role: 'user' }],
        'testKey',
      )) {
        continue;
      }
    }).rejects.toThrowError('Internal Server Error');
  });

  test('yields default metadata if none provided', async () => {
    response = ['According to my calculator ', '1 + 2 = 3'];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let value: SubmitChatGenYield | undefined = undefined;
    let references: FileSectionReference[] | undefined = undefined;
    let conversationId: string | undefined;
    let promptId: string | undefined;

    for await (value of submitChatGenerator(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
    )) {
      if (value?.references) {
        references = value.references;
      }
      if (value?.conversationId) {
        conversationId = value.conversationId;
      }
      if (value?.promptId) {
        promptId = value.promptId;
      }
    }

    expect(references).toStrictEqual([]);
    expect(conversationId).toBeUndefined();
    expect(promptId).toBeUndefined();
  });

  test('yields metadata', async () => {
    const conversationIdData = `test-conversation-id`;
    const promptIdData = `test-prompt-id`;
    const referencesData = [
      {
        file: { path: '/page1', source: { type: 'file-upload' } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];

    markpromptData = {
      conversationId: conversationIdData,
      promptId: promptIdData,
      references: referencesData,
    };

    response = ['According to my calculator ', '1 + 2 = 3'];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let value: SubmitChatGenYield | undefined = undefined;
    let references: FileSectionReference[] | undefined = undefined;
    let conversationId: string | undefined = undefined;
    let promptId: string | undefined = undefined;

    for await (value of submitChatGenerator(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
    )) {
      if (value?.conversationId) conversationId = value.conversationId;
      if (value?.promptId) promptId = value.promptId;
      if (value?.references) references = value.references;
    }

    expect(conversationId).toBe(conversationIdData);
    expect(promptId).toBe(promptIdData);
    expect(references).toStrictEqual(referencesData);
  });

  test('logs debug info', async () => {
    response = ['According to my calculator ', '1 + 2 = 3'];

    let value: SubmitChatGenYield | undefined = undefined;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (value of submitChatGenerator(
      [{ content: 'How much is 1+2?', role: 'user' }],
      'testKey',
      undefined,
      true,
    )) {
      continue;
    }

    // eslint-disable-next-line no-console
    expect(consoleMock).toHaveBeenCalledWith(JSON.stringify('test', null, 2));
  });

  test('throws when an error occurs', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockImplementation(() => {
      throw new Error('test');
    });

    response = ['According to my calculator ', '1 + 2 = 3'];

    try {
      await expect(async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const value of submitChatGenerator(
          [{ content: 'How much is 1+2?', role: 'user' }],
          'testKey',
        )) {
          continue;
        }
      }).rejects.toThrowError('test');
    } finally {
      mockFetch.mockRestore();
    }
  });

  test('allows aborting requests', async () => {
    const conversationIdData = `test-conversation-id`;
    const promptIdData = `test-prompt-id`;
    const referencesData = [
      {
        file: { path: '/page1', source: { type: 'file-upload' } },
        meta: { leadHeading: { value: 'Page 1' } },
      },
    ];

    markpromptData = {
      conversationId: conversationIdData,
      promptId: promptIdData,
      references: referencesData,
    };

    response = ['According to my calculator ', '1 + 2 = 3'];

    const abortController = new AbortController();

    try {
      const res = submitChatGenerator(
        [{ content: 'How much is 1+2?', role: 'user' }],
        'testKey',
        { signal: abortController.signal },
      );

      await res.next();
      abortController.abort();
      await res.next();
    } catch (error) {
      expect(error).toBeInstanceOf(DOMException);
      expect(isAbortError(error)).toBe(true);
    }
  });
});
