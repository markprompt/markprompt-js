import { type ReactElement } from 'react';

import { AssistantMessage } from './AssistantMessage.js';
import { MessagePrompt } from './MessagePrompt.js';
import { useChatStore } from './store.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import { DefaultView } from '../prompt/DefaultView.js';
import { References } from '../prompt/References.js';
import type { MarkpromptOptions } from '../types.js';

interface MessagesProps {
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  referencesOptions: NonNullable<MarkpromptOptions['references']>;
  projectKey: string;
}

export function Messages(props: MessagesProps): ReactElement {
  const { chatOptions, feedbackOptions, referencesOptions, projectKey } = props;

  const messages = useChatStore((state) => state.messages);
  const submitChat = useChatStore((state) => state.submitChat);

  if (!messages || messages.length === 0) {
    return (
      <DefaultView
        {...chatOptions.defaultView}
        onDidSelectPrompt={(prompt) =>
          submitChat([{ role: 'user', content: prompt }])
        }
      />
    );
  }

  return (
    <div className="MarkpromptMessages">
      <BaseMarkprompt.AutoScroller
        className="MarkpromptAutoScroller"
        scrollTrigger={messages}
        discreteScrollTrigger={messages.length}
      >
        {messages.map((message) => (
          <div key={message.id} className="MarkpromptMessage">
            {message.role === 'user' && (
              <MessagePrompt
                state={message.state}
                chatOptions={chatOptions}
                referencesOptions={referencesOptions}
              >
                {message.content ?? ''}
              </MessagePrompt>
            )}

            {message.role === 'assistant' && (
              <AssistantMessage
                message={message}
                projectKey={projectKey}
                feedbackOptions={feedbackOptions}
                chatOptions={chatOptions}
              />
            )}

            {(!referencesOptions?.display ||
              referencesOptions?.display === 'end') &&
              message.references &&
              message.references?.length > 0 &&
              (message.state === 'streaming-answer' ||
                message.state === 'done') && (
                <References
                  references={message.references}
                  getHref={referencesOptions?.getHref}
                  getLabel={referencesOptions?.getLabel}
                  loadingText={referencesOptions?.loadingText}
                  heading={referencesOptions?.heading}
                  state={message.state}
                />
              )}
          </div>
        ))}
      </BaseMarkprompt.AutoScroller>
    </div>
  );
}
