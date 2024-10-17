import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';

import { DEFAULT_OPTIONS } from './constants.js';
import { submitFeedback } from './feedback.js';

let status = 200;

const TEST_MESSAGE_ID = 'test-id';

const server = setupServer(
  http.post(`${DEFAULT_OPTIONS.apiUrl}/messages/${TEST_MESSAGE_ID}`, () => {
    return HttpResponse.json(
      status === 200 ? { status: 'ok' } : { error: 'Internal Server Error' },
      { status: status },
    );
  }),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  status = 200;
  server.resetHandlers();
});

describe('submitFeedback', () => {
  test('requires a projectKey', async () => {
    // @ts-expect-error We test a missing project key.
    await expect(() => submitFeedback()).rejects.toThrowError(
      'A projectKey is required',
    );
  });

  test('makes a request', async () => {
    const response = await submitFeedback(
      {
        feedback: { vote: '1' },
        messageId: TEST_MESSAGE_ID,
      },
      'testKey',
    );

    expect(response).toStrictEqual(undefined);
  });

  test('throws an error on invalid status code', async () => {
    status = 500;

    await expect(
      submitFeedback(
        {
          feedback: { vote: '1' },
          messageId: TEST_MESSAGE_ID,
        },
        'testKey',
      ),
    ).rejects.toThrowError('Internal Server Error');
  });
});
