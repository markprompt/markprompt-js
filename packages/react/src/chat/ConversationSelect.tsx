import React from 'react';

import { selectProjectConversations, useChatStore } from './store.js';
import { CounterClockwiseClockIcon, PlusIcon } from '../icons.js';
import { Select } from '../primitives/Select.js';

export function ConversationSelect(): JSX.Element {
  const conversations = useChatStore(selectProjectConversations);
  const selectConversation = useChatStore((state) => state.selectConversation);

  return (
    <Select
      className="MarkpromptConversationSelect"
      label="Select previous conversation"
      toggle={
        <CounterClockwiseClockIcon
          aria-hidden
          focusable={false}
          className={'MarkpromptSearchIcon'}
        />
      }
      items={[
        ...conversations.map(([conversationId, { messages }]) => ({
          value: conversationId,
          label: messages[0]?.prompt ?? 'Unknown conversation',
        })),
        {
          value: 'new',
          label: 'Start new chat',
          children: (
            <span className="MarkpromptNewChatOption">
              <PlusIcon
                className="MarkpromptNewChatIcon"
                aria-hidden
                focusable={false}
              />{' '}
              New chat
            </span>
          ),
        },
      ]}
      itemToString={(item) => item?.label ?? ''}
      itemToChildren={(item) => {
        if (!item) return '';
        if ('children' in item) return item.children;
        return item.label;
      }}
      onSelectedItemChange={({ selectedItem }) => {
        if (!selectedItem) return;

        selectConversation(
          selectedItem.value === 'new' ? undefined : selectedItem.value,
        );
      }}
    />
  );
}
