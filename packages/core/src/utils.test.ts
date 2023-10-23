import { describe, expect, test } from 'vitest';

import {
  getErrorMessage,
  parseEncodedJSONHeader,
  isFileSectionReferences,
  isAbortError,
  safeStringify,
} from './utils.js';

const encoder = new TextEncoder();
const unencodedObject = { data: 'Some text' };
const encodedObject = encoder
  .encode(JSON.stringify(unencodedObject))
  .toString();
const unencodedText = 'Some text';
const encodedText = encoder.encode(unencodedText).toString();

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

describe('parseEncodedJSONHeader', () => {
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

describe('safeStringify', () => {
  test('removes non-serializable entries', () => {
    const obj = {
      name: 'Name',
      fn: () => {
        return 1;
      },
      sub: {
        name: 'Sub',
        callback: () => {
          return 0;
        },
      },
    };
    expect(safeStringify(obj)).toEqual(
      JSON.stringify({
        name: 'Name',
        sub: { name: 'Sub' },
      }),
    );
  });
});
