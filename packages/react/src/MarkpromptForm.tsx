import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, { type ComponentPropsWithoutRef, type ReactElement } from 'react';

import { SearchIcon } from './icons.js';
import * as BaseMarkprompt from './primitives/headless.js';

interface MarkpromptFormProps {
  label: string;
  placeholder: string;
  inputProps?: ComponentPropsWithoutRef<typeof BaseMarkprompt.Prompt>;
}
export function MarkpromptForm(props: MarkpromptFormProps): ReactElement {
  const { placeholder, label } = props;

  return (
    <BaseMarkprompt.Form className="MarkpromptForm">
      <BaseMarkprompt.Prompt
        className="MarkpromptPrompt"
        placeholder={placeholder}
        labelClassName="MarkpromptPromptLabel"
        label={
          <AccessibleIcon.Root label={label}>
            <SearchIcon className="MarkpromptSearchIcon" />
          </AccessibleIcon.Root>
        }
      />
    </BaseMarkprompt.Form>
  );
}
