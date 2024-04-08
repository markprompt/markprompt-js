/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ComponentType, type ReactElement } from 'react';

import { AssistantMessage } from './AssistantMessage.js';
import { DefaultView } from './DefaultView.js';
import { MessagePrompt } from './MessagePrompt.js';
import { References } from './References.js';
import { useChatStore } from './store.js';
import { MessageCircleQuestionIcon } from '../icons.js';
import { Branding } from '../primitives/branding.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import type { MarkpromptOptions } from '../types.js';

type MessagesProps = {
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  integrations: MarkpromptOptions['integrations'];
  projectKey: string;
  referencesOptions: NonNullable<MarkpromptOptions['references']>;
  handleCreateTicket?: () => void;
  linkAs?: string | ComponentType<any>;
} & BaseMarkprompt.BrandingProps;

export function Messages(props: MessagesProps): ReactElement {
  const {
    chatOptions,
    feedbackOptions,
    integrations,
    referencesOptions,
    projectKey,
    handleCreateTicket,
    linkAs,
    branding = { show: true, type: 'plain' },
  } = props;

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

  const lastAssistantMessageIndex = messages.findLastIndex(
    (x) => x.role === 'assistant',
  );

  return (
    <div className="MarkpromptMessages">
      <BaseMarkprompt.AutoScroller
        className="MarkpromptAutoScroller"
        scrollTrigger={messages}
        discreteScrollTrigger={messages.length}
      >
        {branding.show && <Branding brandingType={branding.type} />}
        {messages.map((message, index) => {
          const showReferences = index === messages.length - 1;
          return (
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
                  linkAs={linkAs}
                />
              )}

              {showReferences &&
                (!referencesOptions?.display ||
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
                    linkAs={linkAs}
                  />
                )}

              {integrations?.createTicket?.enabled &&
                message.role === 'assistant' &&
                message.state === 'done' &&
                index === lastAssistantMessageIndex && (
                  <div className="MarkpromptMessageCreateTicket">
                    <p className="MarkpromptMessageCreateTicketDefaultText">
                      {integrations.createTicket.messageText}
                    </p>
                    <button
                      className="MarkpromptMessageCreateTicketButton"
                      onClick={handleCreateTicket}
                      aria-label={
                        integrations.createTicket.messageButton?.hasText
                          ? undefined
                          : integrations.createTicket.messageButton?.text
                      }
                    >
                      <div>
                        <MessageCircleQuestionIcon
                          width={20}
                          height={20}
                          aria-hidden={true}
                        />
                        {integrations.createTicket.messageButton?.hasText && (
                          <span>
                            {integrations.createTicket.messageButton?.text}
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                )}
            </div>
          );
        })}
      </BaseMarkprompt.AutoScroller>
    </div>
  );
}
