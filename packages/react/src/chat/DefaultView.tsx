import type { JSX } from 'react';

import { AssistantMessage } from './AssistantMessage.js';
import type { MessagesProps } from './Messages.js';
import type { MarkpromptOptions } from '../types.js';

export function DefaultMessage(props: MessagesProps): JSX.Element {
  const { chatOptions, feedbackOptions, projectKey, linkAs } = props;

  if (!chatOptions.defaultView?.message) {
    return <></>;
  }

  if (typeof chatOptions.defaultView?.message === 'string') {
    return (
      <AssistantMessage
        message={{
          id: '*-*-*-*-*',
          state: 'done',
          content: chatOptions.defaultView.message,
        }}
        projectKey={projectKey}
        chatOptions={chatOptions}
        feedbackOptions={feedbackOptions}
        linkAs={linkAs}
        messageOnly
      />
    );
  }
  const Message = chatOptions.defaultView.message;
  return <Message />;
}

export function DefaultPrompts({
  chatOptions,
  onDidSelectPrompt,
}: {
  // promptsHeading?: string;
  // prompts: string[];
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  onDidSelectPrompt: (prompt: string) => void;
}): JSX.Element {
  if (
    !chatOptions.defaultView?.prompts ||
    chatOptions.defaultView?.prompts.length === 0
  ) {
    return <></>;
  }
  return (
    <div className="MarkpromptDefaultViewMessagePromptsContainer">
      {chatOptions?.defaultView?.promptsHeading && (
        <h3>{chatOptions.defaultView.promptsHeading}</h3>
      )}
      {chatOptions?.defaultView?.prompts.map((prompt) => {
        return (
          <button
            type="button"
            className="MarkpromptDefaultViewExamplePromptButton"
            key={`markprompt-default-prompt-${prompt}`}
            onClick={() => {
              onDidSelectPrompt?.(prompt);
            }}
          >
            {prompt}
          </button>
        );
      })}
    </div>
  );
}

export function DefaultView(
  props: MessagesProps & { onDidSelectPrompt: (prompt: string) => void },
): JSX.Element {
  const { onDidSelectPrompt, ...rest } = props;
  const chatOptions = rest.chatOptions;

  if (!chatOptions?.defaultView?.message && !chatOptions.defaultView?.prompts) {
    return <div />;
  }

  return (
    <div className="MarkpromptDefaultView">
      {chatOptions.defaultView?.message && <DefaultMessage {...rest} />}
      {chatOptions.defaultView?.prompts && (
        <DefaultPrompts
          chatOptions={chatOptions}
          onDidSelectPrompt={onDidSelectPrompt}
        />
      )}
    </div>
  );
}
