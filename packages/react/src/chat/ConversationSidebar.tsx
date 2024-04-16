import { useMemo } from 'react';

import { selectProjectConversations, useChatStore } from './store.js';
import { PlusIcon } from '../icons.js';
import type { MarkpromptOptions } from '../index.js';
import { markdownToString } from '../utils.js';

export interface ConversationSidebarProps {
  /**
   * The way to display the chat/search content.
   * @default "dialog"
   **/
  display?: MarkpromptOptions['display'];
}

export function ConversationSidebar(
  props: ConversationSidebarProps,
): JSX.Element {
  const selectedConversationId = useChatStore((state) => state.conversationId);
  const conversations = useChatStore(selectProjectConversations);
  const selectConversation = useChatStore((state) => state.selectConversation);

  const sortedConversations = useMemo(() => {
    if (props.display === 'plain') {
      return conversations.slice().reverse();
    }
    return conversations;
  }, [conversations, props.display]);

  return (
    <aside className="MarkpromptChatViewSidebar">
      <p className="MarkpromptChatViewSidebarTitle">
        <strong>Chats</strong>
      </p>
      <ul className="MarkpromptChatConversationList">
        <li className="MarkpromptChatConversationListItem">
          <button onClick={() => selectConversation(undefined)}>
            <span className="MarkpromptNewChatOption">
              <PlusIcon className="MarkpromptNewChatIcon" /> New chat
            </span>
          </button>
        </li>
        {sortedConversations.map(([conversationId, { messages }], index) => (
          <li
            key={`${conversationId}-${index}`}
            data-selected={selectedConversationId === conversationId}
            className="MarkpromptChatConversationListItem"
          >
            <button onClick={() => selectConversation(conversationId)}>
              <p>
                <strong>
                  {messages[0]?.content ?? 'Unknown conversation'}
                </strong>
              </p>
              {messages[1]?.content && (
                <p>{markdownToString(messages[1]?.content, 70)}</p>
              )}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
