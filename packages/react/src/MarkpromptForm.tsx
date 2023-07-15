import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, {
  useRef,
  type ComponentPropsWithoutRef,
  type ReactElement,
  useEffect,
} from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { useMarkpromptContext } from './context.js';
import { SearchIcon, SparklesIcon } from './icons.js';
import * as BaseMarkprompt from './primitives/headless.js';
import type { MarkpromptOptions } from './types.js';

interface MarkpromptFormProps {
  label: string;
  placeholder: string;
  inputProps?: ComponentPropsWithoutRef<typeof BaseMarkprompt.Prompt>;
  icon?: 'search' | 'prompt' | undefined;
  close?: MarkpromptOptions['close'];
}
export function MarkpromptForm(props: MarkpromptFormProps): ReactElement {
  const { inputProps, label, placeholder, icon, close } = props;
  const { activeView } = useMarkpromptContext();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Bring form input in focus when activeView changes.
    inputRef.current?.focus();
  }, [activeView]);

  return (
    <BaseMarkprompt.Form className="MarkpromptForm">
      <BaseMarkprompt.Prompt
        {...inputProps}
        ref={inputRef}
        className="MarkpromptPrompt"
        placeholder={placeholder}
        labelClassName="MarkpromptPromptLabel"
        label={
          <AccessibleIcon.Root label={label}>
            {icon === 'search' ? (
              <SearchIcon className="MarkpromptSearchIcon" />
            ) : (
              <SparklesIcon className="MarkpromptSearchIcon" />
            )}
          </AccessibleIcon.Root>
        }
      />
      {close?.visible !== false && (
        <BaseMarkprompt.Close className="MarkpromptClose">
          <AccessibleIcon.Root
            label={close?.label ?? DEFAULT_MARKPROMPT_OPTIONS.close!.label!}
          >
            <kbd>Esc</kbd>
          </AccessibleIcon.Root>
        </BaseMarkprompt.Close>
      )}
    </BaseMarkprompt.Form>
  );
}
