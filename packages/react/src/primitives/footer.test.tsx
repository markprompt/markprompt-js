import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import { Footer, MarkpromptIcon } from './footer.js';

describe('Footer', () => {
  test('render a footer', () => {
    render(<Footer />);

    const element = screen.getByText(/Powered by/);
    expect(element).toBeInTheDocument();
    expect(element.textContent).toBe('Powered by Markprompt AI');

    const anchor = screen.getByText<HTMLAnchorElement>('Markprompt AI');
    expect(anchor.href).toBe('https://markprompt.com/');
  });
});

describe('MarkpromptIcon', () => {
  test('render SVG icon', () => {
    render(<MarkpromptIcon />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  test('custom className', () => {
    render(<MarkpromptIcon className="custom-class" />);

    const svg = document.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  // test('custom style', () => {
  //   render(<MarkpromptIcon style={{ color: 'tomato' }} />);

  //   const svg = document.querySelector('svg');
  //   expect(svg).toHaveStyle({ color: 'tomato' });
  // });
});
