import React from 'react';

import { useChatStore } from './store.js';
import { CounterClockwiseClockIcon, PlusIcon } from '../icons.js';
import { Select } from '../primitives/Select.js';

export function ConversationSelect(): JSX.Element {
  const conversations = useChatStore((state) => {
    const projectKey = state.projectKey;

    const conversationIds = state.conversationIdsByProjectKey[projectKey];
    if (!conversationIds || conversationIds.length === 0) return [];

    const messagesByConversationId = Object.entries(
      state.messagesByConversationId,
    )
      .filter(([id]) => conversationIds.includes(id))
      // ascending order, so the newest conversation will be closest to the dropdown toggle
      .sort(([, { lastUpdated: a }], [, { lastUpdated: b }]) =>
        a.localeCompare(b),
      );

    if (!messagesByConversationId) return [];

    return messagesByConversationId;
  });

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
              <PlusIcon className="MarkpromptNewChatIcon" /> New chat
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
