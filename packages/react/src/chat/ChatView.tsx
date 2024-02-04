import { ChatViewForm } from './ChatViewForm.js';
import { ConversationSidebar } from './ConversationSidebar.js';
import { Messages } from './Messages.js';
import { ChatProvider } from './store.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import type { MarkpromptOptions } from '../types.js';
import { useDefaults } from '../useDefaults.js';
import type { View } from '../useViews.js';
import { ChevronLeftIcon } from '../icons.js';

export interface ChatViewProps {
  activeView?: View;
  chatOptions?: MarkpromptOptions['chat'];
  debug?: boolean;
  feedbackOptions?: MarkpromptOptions['feedback'];
  projectKey: string;
  referencesOptions?: MarkpromptOptions['references'];
  showBack?: boolean;
  onDidSelectReference?: () => void;
  onDidPressBack?: () => void;
}

export function ChatView(props: ChatViewProps): JSX.Element {
  const { activeView, debug, projectKey, showBack, onDidPressBack } = props;

  if (!projectKey) {
    throw new Error(
      `Markprompt: a project key is required. Make sure to pass your Markprompt project key to <ChatView />.`,
    );
  }

  // we are also merging defaults in the Markprompt component, but this makes sure
  // that standalone ChatView components also have defaults as expected.
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

  return (
    <ChatProvider
      chatOptions={chatOptions}
      debug={debug}
      projectKey={projectKey}
    >
      <div className="MarkpromptChatView">
        <ConversationSidebar />
        <div className="MarkpromptChatViewChat">
          {showBack ? (
            <div className="MarkpromptChatViewNavigation">
              <button
                className="MarkpromptGhostButton"
                onClick={onDidPressBack}
              >
                <ChevronLeftIcon
                  style={{ width: 20, height: 20 }}
                  strokeWidth={2.5}
                />
              </button>
            </div>
          ) : (
            // Keep this for the grid template rows layout
            <div />
          )}
          <Messages
            chatOptions={chatOptions}
            feedbackOptions={feedbackOptions}
            projectKey={projectKey}
            referencesOptions={referencesOptions}
          />
          <ChatViewForm activeView={activeView} chatOptions={chatOptions} />
        </div>
      </div>
    </ChatProvider>
  );
}
