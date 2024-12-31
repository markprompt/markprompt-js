import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import type { ElementType, JSX, ReactNode } from 'react';

import { ChatIcon } from './icons.js';
import { SearchBoxTrigger } from './search/SearchBoxTrigger.js';
import type { MarkpromptDisplay, TriggerOptions } from './types.js';

interface TriggerProps {
  display: MarkpromptDisplay;
  trigger: TriggerOptions;
  children: ReactNode;
  hasMenu?: boolean;
  onClick?: () => void;
  Component: ElementType;
}

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
