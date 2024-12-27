import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import type { ElementType, JSX } from 'react';

import { ChatIcon } from './icons.js';
import type { MarkpromptProps } from './Markprompt.js';
import { SearchBoxTrigger } from './search/SearchBoxTrigger.js';

type TriggerProps = Pick<
  MarkpromptProps,
  'display' | 'trigger' | 'children'
> & {
  hasMenu?: boolean;
  onClick?: () => void;
  Component: ElementType;
};

export function Trigger(props: TriggerProps): JSX.Element {
  const { display, trigger, hasMenu, Component, onClick, children } = props;

  return (
    <>
      {!trigger?.customElement && !children && display !== 'plain' && (
        // biome-ignore lint/complexity/noUselessFragments: This fragment is not useless
        <>
          {trigger?.floating !== false ? (
            <Component className="MarkpromptFloatingTrigger" onClick={onClick}>
              {trigger?.buttonLabel && <span>{trigger.buttonLabel}</span>}

              {trigger?.iconSrc ? (
                <img
                  className="MarkpromptChatIcon"
                  width="20"
                  height="20"
                  src={trigger.iconSrc}
                  alt={!trigger.buttonLabel ? (trigger?.label ?? '') : ''}
                />
              ) : (
                <AccessibleIcon label={trigger?.label ?? ''}>
                  <ChatIcon
                    className="MarkpromptChatIcon"
                    width="20"
                    height="20"
                    aria-hidden="true"
                  />
                </AccessibleIcon>
              )}
            </Component>
          ) : (
            <SearchBoxTrigger trigger={trigger} onClick={onClick} />
          )}
        </>
      )}

      {children && (display !== 'plain' || hasMenu) && (
        // todo: update element to button
        <div
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={(event) => {
            if (!onClick) return;
            if (event.key === 'Enter' || event.key === ' ') {
              onClick?.();
            }
          }}
        >
          {children}
        </div>
      )}
    </>
  );
}
