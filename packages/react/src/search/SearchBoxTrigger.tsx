import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { useEffect } from 'react';
import type { JSX } from 'react';

import {
  ChevronUpIcon,
  CommandIcon,
  CornerDownLeftIcon,
  SearchIcon,
} from '../icons.js';
import type { MarkpromptOptions } from '../types.js';

interface SearchBoxTriggerProps {
  trigger: MarkpromptOptions['trigger'];
  onClick?: () => void;
}

/**
 * A button that can be used to open the Markprompt dialog, styled as a search
 * input, displaying a keyboard shortcut. This trigger is relatively positioned
 * in the container where Markprompt is rendered.
 */
export function SearchBoxTrigger(props: SearchBoxTriggerProps): JSX.Element {
  const { trigger, onClick } = props;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (
        (event.metaKey && event.key === 'Enter') ||
        (event.ctrlKey && event.key === 'Enter')
      ) {
        event.preventDefault();
        onClick?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClick]);

  return (
    <button
      onClick={onClick}
      className="MarkpromptSearchBoxTrigger"
      aria-label={trigger?.label ?? 'Ask AI'}
      type="button"
    >
      <span className="MarkpromptSearchBoxTriggerContent">
        <span className="MarkpromptSearchBoxTriggerText">
          <SearchIcon width={16} height={16} aria-hidden />{' '}
          {trigger?.placeholder || 'Search'}{' '}
        </span>
        <kbd>
          <kbd>
            {navigator.platform.startsWith('Mac') ||
            navigator.platform === 'iPhone' ? (
              <AccessibleIcon label="Command">
                <CommandIcon className="MarkpromptKeyboardKey" />
              </AccessibleIcon>
            ) : (
              <AccessibleIcon label="Ctrl">
                <ChevronUpIcon className="MarkpromptKeyboardKey" />
              </AccessibleIcon>
            )}
          </kbd>
          <kbd>
            <AccessibleIcon label="Enter">
              <CornerDownLeftIcon className="MarkpromptKeyboardKey" />
            </AccessibleIcon>
          </kbd>
        </kbd>
      </span>
    </button>
  );
}
