import { type ReactElement } from 'react';

import { type ChatViewMessage } from './store.js';
import type { MarkpromptOptions } from '../types.js';
import { UserIcon } from '../icons.js';

interface MessagePromptProps {
  children: string;
  state: ChatViewMessage['state'];
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  referencesOptions?: MarkpromptOptions['references'];
}

export function MessagePrompt(props: MessagePromptProps): ReactElement {
  const { children, chatOptions, referencesOptions, state } = props;
  return (
    <div className="MarkpromptMessagePrompt" data-loading-state={state}>
      {chatOptions.avatars?.visible && (
        <>
          {!chatOptions.avatars?.user ? (
            <UserIcon className="MarkpromptMessageAvatar" />
          ) : typeof chatOptions.avatars?.user === 'string' ? (
            <img
              src={chatOptions.avatars.user}
              className="MarkpromptMessageAvatar MarkpromptMessageAvatarImage"
            />
          ) : (
            <div className="MarkpromptMessageAvatar">
              <chatOptions.avatars.user className="MarkpromptMessageAvatar" />
            </div>
          )}
        </>
      )}
      <h3 className="MarkpromptMessagePromptText">{children}</h3>
    </div>
  );
}
