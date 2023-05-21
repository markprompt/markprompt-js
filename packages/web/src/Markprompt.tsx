import * as BaseMarkprompt from '@markprompt/react';
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import React from 'react';

import { Answer } from './Answer.js';
import { Caret } from './Caret.js';
import { ConditionalWrap } from './ConditionalWrap.js';
import { ChatIcon, CloseIcon } from './icons.js';
import { Prompt } from './Prompt.js';
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
        <BaseMarkprompt.Content className="MarkpromptContent">
          <ConditionalWrap
            condition={title?.hide ?? true}
            wrap={(children) => (
              <VisuallyHidden asChild>{children}</VisuallyHidden>
            )}
          >
            <BaseMarkprompt.Title>
              {title?.text ?? 'Ask me anything'}
            </BaseMarkprompt.Title>
          </ConditionalWrap>

          {description?.text && (
            <ConditionalWrap
              condition={description?.hide ?? true}
              wrap={(children) => (
                <VisuallyHidden asChild>{children}</VisuallyHidden>
              )}
            >
              <BaseMarkprompt.Description>
                {description.text}
              </BaseMarkprompt.Description>
            </ConditionalWrap>
          )}

          <BaseMarkprompt.Form className="MarkpromptForm">
            <Prompt label={prompt?.label} placeholder={prompt?.placeholder} />
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
