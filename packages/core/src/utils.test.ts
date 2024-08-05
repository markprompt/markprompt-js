import { describe, expect, test } from 'vitest';

import {
  getErrorMessage,
  isFileSectionReferences,
  isAbortError,
  isKeyOf,
} from './utils.js';

describe('getErrorMessage', () => {
  test('returns error from response if present', async () => {
    const mockResponse = new Response(JSON.stringify({ error: 'Test error' }));
    const result = await getErrorMessage(mockResponse);
    expect(result).toBe('Test error');
  });

  test('returns text from response if error is not present', async () => {
    const mockResponse = new Response('Test text');
    const result = await getErrorMessage(mockResponse);
    expect(result).toBe('Test text');
  });
});

describe('isFileSectionReferences', () => {
  test('identifies FileSectionReference types', () => {
    const references = [
      {
        file: {
          path: '/docs/some-page',
          source: { type: 'website' },
        },
      },
    ];

    expect(isFileSectionReferences(references)).toBe(true);
  });
});

describe('isAbortError', () => {
  test('identifies AbortError', () => {
    const err1 = new DOMException('AbortError');
    expect(isAbortError(err1)).toBe(true);
    const err2 = new Error('AbortError');
    expect(isAbortError(err2)).toBe(true);
    const err3 = new Error('Some other error');
    expect(isAbortError(err3)).toBe(false);
  });
});

describe('isKeyOf', () => {
  test('identifies keys of an object', () => {
    const obj = { foo: 'bar' };
    expect(isKeyOf(obj, 'foo')).toBeTruthy();
    expect(isKeyOf(obj, 'bar')).toBeFalsy();
  });
});
