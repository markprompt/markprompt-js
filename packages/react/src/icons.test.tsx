import { render, screen } from '@testing-library/react';
import React from 'react';
import { expect, test } from 'vitest';

import * as icons from './icons.js';

test('renders the ThumbsDownIcon component', () => {
  for (const icon in icons) {
    const Icon = icons[icon];
    render(<Icon data-testid={`test-icon-${icon}`} />);
    const el = screen.getByTestId(`test-icon-${icon}`);
    expect(el).toBeInTheDocument();
  }
});
