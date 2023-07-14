import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, { type ComponentPropsWithoutRef, type ReactElement } from 'react';

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

  return (
    <BaseMarkprompt.Form className="MarkpromptForm">
      <BaseMarkprompt.Prompt
        {...inputProps}
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
