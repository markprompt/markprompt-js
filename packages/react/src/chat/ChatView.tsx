import defaults from 'defaults';
import React, { useMemo } from 'react';

import { ChatViewForm } from './ChatViewForm.js';
import { ConversationSidebar } from './ConversationSidebar.js';
import { Messages } from './Messages.js';
import { ChatProvider } from './store.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import type { MarkpromptOptions } from '../types.js';
import type { View } from '../useViews.js';

export interface ChatViewProps {
  activeView?: View;
  chatOptions?: MarkpromptOptions['chat'];
  debug?: boolean;
  feedbackOptions?: MarkpromptOptions['feedback'];
  onDidSelectReference?: () => void;
  projectKey: string;
  referencesOptions?: MarkpromptOptions['references'];
}

export function ChatView(props: ChatViewProps): JSX.Element {
  const { activeView, debug, projectKey } = props;

  // we are also merging defaults in the Markprompt component, but this makes sure
  // that standalone ChatView components also have defaults as expected.
  const chatOptions = useMemo(
    () => defaults({ ...props.chatOptions }, DEFAULT_MARKPROMPT_OPTIONS.chat),
    [props.chatOptions],
  );

  const feedbackOptions = useMemo(
    () =>
      defaults(
        { ...props.feedbackOptions },
        DEFAULT_MARKPROMPT_OPTIONS.feedback,
      ),
    [props.feedbackOptions],
  );

  const referencesOptions = useMemo(
    () =>
      defaults(
        { ...props.referencesOptions },
        DEFAULT_MARKPROMPT_OPTIONS.references,
      ),
    [props.referencesOptions],
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
          <Messages
            projectKey={projectKey}
            feedbackOptions={feedbackOptions}
            referencesOptions={referencesOptions}
          />
          <ChatViewForm activeView={activeView} chatOptions={chatOptions} />
        </div>
      </div>
    </ChatProvider>
  );
}
