import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, { type ReactElement } from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { SparklesIcon } from './icons.js';
import * as BaseMarkprompt from './primitives/headless.js';
import type { MarkpromptOptions } from './types.js';
import type { View } from './useViews.js';

interface ChatViewProps {
  activeView: View;
  projectKey: string;
  promptOptions?: MarkpromptOptions['prompt'];
  feedbackOptions?: MarkpromptOptions['feedback'];
  close?: MarkpromptOptions['close'];
}

export function ChatView(props: ChatViewProps): ReactElement {
  const { close, projectKey, promptOptions } = props;

  const {} = useChat({ projectKey });

  return (
    <div className="MarkpromptChatView">
      <BaseMarkprompt.Form className="MarkpromptForm">
        <BaseMarkprompt.Prompt
          className="MarkpromptPrompt"
          name="markprompt-prompt"
          // onChange={handleChange}
          // value={prompt}
          type="text"
          placeholder={
            promptOptions?.placeholder ??
            DEFAULT_MARKPROMPT_OPTIONS.prompt!.placeholder!
          }
          labelClassName="MarkpromptPromptLabel"
          label={
            <AccessibleIcon.Root
              label={
                promptOptions?.label ??
                DEFAULT_MARKPROMPT_OPTIONS.prompt!.label!
              }
            >
              <SparklesIcon className="MarkpromptSearchIcon" />
            </AccessibleIcon.Root>
          }
        />
        {close && close.visible !== false && (
          <BaseMarkprompt.Close className="MarkpromptClose">
            <AccessibleIcon.Root
              label={close?.label ?? DEFAULT_MARKPROMPT_OPTIONS.close!.label!}
            >
              <kbd>Esc</kbd>
            </AccessibleIcon.Root>
          </BaseMarkprompt.Close>
        )}
      </BaseMarkprompt.Form>
    </div>
  );
}
