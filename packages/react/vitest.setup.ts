import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

vi.mock('zustand');

beforeAll(() => {
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  // biome-ignore lint/suspicious/noEmptyBlockStatements: intentional
  Element.prototype.scrollTo = () => {};
  // biome-ignore lint/suspicious/noEmptyBlockStatements: intentional
  Element.prototype.scrollIntoView = () => {};
});

afterEach(() => {
  cleanup();
});
