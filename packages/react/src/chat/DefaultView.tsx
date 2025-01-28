import type { ComponentType, JSX } from 'react';

import { AssistantMessage } from './AssistantMessage.js';
import type * as BaseMarkprompt from '../primitives/headless.js';
import type { MarkpromptOptions } from '../types.js';

export function DefaultMessage(
  props: Omit<DefaultViewProps, 'onDidSelectPrompt'>,
): JSX.Element {
  const { chatOptions, feedbackOptions, projectKey, linkAs } = props;

  if (!chatOptions.defaultView?.message) {
    return <></>;
  }

  if (typeof chatOptions.defaultView?.message === 'string') {
    return (
      <AssistantMessage
        message={{
          id: '*-*-*-*-*',
          name: undefined,
          role: 'assistant',
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

export type DefaultViewProps = {
  apiUrl?: string;
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  integrations: MarkpromptOptions['integrations'];
  projectKey: string;
  referencesOptions: NonNullable<MarkpromptOptions['references']>;
  linkAs?: string | ComponentType<any>;
  onDidSelectPrompt: (prompt: string) => void;
} & BaseMarkprompt.BrandingProps;

export function DefaultView(props: DefaultViewProps): JSX.Element {
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
