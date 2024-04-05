/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SubmitFeedbackOptions } from '@markprompt/core';
import type { ComponentType, ReactElement } from 'react';

import { ChatViewForm } from './ChatViewForm.js';
import { ConversationSidebar } from './ConversationSidebar.js';
import { Messages } from './Messages.js';
import { useChatStore, type UserConfigurableOptions } from './store.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import { ChevronLeftIcon } from '../icons.js';
import type {
  ChatOptions,
  FeedbackOptions,
  IntegrationsOptions,
  ReferencesOptions,
  View,
} from '../types.js';
import { useDefaults } from '../useDefaults.js';

export interface ChatViewProps {
  /**
   * The project key associated to the project.
   */
  projectKey: string;
  /**
   * The active view.
   */
  activeView?: View;
  /**
   * Options for the chat component.
   */
  chatOptions?: UserConfigurableOptions & ChatOptions;
  /**
   * Options for the feedback component.
   */
  feedbackOptions?: SubmitFeedbackOptions & FeedbackOptions;
  /**
   * Options for the references component.
   */
  referencesOptions?: ReferencesOptions;
  /**
   * Options for the integrations.
   */
  integrations?: IntegrationsOptions;
  /**
   * Show back button.
   * @default true
   */
  showBack?: boolean;
  /**
   * Handler when back button is pressed.
   */
  onDidPressBack?: () => void;
  /**
   * Handler when a ticket is created.
   */
  handleCreateTicket?: () => void;
  /**
   * Component to use in place of <a>.
   * @default "a"
   */
  linkAs?: string | ComponentType<any>;
  /**
   * Display debug info.
   * @default false
   **/
  debug?: boolean;
}

function DisclaimerMessage(props: {
  message: string | ComponentType;
}): ReactElement {
  if (typeof props.message === 'string') {
    return <span>{props.message}</span>;
  } else {
    const Message = props.message;
    return <Message />;
  }
}

export function ChatView(props: ChatViewProps): JSX.Element {
  const {
    activeView,
    projectKey,
    showBack,
    onDidPressBack,
    integrations,
    handleCreateTicket,
    linkAs,
  } = props;

  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass your Markprompt project key to <ChatView />.',
    );
  }

  // We are also merging defaults in the Markprompt component, but this makes
  // sure that standalone ChatView components also have defaults as expected.
  const chatOptions = useDefaults(
    { ...props.chatOptions },
    DEFAULT_MARKPROMPT_OPTIONS.chat,
  );

  const feedbackOptions = useDefaults(
    { ...props.feedbackOptions },
    DEFAULT_MARKPROMPT_OPTIONS.feedback,
  );

  const referencesOptions = useDefaults(
    { ...props.referencesOptions },
    DEFAULT_MARKPROMPT_OPTIONS.references,
  );

  const didAcceptDisclaimer = useChatStore(
    (state) => state.didAcceptDisclaimer,
  );
  const setDidAcceptDisclaimer = useChatStore(
    (state) => state.setDidAcceptDisclaimer,
  );

  return (
    <div className="MarkpromptChatView">
      <ConversationSidebar />
      <div className="MarkpromptChatViewChat">
        {showBack ? (
          <div className="MarkpromptChatViewNavigation">
            <button className="MarkpromptGhostButton" onClick={onDidPressBack}>
              <ChevronLeftIcon
                style={{ width: 16, height: 16 }}
                strokeWidth={2.5}
              />
            </button>
          </div>
        ) : (
          // Keep this for the grid template rows layout
          <div />
        )}
        {!didAcceptDisclaimer && chatOptions?.disclaimerView ? (
          <div className="MarkpromptDisclaimerView">
            <div className="MarkpromptDisclaimerViewMessage">
              <DisclaimerMessage message={chatOptions.disclaimerView.message} />
              <button
                className="MarkpromptPromptSubmitButton"
                type="submit"
                onClick={() => {
                  setDidAcceptDisclaimer(true);
                }}
              >
                {chatOptions.disclaimerView.cta || 'I agree'}
              </button>
            </div>
          </div>
        ) : (
          <Messages
            chatOptions={chatOptions}
            feedbackOptions={feedbackOptions}
            integrations={integrations}
            projectKey={projectKey}
            referencesOptions={referencesOptions}
            handleCreateTicket={handleCreateTicket}
            linkAs={linkAs}
          />
        )}
        <ChatViewForm activeView={activeView} chatOptions={chatOptions} />
      </div>
    </div>
  );
}
