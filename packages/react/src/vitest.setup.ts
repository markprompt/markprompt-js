import matchers from '@testing-library/jest-dom/matchers.js';
import { cleanup } from '@testing-library/react';
import { expect, afterEach, beforeAll } from 'vitest';

expect.extend(matchers);

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  Element.prototype.scrollTo = () => {};
});

afterEach(() => {
  cleanup();
});
