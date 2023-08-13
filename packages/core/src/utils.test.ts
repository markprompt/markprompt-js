import { describe, expect, test } from 'vitest';

import {
  getErrorMessage,
  parseEncodedJSONHeader,
  isFileSectionReferences,
  isAbortError,
} from './utils.js';

const encoder = new TextEncoder();
const errorMessage = 'This is an error message';
const unencodedObject = { data: 'Some text' };
const encodedObject = encoder
  .encode(JSON.stringify(unencodedObject))
  .toString();
const unencodedText = 'Some text';
const encodedText = encoder.encode(unencodedText).toString();

describe('utils', () => {
  test('returns the error message from the response', async () => {
    const mockErrorResponse = {
      error: errorMessage,
    };

    const mockResponse = new Response(JSON.stringify(mockErrorResponse), {
      status: 500,
      headers: { 'Content-type': 'application/json' },
    });

    const _errorMessage = await getErrorMessage(mockResponse);

    expect(_errorMessage).toBe(errorMessage);
  });

  test('returns the response body as a string if parsing JSON fails', async () => {
    const mockResponse = new Response(errorMessage, {
      status: 500,
      headers: { 'Content-type': 'text/plain' },
    });

    const _errorMessage = await getErrorMessage(mockResponse);

    expect(_errorMessage).toBe(errorMessage);
  });

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

  test('identifies AbortError', () => {
    const err1 = new DOMException('AbortError');
    expect(isAbortError(err1)).toBe(true);
    const err2 = new Error('AbortError');
    expect(isAbortError(err2)).toBe(true);
    const err3 = new Error('Some other error');
    expect(isAbortError(err3)).toBe(false);
  });
});
