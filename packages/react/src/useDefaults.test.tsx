import { renderHook } from '@testing-library/react';
import type { ReactElement } from 'react';
import { cloneElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useDefaults } from './useDefaults.js';

vi.mock('react');

describe('useDefaults', () => {
  it('should work', () => {
    const { result } = renderHook(() => useDefaults({}, { b: true }));
    expect(result.current).toEqual({
      b: true,
    });
  });

  it('should work with React components', () => {
    const A = (): ReactElement => <span>A</span>;
    const B = (): ReactElement => <span>B</span>;
    const { result } = renderHook(() => useDefaults({ A }, { B }));
    expect(result.current).toEqual({
      A,
      B,
    });
    expect(cloneElement).toHaveBeenCalledWith(A, {});
  });
});
