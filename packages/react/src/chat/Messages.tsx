/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, type ComponentType, type ReactElement } from 'react';

import { AssistantMessage } from './AssistantMessage.js';
import { DefaultMessage, DefaultView } from './DefaultView.js';
import { MessagePrompt } from './MessagePrompt.js';
import { References } from './References.js';
import { useChatStore } from './store.js';
import { CSATPicker } from '../feedback/csat-picker.js';
import { ChatIconOutline } from '../icons.js';
import { Branding } from '../primitives/branding.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import type { MarkpromptOptions } from '../types.js';

export type MessagesProps = {
  apiUrl?: string;
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
    apiUrl,
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
  const threadId = useChatStore((state) => state.threadId);
  const submitChat = useChatStore((state) => state.submitChat);

  const welcomeMessage = useMemo(() => {
    const message = chatOptions.defaultView?.message;
    if (typeof message === 'string') {
      return message;
    }
    return undefined;
  }, [chatOptions.defaultView?.message]);

  if (!messages || messages.length === 0) {
    return (
      <div className="MarkpromptMessages">
        <div className="MarkpromptDefaultViewContainer">
          <div className="MarkpromptDefaultViewBranding">
            {branding.show && <Branding brandingType={branding.type} />}
          </div>
          <DefaultView
            {...props}
            onDidSelectPrompt={(prompt) =>
              submitChat([{ role: 'user', content: prompt }])
            }
          />
        </div>
      </div>
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
        {welcomeMessage && <DefaultMessage {...props} />}
        {messages.map((message, index) => {
          const isLastMessage = index === messages.length - 1;
          // Only show references for last message
          const showReferences =
            isLastMessage &&
            (!referencesOptions?.display ||
              referencesOptions?.display === 'end') &&
            message.references &&
            message.references?.length > 0 &&
            message.state === 'done';
          return (
            <div
              key={message.id}
              className="MarkpromptMessage"
              data-loading-state={message.state}
            >
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
                  apiUrl={apiUrl}
                  message={message}
                  projectKey={projectKey}
                  feedbackOptions={feedbackOptions}
                  chatOptions={chatOptions}
                  linkAs={linkAs}
                  showFeedbackAlways={isLastMessage}
                />
              )}

              {showReferences && (
                <References
                  references={message.references || []}
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
                    <p className="MarkpromptMessageSectionHeading">
                      {integrations.createTicket.messageText}
                    </p>
                    <button
                      className="MarkpromptButton"
                      onClick={handleCreateTicket}
                      data-variant="outline"
                      aria-label={
                        integrations.createTicket.messageButton?.hasText
                          ? undefined
                          : integrations.createTicket.messageButton?.text
                      }
                    >
                      <ChatIconOutline
                        className="MarkpromptMenuIcon"
                        aria-hidden={true}
                      />
                      {integrations.createTicket.messageButton?.hasText && (
                        <span>
                          {integrations.createTicket.messageButton?.text}
                        </span>
                      )}
                    </button>
                  </div>
                )}

              {threadId &&
                message.role === 'assistant' &&
                (message.state === 'done' || message.state === 'cancelled') &&
                index === lastAssistantMessageIndex && (
                  <div className="MarkpromptMessageCSATContainer">
                    <CSATPicker
                      apiUrl={apiUrl}
                      projectKey={projectKey}
                      threadId={threadId}
                      feedbackOptions={feedbackOptions}
                    />
                  </div>
                )}
            </div>
          );
        })}
        <div style={{ width: '100%', height: 40 }} />
      </BaseMarkprompt.AutoScroller>
    </div>
  );
}
