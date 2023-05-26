import matchers from '@testing-library/jest-dom/matchers.js';
import { cleanup } from '@testing-library/react';
import { expect, afterEach } from 'vitest';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
