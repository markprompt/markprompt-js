import React from 'react';

import { selectProjectConversations, useChatStore } from './store';
import { PlusIcon } from '../icons';
import { markdownToString } from '../utils';

export function ConversationSidebar(): JSX.Element {
  const selectedConversationId = useChatStore((state) => state.conversationId);
  const conversations = useChatStore(selectProjectConversations);
  const selectConversation = useChatStore((state) => state.selectConversation);

  return (
    <aside className="MarkpromptChatViewSidebar">
      <p className="MarkpromptChatViewSidebarTitle">
        <strong>Chats</strong>
      </p>
      <ul className="MarkpromptChatConversationList">
        <li className="MarkpromptChatConversationListItem">
          <button onClick={() => selectConversation(undefined)}>
            <p>
              <span className="MarkpromptNewChatOption">
                <PlusIcon className="MarkpromptNewChatIcon" /> New chat
              </span>
            </p>
          </button>
        </li>
        {conversations.map(([conversationId, { messages }]) => (
          <li
            key={conversationId}
            data-selected={selectedConversationId === conversationId}
            className="MarkpromptChatConversationListItem"
          >
            <button onClick={() => selectConversation(conversationId)}>
              <p>
                <strong>
                  {messages[0]?.content ?? 'Unknown conversation'}
                </strong>
              </p>
              <p>{markdownToString(messages[1]?.content ?? undefined, 70)}</p>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
