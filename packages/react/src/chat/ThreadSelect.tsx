import { selectProjectThreads, useChatStore } from './store.js';
import { CounterClockwiseClockIcon, PlusIcon } from '../icons.js';
import { Select } from '../primitives/Select.js';

export function ThreadSelect({
  disabled,
}: {
  disabled?: boolean;
}): JSX.Element {
  const threads = useChatStore(selectProjectThreads);
  const selectThread = useChatStore((state) => state.selectThread);

  return (
    <Select
      className="MarkpromptThreadSelect"
      label="Select previous thread"
      disabled={disabled}
      toggle={
        <CounterClockwiseClockIcon
          aria-hidden
          focusable={false}
          className={'MarkpromptSearchIcon'}
        />
      }
      items={[
        ...threads.map(([threadId, { messages }]) => ({
          value: threadId,
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
      itemToString={(item) => item?.value ?? ''}
      itemToChildren={(item) => {
        if ('children' in item!) return item.children;
        return item?.label;
      }}
      onSelectedItemChange={({ selectedItem }) => {
        selectThread(
          selectedItem?.value === 'new' ? undefined : selectedItem?.value,
        );
      }}
    />
  );
}
