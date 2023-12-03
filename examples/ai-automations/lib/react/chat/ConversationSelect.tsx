import React from 'react';

import { selectProjectConversations, useChatStore } from './store';
import { CounterClockwiseClockIcon, PlusIcon } from '../icons';
import { Select } from '../primitives/Select';

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
          label: messages[0]?.content ?? '',
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
        if ('children' in item!) return item.children;
        return item!.label;
      }}
      onSelectedItemChange={({ selectedItem }) => {
        selectConversation(
          selectedItem!.value === 'new' ? undefined : selectedItem!.value,
        );
      }}
    />
  );
}
