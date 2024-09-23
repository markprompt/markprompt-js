import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { Branding } from './branding.js';

describe('Branding', () => {
  test('render a branding element', () => {
    render(<Branding />);

    const element = screen.getByText(/Powered by/);
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Powered by Markprompt AI');

    const anchor = screen.getByText<HTMLAnchorElement>('Markprompt AI');
    expect(anchor.href).toBe('https://markprompt.com/');
  });

  test('render a branding element with Algolia', () => {
    render(<Branding showAlgolia />);

    const anchor = screen.getByLabelText<HTMLAnchorElement>('Algolia');
    expect(anchor.href).toBe('https://algolia.com/');
  });
});
