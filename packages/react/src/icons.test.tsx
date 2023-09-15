import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, test } from 'vitest';

import {
  ChatIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  CloseIcon,
  CommandIcon,
  CornerDownLeftIcon,
  CounterClockwiseClockIcon,
  FileTextIcon,
  HashIcon,
  ReloadIcon,
  SearchIcon,
  SparklesIcon,
  StopIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  PlusIcon,
} from './icons.js';

const icons = [
  ChatIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  CloseIcon,
  CommandIcon,
  CornerDownLeftIcon,
  CounterClockwiseClockIcon,
  FileTextIcon,
  HashIcon,
  ReloadIcon,
  SearchIcon,
  SparklesIcon,
  StopIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  PlusIcon,
];

describe('icons', () => {
  for (const Icon of icons) {
    test(`renders the ${Icon.name} component`, () => {
      render(<Icon data-testid={`test-icon-${Icon.name}`} />);
      const el = screen.getByTestId(`test-icon-${Icon.name}`);
      expect(el).toBeInTheDocument();
    });
  }
});
