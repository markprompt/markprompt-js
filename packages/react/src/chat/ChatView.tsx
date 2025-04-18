import type { SubmitFeedbackOptions } from '@markprompt/core/feedback';
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import type { ComponentType, JSX } from 'react';

import { ChatViewForm } from './ChatViewForm.js';
import { Messages } from './Messages.js';
import { useChatStore } from './store.js';
import { ThreadSidebar } from './ThreadSidebar.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import { ChevronLeftIcon } from '../icons.js';
import type {
  ChatOptions,
  FeedbackOptions,
  IntegrationsOptions,
  MarkpromptOptions,
  ReferencesOptions,
  UserConfigurableOptions,
  View,
} from '../types.js';
import { RichText } from '../ui/rich-text.js';
import { useDefaults } from '../useDefaults.js';

export interface ChatViewProps {
  /**
   * The project key associated to the project.
   */
  projectKey: string;
  /**
   * The base API URL.
   */
  apiUrl?: string;
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
   * Component to use in place of <a>.
   * @default "a"
   */
  linkAs?: string | ComponentType<any>;
  /**
   * Minimum number of rows.
   * @default 1
   */
  minInputRows?: number;
  /**
   * Submit on enter.
   * @default true
   */
  submitOnEnter?: boolean;
  /**
   * Show the Markprompt footer.
   **/
  branding?: { show?: boolean; type?: 'plain' | 'text' };
  /**
   * The way to display the chat/search content.
   * @default "dialog"
   **/
  display?: MarkpromptOptions['display'];
  /**
   * Display debug info.
   * @default false
   **/
  debug?: boolean;
}

export function ChatView(props: ChatViewProps): JSX.Element {
  const {
    apiUrl,
    activeView,
    projectKey,
    showBack,
    onDidPressBack,
    integrations,
    linkAs,
    submitOnEnter,
    branding,
    display,
    minInputRows,
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
      <ThreadSidebar display={display} />
      <div className="MarkpromptChatViewChatContainer">
        <div className="MarkpromptChatViewChat">
          {showBack ? (
            <div className="MarkpromptChatViewNavigation">
              <button
                type="button"
                className="MarkpromptGhostButton"
                onClick={onDidPressBack}
              >
                <AccessibleIcon label="back">
                  <ChevronLeftIcon
                    style={{ width: 16, height: 16 }}
                    strokeWidth={2.5}
                  />
                </AccessibleIcon>
              </button>
            </div>
          ) : (
            // Keep this for the grid template rows layout
            <div />
          )}
          {!didAcceptDisclaimer && chatOptions?.disclaimerView ? (
            <div className="MarkpromptDisclaimerView">
              <div className="MarkpromptDisclaimerViewMessage">
                <RichText>{chatOptions.disclaimerView.message}</RichText>
                <button
                  className="MarkpromptButton"
                  data-variant="primary"
                  type="button"
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
              apiUrl={apiUrl}
              chatOptions={chatOptions}
              feedbackOptions={feedbackOptions}
              integrations={integrations}
              projectKey={projectKey}
              referencesOptions={referencesOptions}
              linkAs={linkAs}
              branding={branding}
            />
          )}
          <ChatViewForm
            activeView={activeView}
            chatOptions={chatOptions}
            minInputRows={minInputRows}
            submitOnEnter={submitOnEnter}
          />
        </div>
      </div>
    </div>
  );
}
