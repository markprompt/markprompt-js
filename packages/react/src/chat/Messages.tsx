import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import {
  useCallback,
  useMemo,
  useState,
  type ComponentType,
  type JSX,
} from 'react';

import { AssistantMessage } from './AssistantMessage.js';
import { DefaultMessage, DefaultView } from './DefaultView.js';
import { MessagePrompt } from './MessagePrompt.js';
import { References } from './References.js';
import { useChatStore } from './store.js';
import { useGlobalStore } from '../context/global/store.js';
import { CSATPicker } from '../feedback/csat-picker.js';
import { ChatIconOutline, LoadingIcon } from '../icons.js';
import { Branding } from '../primitives/branding.js';
import * as BaseMarkprompt from '../primitives/headless.js';
import type { MarkpromptOptions } from '../types.js';
import { openMarkprompt } from '../utils.js';

export type MessagesProps = {
  apiUrl?: string;
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  integrations: MarkpromptOptions['integrations'];
  projectKey: string;
  referencesOptions: NonNullable<MarkpromptOptions['references']>;
  linkAs?: string | ComponentType<any>;
} & BaseMarkprompt.BrandingProps;

export function CreateTicketButton({
  integrations,
}: {
  integrations: MarkpromptOptions['integrations'];
}): JSX.Element {
  const [isCreatingTicketSummary, setIsCreatingTicketSummary] = useState(false);
  const threadId = useChatStore((state) => state.threadId);
  const messages = useChatStore((state) => state.messages);
  const createTicketSummary = useGlobalStore(
    (state) => state.tickets?.createTicketSummary,
  );

  const createTicketAndOpenForm = useCallback(async () => {
    if (!integrations?.createTicket?.enabled) {
      return;
    }

    if (!messages || messages.length === 0 || !threadId) {
      openMarkprompt('ticket');
      return;
    }

    setIsCreatingTicketSummary(true);
    await createTicketSummary?.(threadId, messages);
    setIsCreatingTicketSummary(false);
    openMarkprompt('ticket', {
      ticketDeflectionFormOptions: {
        defaultView: 'ticket',
        showBackLink: false,
        threadId,
      },
    });
  }, [
    integrations?.createTicket?.enabled,
    messages,
    threadId,
    createTicketSummary,
  ]);

  if (!integrations?.createTicket) {
    return <></>;
  }

  return (
    <button
      className="MarkpromptButton"
      onClick={createTicketAndOpenForm}
      data-variant="outline"
      disabled={isCreatingTicketSummary}
      type="button"
    >
      {isCreatingTicketSummary ? (
        <AccessibleIcon label={'loading summary'}>
          <LoadingIcon style={{ width: 16, height: 16 }} />
        </AccessibleIcon>
      ) : (
        <AccessibleIcon
          label={
            integrations.createTicket.messageButton?.text ??
            'create a support case'
          }
        >
          <ChatIconOutline className="MarkpromptMenuIcon" />
        </AccessibleIcon>
      )}
      {integrations.createTicket.messageButton?.hasText && (
        <span>{integrations.createTicket.messageButton?.text}</span>
      )}
    </button>
  );
}

export function Messages(props: MessagesProps): JSX.Element {
  const {
    apiUrl,
    chatOptions,
    feedbackOptions,
    integrations,
    referencesOptions,
    projectKey,
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
                  filter={referencesOptions?.filter}
                  loadingText={referencesOptions?.loadingText}
                  heading={referencesOptions?.heading}
                  state={message.state}
                  linkAs={linkAs}
                />
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

              {integrations?.createTicket?.enabled &&
                message.role === 'assistant' &&
                message.state === 'done' &&
                index === lastAssistantMessageIndex && (
                  <div className="MarkpromptMessageCreateTicket">
                    <p className="MarkpromptMessageSectionHeading">
                      {integrations.createTicket.messageText}
                    </p>
                    <CreateTicketButton integrations={integrations} />
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
