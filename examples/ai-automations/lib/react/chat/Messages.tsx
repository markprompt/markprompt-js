import { Check } from 'lucide-react';
import Image from 'next/image';
import React, { Fragment, type ReactElement, useRef, useMemo } from 'react';
import { toast } from 'sonner';

import { FunctionCall, PromptFeedback } from '@/lib/core';

import { MessageAnswer } from './MessageAnswer';
import { MessagePrompt } from './MessagePrompt';
import { ChatViewMessage, useChatStore } from './store';
import { Message, useZendeskStore } from './zendesk';
import { Feedback } from '../feedback/Feedback';
import { useFeedback } from '../feedback/useFeedback';
import * as BaseMarkprompt from '../primitives/headless';
import { Reference } from '../prompt/References';
import type {
  FunctionDefinitionWithFunction,
  MarkpromptOptions,
} from '../types';

interface MessagesProps {
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  referencesOptions: NonNullable<MarkpromptOptions['references']>;
  projectKey: string;
}

interface MarkpromptMessageProps {
  index: number;
  message: ChatViewMessage;
  messages: ChatViewMessage[];
  referencesOptions: NonNullable<MarkpromptOptions['references']>;
  feedbackOptions: NonNullable<MarkpromptOptions['feedback']>;
  submitFunctionCall: (functionCall: FunctionCall) => void;
  submittedCalls: React.MutableRefObject<string[]>;
  submitFeedback: (
    feedback: PromptFeedback,
    promptId?: string | undefined,
  ) => void;
  abortFeedbackRequest: () => void;
  functions: FunctionDefinitionWithFunction[] | undefined;
}

function MarkpromptMessage(props: MarkpromptMessageProps): ReactElement {
  return (
    <Fragment>
      {props.message.role === 'user' && (
        <MessagePrompt
          state={props.message.state}
          referencesOptions={props.referencesOptions}
        >
          {props.message.content ?? ''}
        </MessagePrompt>
      )}

      {props.message.role === 'assistant' &&
        props.message.content !== null &&
        props.message.content !== 'null' && (
          <div className="MarkpromptMessageAnswerContainer">
            <MessageAnswer state={props.message.state}>
              {props.message.content ?? ''}
            </MessageAnswer>
            {props.feedbackOptions?.enabled &&
              props.message.state === 'done' && (
                <Feedback
                  variant="icons"
                  className="MarkpromptPromptFeedback"
                  submitFeedback={(feedback, promptId) => {
                    props.submitFeedback(feedback, promptId);
                    props.feedbackOptions.onFeedbackSubmit?.(
                      feedback,
                      props.messages,
                      promptId,
                    );
                  }}
                  abortFeedbackRequest={props.abortFeedbackRequest}
                  promptId={props.message.promptId}
                  heading={props.feedbackOptions.heading}
                />
              )}
          </div>
        )}
      {props.message.role === 'assistant' && props.message.function_call && (
        <div className="px-6 text-base mt-4">
          {(() => {
            const nextMessage = props.messages[props.index + 1];
            const isNextMessageDoneFunction =
              nextMessage?.role === 'function' &&
              (nextMessage?.state === 'done' ||
                nextMessage?.state === 'cancelled');
            const functionCall = props.functions?.find(
              (f) => f.name === props.message?.function_call?.name,
            );
            const prevMessage = props.messages[props.index - 1];
            const isPrevMessageDoneFunctionCall =
              prevMessage?.role === 'function' &&
              (prevMessage?.state === 'done' ||
                prevMessage?.state === 'cancelled');

            if (isPrevMessageDoneFunctionCall) {
              // Bug
              return <></>;
            }

            if (!isNextMessageDoneFunction && functionCall?.autoConfirm) {
              props.message.content;
              const signature = `${props.message.content}:${props.index}`;
              if (!props.submittedCalls.current?.includes(signature)) {
                // Sumbitting function call
                console.debug('Auto-submitting call', signature);
                props.submitFunctionCall(props.message.function_call!);
                props.submittedCalls.current.push(signature);
              }

              return <></>;
            }

            if (isNextMessageDoneFunction) {
              return (
                <div className="flex flex-row gap-2 p-3 text-sm rounded-md bg-green-50 border-green-100 border items-start">
                  <div className="p-[2px] rounded-full bg-green-700 text-green-50 flex-none mt-[3px]">
                    <Check className="flex-none w-3 h-3" strokeWidth={3} />
                  </div>
                  <div className="text-green-700 flex-grow font-medium">
                    {nextMessage.content || 'Action has completed'}
                  </div>
                </div>
              );
            }
            return (
              <>
                {functionCall?.confirmationMessage?.(
                  props.message.function_call?.arguments || {},
                )}
                <div className="flex flex-row gap-2 mt-4 mb-4">
                  <button
                    className="py-1 px-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 text-sm active:scale-95 transform transition"
                    onClick={() =>
                      props.submitFunctionCall(props.message.function_call!)
                    }
                  >
                    Confirm
                  </button>
                  <button
                    className="py-1 px-3 bg-neutral-100 border border-neutral-200 text-sm font-medium rounded-md hover:bg-neutral-200 hover:border-neutral-300 text-black active:scale-95 transform transition"
                    onClick={() => {
                      toast.success('The action was canceled.');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {(!props.referencesOptions?.display ||
        props.referencesOptions?.display === 'end') &&
        props.message.references &&
        props.message.references?.length > 0 &&
        !props.message.function_call && (
          <div className="MarkpromptReferences">
            {(props.message.state === 'streaming-answer' ||
              props.message.state === 'done') && (
              <>
                <p>{props.referencesOptions.heading}</p>
                <BaseMarkprompt.References
                  ReferenceComponent={Reference}
                  references={props.message.references}
                />
              </>
            )}
          </div>
        )}
    </Fragment>
  );
}

interface ZendeskMessageProps {
  message: Message;
}

function ZendeskMessage(props: ZendeskMessageProps): ReactElement {
  return (
    <div>
      {props.message.author.type === 'user' && (
        <MessagePrompt state="done">{props.message.content.text}</MessagePrompt>
      )}
      {props.message.author.type === 'business' && (
        <div className="mb-8">
          <div className="px-6 flex items-center gap-3 py-2">
            <Image
              width={28}
              height={28}
              className="rounded-full"
              src={props.message.author.avatarUrl}
              alt={`Avatar of ${props.message.author.displayName}`}
            />
            <span className="font-medium">
              {props.message.author.displayName}
            </span>
            <span className="text-xs font-medium bg-blue-50 rounded-md px-1 py-0.5 text-blue-500">
              Agent
            </span>
          </div>
          <div className="-mt-2">
            <MessageAnswer state="done">
              {props.message.content.text}
            </MessageAnswer>
          </div>
        </div>
      )}
    </div>
  );
}

type TypedMessage = {
  type: 'message' | 'zendeskMessage';
  received: Date;
  message: ChatViewMessage | Message;
};

export function Messages(props: MessagesProps): ReactElement {
  const { feedbackOptions, referencesOptions, projectKey } = props;
  const submittedCalls = useRef<string[]>([]);

  const messages = useChatStore((state) => state.messages);
  const zendeskMessages = useZendeskStore((state) => state.messages);

  const { submitFeedback, abort: abortFeedbackRequest } = useFeedback({
    projectKey,
    feedbackOptions,
  });

  const submitFunctionCall = useChatStore((state) => state.submitFunctionCall);
  const functions = useChatStore((state) => state.options?.functions);

  const sortedMessages = useMemo(() => {
    const allMessages: TypedMessage[] = [];

    const createTypedMessage = (
      message: ChatViewMessage | Message,
      type: 'message' | 'zendeskMessage',
    ): TypedMessage | undefined => {
      if (!message.received) {
        return undefined;
      }
      try {
        const received = new Date(message.received);
        return { type, received, message } as TypedMessage;
      } catch {
        return undefined;
      }
    };

    for (const message of messages) {
      const typedMessage = createTypedMessage(message, 'message');
      if (typedMessage) {
        allMessages.push(typedMessage);
      }
    }

    for (const message of zendeskMessages || []) {
      if (message.metadata?.isSummary) {
        continue;
      }

      const typedMessage = createTypedMessage(message, 'zendeskMessage');
      if (typedMessage) {
        allMessages.push(typedMessage);
      }
    }

    return allMessages.sort((a, b) => {
      return a.received.getTime() - b.received.getTime();
    });
  }, [messages, zendeskMessages]);

  return (
    <div className="MarkpromptMessages">
      <BaseMarkprompt.AutoScroller
        className="MarkpromptAutoScroller"
        scrollTrigger={messages}
      >
        {sortedMessages.map((message, index) => {
          if (message.type === 'message') {
            return (
              <MarkpromptMessage
                key={index}
                index={index}
                message={message.message as ChatViewMessage}
                messages={messages}
                referencesOptions={referencesOptions}
                feedbackOptions={feedbackOptions}
                submitFeedback={submitFeedback}
                submitFunctionCall={submitFunctionCall}
                submittedCalls={submittedCalls}
                functions={functions}
                abortFeedbackRequest={abortFeedbackRequest}
              />
            );
          } else if (message.type === 'zendeskMessage') {
            const zendeskMessage = message.message as Message;
            return (
              <ZendeskMessage
                key={zendeskMessage.id}
                message={zendeskMessage}
              />
            );
          }
        })}
      </BaseMarkprompt.AutoScroller>
    </div>
  );
}
