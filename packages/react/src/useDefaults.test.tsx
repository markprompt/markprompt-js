import { renderHook } from '@testing-library/react';
import {
  cloneElement,
  type Attributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useDefaults } from './useDefaults.js';

vi.mock('react', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react')>();
  return {
    ...mod,
    cloneElement: vi.fn(
      (
        element: ReactElement,
        props: (Partial<unknown> & Attributes) | undefined,
        ...children: ReactNode[]
      ) => {
        return mod.cloneElement(element, props, ...children);
      },
    ),
  };
});

describe('useDefaults', () => {
  it('should work', () => {
    const { result } = renderHook(() => useDefaults({}, { b: true }));
    expect(result.current).toEqual({
      b: true,
    });
  });

  it('should work with React components', () => {
    const A = <span>A</span>;
    const B = <span>B</span>;

    const { result } = renderHook(() => useDefaults({ A }, { B }));
    expect(result.current).toEqual({
      A,
      B,
    });
    expect(cloneElement).toHaveBeenCalled();
  });
});
