import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, {
  useRef,
  type ComponentPropsWithoutRef,
  type ReactElement,
  useEffect,
} from 'react';

import { useMarkpromptContext } from './context.js';
import { SearchIcon, SparklesIcon } from './icons.js';
import * as BaseMarkprompt from './primitives/headless.js';

interface MarkpromptFormProps {
  label: string;
  placeholder: string;
  inputProps?: ComponentPropsWithoutRef<typeof BaseMarkprompt.Prompt>;
  icon?: 'search' | 'prompt' | undefined;
}
export function MarkpromptForm(props: MarkpromptFormProps): ReactElement {
  const { inputProps, label, placeholder, icon } = props;
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
    </BaseMarkprompt.Form>
  );
}
