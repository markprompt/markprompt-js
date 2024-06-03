import type { ReactElement } from 'react';

import type { ChatViewMessage } from './store.js';
import { UserIcon } from '../icons.js';
import type { MarkpromptOptions } from '../types.js';

interface MessagePromptProps {
  children: string;
  state: ChatViewMessage['state'];
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  referencesOptions?: MarkpromptOptions['references'];
}

export function MessagePrompt(props: MessagePromptProps): ReactElement {
  const { children, chatOptions, state } = props;
  return (
    <div className="MarkpromptMessagePrompt" data-loading-state={state}>
      {chatOptions.avatars?.visible && (
        <div className="MarkpromptMessageAvatarContainer">
          {!chatOptions.avatars?.user ? (
            <UserIcon className="MarkpromptMessageAvatar" data-type="icon" />
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
        </div>
      )}
      {/* Use a div instead of an H3, as often websites will have CSS rules
          that override the styles of such components. */}
      <div className="MarkpromptMessagePromptText">{children}</div>
    </div>
  );
}
