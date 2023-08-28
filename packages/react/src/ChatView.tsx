import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import React, {
  Fragment,
  type FormEventHandler,
  type ReactElement,
  useCallback,
} from 'react';

import { Answer } from './Answer.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { Feedback } from './Feedback.js';
import { ReloadIcon, SparklesIcon } from './icons.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { References } from './References.js';
import type { MarkpromptOptions } from './types.js';
import {
  useChat,
  type ChatViewMessage,
  type UseChatResult,
} from './useChat.js';
import type { UseFeedbackResult } from './useFeedback.js';
import type { View } from './useViews.js';

interface ChatViewProps {
  activeView: View;
  projectKey: string;
  chatOptions?: MarkpromptOptions['chat'];
  feedbackOptions?: MarkpromptOptions['feedback'];
  referencesOptions?: MarkpromptOptions['references'];
  close?: MarkpromptOptions['close'];
  onDidSelectReference?: () => void;
}

export function ChatView(props: ChatViewProps): ReactElement {
  const { close, projectKey, chatOptions, feedbackOptions } = props;

  const {
    abortFeedbackRequest,
    messages,
    submitChat,
    submitFeedback,
    abort: abortSubmitChat,
    regenerateLastAnswer,
  } = useChat({ projectKey, options: chatOptions });

  return (
    <div className="MarkpromptChatView">
      <Messages
        messages={messages}
        feedbackOptions={feedbackOptions}
        abortFeedbackRequest={abortFeedbackRequest}
        submitFeedback={submitFeedback}
      />
      <ChatViewForm
        close={close}
        chatOptions={chatOptions}
        submitChat={submitChat}
        lastMessageState={messages[messages.length - 1]?.state}
        abortSubmitChat={abortSubmitChat}
        regenerateLastAnswer={regenerateLastAnswer}
      />
    </div>
  );
}

interface MessagePromptProps {
  children: string;
}

function MessagePrompt(props: MessagePromptProps): ReactElement {
  const { children } = props;
  return (
    <div className="MarkpromptMessagePrompt">
      <p className="MarkpromptMessagePromptText">{children}</p>
    </div>
  );
}

interface MessageAnswerProps {
  children: string;
  state: ChatViewMessage['state'];
}

function MessageAnswer(props: MessageAnswerProps): ReactElement {
  const { children, state } = props;
  return (
    <div className="MarkpromptMessageAnswer">
      <Answer answer={children} state={state} />
      {state === 'cancelled' && (
        <div className="MarkpromptCancelled">
          <p className="MarkpromptCancelledText">
            This prompt response was cancelled. Please try regenerating the
            answer or ask another question.
          </p>
        </div>
      )}
    </div>
  );
}

interface MessagesProps {
  feedbackOptions?: MarkpromptOptions['feedback'];
  messages: ChatViewMessage[];
  submitFeedback: UseFeedbackResult['submitFeedback'];
  abortFeedbackRequest: UseFeedbackResult['abort'];
}

function Messages(props: MessagesProps): ReactElement {
  const { feedbackOptions, messages, submitFeedback, abortFeedbackRequest } =
    props;

  console.log(messages);

  return (
    <div className="MarkpromptMessages">
      <BaseMarkprompt.AutoScroller
        className="MarkpromptAutoScroller"
        scrollTrigger={messages}
      >
        {messages.map((message, index) => (
          <Fragment key={message.id}>
            <MessagePrompt>{message.prompt}</MessagePrompt>
            <div
              className="MarkpromptMessageAnswerContainer"
              data-feedback-enabled={feedbackOptions?.enabled}
            >
              <MessageAnswer state={message.state}>
                {message.answer ?? ''}
              </MessageAnswer>

              {feedbackOptions?.enabled && message.state === 'done' && (
                <Feedback
                  variant="icons"
                  className="MarkpromptPromptFeedback"
                  submitFeedback={submitFeedback}
                  abortFeedbackRequest={abortFeedbackRequest}
                  state={message.state}
                  // convert back to the original index in the array returned from the API
                  messageIndex={index + index + 1}
                />
              )}
            </div>
            <References state={message.state} references={message.references} />
          </Fragment>
        ))}
      </BaseMarkprompt.AutoScroller>
    </div>
  );
}

interface ChatViewFormProps {
  chatOptions?: MarkpromptOptions['chat'];
  close?: MarkpromptOptions['close'];
  submitChat: UseChatResult['submitChat'];
  lastMessageState?: ChatViewMessage['state'];
  regenerateLastAnswer: () => void;
  abortSubmitChat: () => void;
}

function ChatViewForm(props: ChatViewFormProps): ReactElement {
  const {
    close,
    chatOptions,
    submitChat,
    lastMessageState,
    regenerateLastAnswer,
    abortSubmitChat,
  } = props;

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const value = data.get('markprompt-prompt');

      if (typeof value === 'string') {
        submitChat(value);
      }

      if (event.target instanceof HTMLFormElement) {
        event.target.reset();
      }
    },
    [submitChat],
  );

  return (
    <BaseMarkprompt.Form
      className="MarkpromptForm MarkpromptChatViewForm"
      onSubmit={handleSubmit}
    >
      <BaseMarkprompt.Prompt
        className="MarkpromptPrompt"
        name="markprompt-prompt"
        type="text"
        autoFocus
        placeholder={
          chatOptions?.placeholder ??
          DEFAULT_MARKPROMPT_OPTIONS.chat!.placeholder!
        }
        labelClassName="MarkpromptPromptLabel"
        label={
          <AccessibleIcon.Root
            label={
              chatOptions?.label ?? DEFAULT_MARKPROMPT_OPTIONS.prompt!.label!
            }
          >
            <SparklesIcon className="MarkpromptSearchIcon" />
          </AccessibleIcon.Root>
        }
      />
      {lastMessageState && lastMessageState !== 'indeterminate' && (
        <RegenerateButton
          lastMessageState={lastMessageState}
          regenerateLastAnswer={regenerateLastAnswer}
          abortSubmitChat={abortSubmitChat}
        />
      )}
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
  );
}

interface RegenerateButtonProps {
  abortSubmitChat: () => void;
  lastMessageState: ChatViewMessage['state'];
  regenerateLastAnswer: () => void;
}

function RegenerateButton(props: RegenerateButtonProps): ReactElement {
  const { abortSubmitChat, lastMessageState, regenerateLastAnswer } = props;

  const handleClick = useCallback(() => {
    if (lastMessageState === 'done') {
      regenerateLastAnswer();
    } else {
      abortSubmitChat();
    }
  }, [lastMessageState, regenerateLastAnswer, abortSubmitChat]);

  return (
    <button
      className="MarkpromptRegenerateButton"
      type="button"
      onClick={handleClick}
    >
      {lastMessageState === 'done' && (
        <>
          <ReloadIcon width={15} height={15} /> Regenerate
        </>
      )}
      {(lastMessageState === 'preload' ||
        lastMessageState === 'streaming-answer') &&
        'Stop generating'}
    </button>
  );
}
