import { render } from '@testing-library/react';
import React from 'react';
import { expect, test } from 'vitest';

import {
  ChatIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  CloseIcon,
  CommandIcon,
  CornerDownLeftIcon,
  FileTextIcon,
  HashIcon,
  SearchIcon,
  SparklesIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from './icons.js';

const allIcons = [
  ChatIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  CloseIcon,
  CommandIcon,
  CornerDownLeftIcon,
  FileTextIcon,
  HashIcon,
  SearchIcon,
  SparklesIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
];

test('renders the ThumbsDownIcon component', () => {
  for (let i = 0; i < allIcons.length; i++) {
    const Icon = allIcons[i];
    const { getByTestId } = render(<Icon data-testid={`test-icon-${i}`} />);
    const thumbsDownIcon = getByTestId(`test-icon-${i}`);
    expect(thumbsDownIcon).toBeInTheDocument();
  }
});
