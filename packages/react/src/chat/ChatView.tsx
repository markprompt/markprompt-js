import type {
  DefaultFunctionParameters,
  FunctionParameters,
} from '@markprompt/core';
import React from 'react';

import { ChatViewForm } from './ChatViewForm.js';
import { ConversationSidebar } from './ConversationSidebar.js';
import { Messages } from './Messages.js';
import { ChatProvider } from './store.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants.js';
import type {
  ChatOptions,
  FeedbackOptions,
  ReferencesOptions,
} from '../types.js';
import { useDefaults } from '../useDefaults.js';
import type { View } from '../useViews.js';

export interface ChatViewProps<
  T extends FunctionParameters = DefaultFunctionParameters,
> {
  activeView?: View;
  chatOptions?: ChatOptions<T>;
  debug?: boolean;
  feedbackOptions?: FeedbackOptions;
  onDidSelectReference?: () => void;
  projectKey: string;
  referencesOptions?: ReferencesOptions;
}

export function ChatView<
  T extends FunctionParameters = DefaultFunctionParameters,
>(props: ChatViewProps<T>): JSX.Element {
  const { activeView, debug, projectKey } = props;

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
          <Messages
            projectKey={projectKey}
            feedbackOptions={feedbackOptions}
            referencesOptions={referencesOptions}
            defaultView={chatOptions.defaultView}
          />
          <ChatViewForm activeView={activeView} chatOptions={chatOptions} />
        </div>
      </div>
    </ChatProvider>
  );
}
