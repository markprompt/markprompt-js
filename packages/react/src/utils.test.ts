import { describe, expect, test } from 'vitest';

import {
  markdownToString,
  isPresent,
  isIterable,
  hasPresentKey,
  hasValueAtKey,
} from './utils.js';

describe('utils', () => {
  test('isIterable', () => {
    expect(isIterable(null)).toBe(false);
    expect(isIterable([])).toBe(true);
  });

  test('isPresent', () => {
    // Test case with a non-null and non-undefined value
    const value1 = 'Test String';
    const result1 = isPresent(value1);
    expect(result1).toBe(true);

    // Test case with a null value
    const value2: null = null;
    const result2 = isPresent(value2);
    expect(result2).toBe(false);

    // Test case with an undefined value
    const value3 = undefined;
    const result3 = isPresent(value3);
    expect(result3).toBe(false);
  });

  test('hasPresentKey', () => {
    const value1 = { foo: 'bar' };
    const value2 = { bar: 'foo' };
    const test = hasPresentKey('foo');
    expect(test(value1)).toBe(true);
    expect(test(value2)).toBe(false);
  });

  test('hasValueAtKey', () => {
    const value1 = { foo: 'bar' };
    const value2 = { bar: 'foo' };
    const test = hasValueAtKey('foo', 'bar');
    expect(test(value1)).toBe(true);
    // @ts-expect-error - testing false input
    expect(test(value2)).toBe(false);
  });

  test('markdownToString', () => {
    // Test case with markdown text fitting in maxLength
    const testMarkdown1 = '# Hello Vitest';
    const expectedString1 = 'Hello Vitest';

    const result1 = markdownToString(testMarkdown1);
    expect(result1).toBe(expectedString1);

    // Test case with markdown text exceeding maxLength and being trimmed
    const testMarkdown2 =
      '# This is a very very long markdown string just for the sake of this unit testing, I promise!';
    const expectedString2 = 'This is a very very long markdown string just f…';

    const result2 = markdownToString(testMarkdown2, 47);

    expect(result2).toBe(expectedString2);

    // Test case with void input
    const expectedString3 = '';
    const result3 = markdownToString();
    expect(result3).toBe(expectedString3);
  });
});
