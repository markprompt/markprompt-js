import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { ConditionalWrap } from './ConditionalWrap.js';

describe('ConditionalWrap', () => {
  it('renders', () => {
    render(
      <ConditionalWrap
        condition
        wrap={({ children }) => <button>{children}</button>}
      >
        test
      </ConditionalWrap>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
