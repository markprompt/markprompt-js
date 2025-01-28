import type { JSX } from 'react';

import { UserIcon } from '../icons.js';
import type { ChatViewUserMessage, MarkpromptOptions } from '../types.js';

interface MessagePromptProps {
  chatOptions: NonNullable<MarkpromptOptions['chat']>;
  referencesOptions?: MarkpromptOptions['references'];
  message?: ChatViewUserMessage;
}

export function MessagePrompt(props: MessagePromptProps): JSX.Element {
  const { message, chatOptions } = props;
  return (
    <div
      className="MarkpromptMessagePrompt"
      data-loading-state={message?.state}
    >
      {chatOptions.avatars?.visible && (
        <div className="MarkpromptMessageAvatarContainer">
          {!chatOptions.avatars?.user ? (
            <UserIcon
              className="MarkpromptMessageAvatar"
              data-type="icon"
              role="img"
              aria-label="user"
            />
          ) : typeof chatOptions.avatars?.user === 'string' ? (
            <img
              src={chatOptions.avatars.user}
              className="MarkpromptMessageAvatar MarkpromptMessageAvatarImage"
              alt="user"
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
      {Array.isArray(message?.content) ? (
        message.content.map((part) => {
          if (part.type === 'text') {
            return (
              <div
                key={JSON.stringify(part)}
                className="MarkpromptMessagePromptText"
              >
                {part.text}
              </div>
            );
          }

          if (part.type === 'image_url') {
            return (
              <div
                key={JSON.stringify(part)}
                className="MarkpromptMessagePromptImage"
              >
                <img src={part.image_url.url} alt="user uploaded" />
              </div>
            );
          }

          // todo: add support for type = 'input_audio'
          return null;
        })
      ) : (
        <div className="MarkpromptMessagePromptText">
          {message?.content ?? ''}
        </div>
      )}
    </div>
  );
}
