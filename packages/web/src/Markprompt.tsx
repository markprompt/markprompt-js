import * as BaseMarkprompt from '@markprompt/react';
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React from 'react';

import { Answer } from './Answer.js';
import { ChatIcon, CloseIcon, SearchIcon } from './icons.js';
import { References } from './References.js';
import type { MarkpromptOptions } from './types.js';

type MarkpromptProps = MarkpromptOptions & {
  projectKey: string;
};

function Markprompt(props: MarkpromptProps) {
  const {
    close,
    description,
    projectKey,
    prompt,
    references,
    title,
    trigger,
    showBranding = true,
    ...options
  } = props;

  return (
    <BaseMarkprompt.Root projectKey={projectKey} {...options}>
      <BaseMarkprompt.Trigger className="MarkpromptTrigger">
        <AccessibleIcon.Root label={trigger?.label ?? 'Open Markprompt'}>
          <ChatIcon className="MarkpromptChatIcon" width="24" height="24" />
        </AccessibleIcon.Root>
      </BaseMarkprompt.Trigger>

      <BaseMarkprompt.Portal>
        <BaseMarkprompt.Overlay className="MarkpromptOverlay" />
        <BaseMarkprompt.Content
          className="MarkpromptContent"
          showBranding={showBranding}
        >
          <BaseMarkprompt.Title hide={title?.hide ?? true}>
            {title?.text ?? 'Ask me anything'}
          </BaseMarkprompt.Title>

          {description?.text && (
            <BaseMarkprompt.Description hide={description?.hide ?? true}>
              {description?.text}
            </BaseMarkprompt.Description>
          )}

          <BaseMarkprompt.Form className="MarkpromptForm">
            <BaseMarkprompt.Prompt
              className="MarkpromptPrompt"
              placeholder={prompt?.placeholder}
              labelClassName="MarkpromptPromptLabel"
              label={
                <AccessibleIcon.Root label={prompt?.label ?? 'Your prompt'}>
                  <SearchIcon className="MarkpromptSearchIcon" />
                </AccessibleIcon.Root>
              }
            />
          </BaseMarkprompt.Form>

          <BaseMarkprompt.AutoScroller className="MarkpromptAutoScroller">
            <Answer />
          </BaseMarkprompt.AutoScroller>

          <References
            loadingText={references?.loadingText}
            referencesText={references?.referencesText}
            transformReferenceId={references?.transformReferenceId}
          />

          <BaseMarkprompt.Close className="MarkpromptClose">
            <AccessibleIcon.Root label={close?.label ?? 'Close Markprompt'}>
              <CloseIcon />
            </AccessibleIcon.Root>
          </BaseMarkprompt.Close>
        </BaseMarkprompt.Content>
      </BaseMarkprompt.Portal>
    </BaseMarkprompt.Root>
  );
}

export { Markprompt };
