import { getMessageTextContent } from '@markprompt/core/utils';
import { useMemo, type JSX } from 'react';

import { selectProjectThreads, useChatStore } from './store.js';
import { PlusIcon } from '../icons.js';
import type { MarkpromptDisplay } from '../types.js';
import { markdownToString } from '../utils.js';

export interface ThreadSidebarProps {
  /**
   * The way to display the chat/search content.
   * @default "dialog"
   **/
  display?: MarkpromptDisplay;
}

export function ThreadSidebar(props: ThreadSidebarProps): JSX.Element {
  const selectedThreadId = useChatStore((state) => state.threadId);
  const threads = useChatStore(selectProjectThreads);
  const selectThread = useChatStore((state) => state.selectThread);

  const sortedThreads = useMemo(() => {
    if (props.display === 'plain') {
      return threads.slice().reverse();
    }
    return threads;
  }, [threads, props.display]);

  return (
    <aside className="MarkpromptChatViewSidebar">
      <p className="MarkpromptChatViewSidebarTitle">
        <strong>Chats</strong>
      </p>
      <ul className="MarkpromptChatThreadList">
        <li className="MarkpromptChatThreadListItem">
          <button onClick={() => selectThread(undefined)} type="button">
            <span className="MarkpromptNewChatOption">
              <PlusIcon className="MarkpromptNewChatIcon" aria-hidden /> New
              chat
            </span>
          </button>
        </li>
        {sortedThreads.map(([threadId, { messages }]) => (
          <li
            key={threadId}
            data-selected={selectedThreadId === threadId}
            className="MarkpromptChatThreadListItem"
          >
            <button onClick={() => selectThread(threadId)} type="button">
              <p>
                <strong>
                  {getMessageTextContent(messages[0]) ?? 'Unknown thread'}
                </strong>
              </p>
              {typeof messages[1]?.content === 'string' && (
                <p>{markdownToString(messages[1]?.content, 70)}</p>
              )}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
