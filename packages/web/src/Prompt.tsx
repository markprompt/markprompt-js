import * as Markprompt from '@markprompt/react';
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, { useId } from 'react';

import { SearchIcon } from './icons.js';

type PromptProps = {
  label?: string;
  placeholder?: string;
};
export const Prompt = (props: PromptProps) => {
  const { label, placeholder } = props;
  const id = useId();
  return (
    <>
      <label className="MarkpromptPromptLabel" htmlFor={id}>
        <AccessibleIcon.Root label={label ?? 'Your prompt'}>
          <SearchIcon className="MarkpromptSearchIcon" />
        </AccessibleIcon.Root>
      </label>
      <Markprompt.Prompt
        id={id}
        className="MarkpromptPrompt"
        placeholder={placeholder}
      />
    </>
  );
};
