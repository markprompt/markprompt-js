import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll } from 'vitest';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  Element.prototype.scrollTo = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  Element.prototype.scrollIntoView = () => {};
});

afterEach(() => {
  cleanup();
});
