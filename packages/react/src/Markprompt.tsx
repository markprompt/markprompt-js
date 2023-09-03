import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import { clsx } from 'clsx';
import Emittery from 'emittery';
import React, { useEffect, useState, type ReactElement, useMemo } from 'react';

import { ChatView } from './chat/ChatView.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { ChatIcon, SparklesIcon } from './icons.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { PromptView } from './prompt/PromptView.js';
import { SearchBoxTrigger } from './search/SearchBoxTrigger.js';
import { SearchView } from './search/SearchView.js';
import { type MarkpromptOptions } from './types.js';
import { useViews } from './useViews.js';

type MarkpromptProps = MarkpromptOptions &
  Omit<
    BaseMarkprompt.RootProps,
    | 'activeView'
    | 'children'
    | 'open'
    | 'onOpenChange'
    | 'promptOptions'
    | 'searchOptions'
  > & {
    projectKey: string;
    onDidRequestOpenChange?: (open: boolean) => void;
  };

const emitter = new Emittery<{ open: undefined; close: undefined }>();

/**
 * Open Markprompt programmatically. Useful for building a custom trigger
 * or opening the Markprompt dialog in response to other user actions.
 */
function openMarkprompt(): void {
  emitter.emit('open');
}

function Markprompt(props: MarkpromptProps): JSX.Element {
  const {
    close,
    chat,
    debug,
    defaultView,
    description,
    display = 'dialog',
    projectKey,
    prompt,
    feedback,
    references,
    search,
    showBranding,
    title,
    trigger,
    onDidRequestOpenChange,
    ...dialogProps
  } = props;

  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey prop to <Markprompt />.',
    );
  }

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = (): void => {
      onDidRequestOpenChange?.(true);
      if (display === 'dialog') {
        setOpen(true);
      }
    };
    const onClose = (): void => {
      onDidRequestOpenChange?.(false);
      if (display === 'dialog') {
        setOpen(false);
      }
    };

    emitter.on('open', onOpen);
    emitter.on('close', onClose);

    return () => {
      emitter.off('open', onOpen);
      emitter.off('close', onClose);
    };
  }, [trigger?.customElement, display, onDidRequestOpenChange]);

  return (
    <BaseMarkprompt.Root
      display={display}
      open={open}
      onOpenChange={setOpen}
      {...dialogProps}
    >
      {!trigger?.customElement && display === 'dialog' && (
        <>
          {trigger?.floating !== false ? (
            <BaseMarkprompt.DialogTrigger className="MarkpromptFloatingTrigger">
              <AccessibleIcon.Root
                label={
                  trigger?.label ?? DEFAULT_MARKPROMPT_OPTIONS.trigger!.label!
                }
              >
                <ChatIcon
                  className="MarkpromptChatIcon"
                  width="24"
                  height="24"
                />
              </AccessibleIcon.Root>
            </BaseMarkprompt.DialogTrigger>
          ) : (
            <SearchBoxTrigger trigger={trigger} setOpen={setOpen} open={open} />
          )}
        </>
      )}

      {display === 'dialog' && (
        <>
          <BaseMarkprompt.Portal>
            <BaseMarkprompt.Overlay className="MarkpromptOverlay" />
            <BaseMarkprompt.Content
              className="MarkpromptContentDialog"
              showBranding={showBranding}
              showAlgolia={
                search?.enabled && search.provider?.name === 'algolia'
              }
            >
              <BaseMarkprompt.Title hide={title?.hide ?? true}>
                {title?.text ?? DEFAULT_MARKPROMPT_OPTIONS.prompt!.label}
              </BaseMarkprompt.Title>

              {description?.text && (
                <BaseMarkprompt.Description hide={description?.hide ?? true}>
                  {description?.text}
                </BaseMarkprompt.Description>
              )}

              <MarkpromptContent
                close={close}
                chat={chat}
                debug={debug}
                defaultView={defaultView}
                feedback={feedback}
                projectKey={projectKey}
                prompt={prompt}
                references={references}
                search={search}
              />
            </BaseMarkprompt.Content>
          </BaseMarkprompt.Portal>
        </>
      )}

      {display === 'plain' && (
        <BaseMarkprompt.PlainContent
          className="MarkpromptContentPlain"
          showBranding={showBranding}
          showAlgolia={search?.enabled && search.provider?.name === 'algolia'}
        >
          <MarkpromptContent
            chat={chat}
            defaultView={defaultView}
            feedback={feedback}
            projectKey={projectKey}
            prompt={prompt}
            references={references}
            search={search}
          />
        </BaseMarkprompt.PlainContent>
      )}
    </BaseMarkprompt.Root>
  );
}

interface MarkpromptContentProps {
  projectKey: string;
  chat?: MarkpromptOptions['chat'];
  close?: MarkpromptOptions['close'];
  debug?: boolean;
  defaultView?: MarkpromptOptions['defaultView'];
  feedback?: MarkpromptOptions['feedback'];
  prompt?: MarkpromptOptions['prompt'];
  references?: MarkpromptOptions['references'];
  search?: MarkpromptOptions['search'];
}

function MarkpromptContent(props: MarkpromptContentProps): ReactElement {
  const {
    close: _close,
    debug,
    defaultView,
    feedback,
    projectKey,
    chat,
    prompt,
    references,
    search,
  } = props;

  const { activeView, setActiveView, toggleActiveView } = useViews(
    { search, chat },
    defaultView,
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (
        (event.key === 'Enter' && event.ctrlKey) ||
        (event.key === 'Enter' && event.metaKey)
      ) {
        event.preventDefault();
        toggleActiveView();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleActiveView]);

  const close = useMemo(() => {
    return _close ?? DEFAULT_MARKPROMPT_OPTIONS.close;
  }, [_close]);

  return (
    <div className="MarkpromptTabsContainer">
      {search?.enabled ? (
        <div style={{ position: 'relative' }}>
          <div className="MarkpromptTabsList">
            <button
              aria-label={search.tabLabel}
              className="MarkpromptTab"
              data-state={activeView === 'search' ? 'active' : ''}
              onClick={() => setActiveView('search')}
            >
              {search.tabLabel || DEFAULT_MARKPROMPT_OPTIONS.search!.tabLabel}
            </button>
            {!chat?.enabled && (
              <button
                className="MarkpromptTab"
                data-state={activeView === 'prompt' ? 'active' : ''}
                onClick={() => setActiveView('prompt')}
              >
                <SparklesIcon
                  focusable={false}
                  className={clsx('MarkpromptBaseIcon', {
                    MarkpromptPrimaryIcon: activeView === 'prompt',
                    MarkpromptHighlightedIcon: activeView === 'search',
                  })}
                />
                {prompt?.tabLabel ||
                  DEFAULT_MARKPROMPT_OPTIONS.prompt!.tabLabel}
              </button>
            )}
            {chat?.enabled && (
              <button
                className="MarkpromptTab"
                data-state={activeView === 'chat' ? 'active' : ''}
                onClick={() => setActiveView('chat')}
              >
                <SparklesIcon
                  focusable={false}
                  className={clsx('MarkpromptBaseIcon', {
                    MarkpromptPrimaryIcon: activeView === 'chat',
                    MarkpromptHighlightedIcon: activeView === 'search',
                  })}
                />
                {prompt?.tabLabel ||
                  DEFAULT_MARKPROMPT_OPTIONS.prompt!.tabLabel}
              </button>
            )}
          </div>
          {/* Add close button in the tab bar */}
          {close?.visible !== false && (
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                justifyItems: 'center',
                alignItems: 'center',
                right: '0.5rem',
                top: '0rem',
                bottom: '0rem',
              }}
            >
              <BaseMarkprompt.Close className="MarkpromptClose">
                <AccessibleIcon.Root
                  label={
                    close?.label ?? DEFAULT_MARKPROMPT_OPTIONS.close!.label!
                  }
                >
                  <kbd>Esc</kbd>
                </AccessibleIcon.Root>
              </BaseMarkprompt.Close>
            </div>
          )}
        </div>
      ) : (
        // We still include a div to preserve the grid-template-rows rules
        <div />
      )}
      <div className="MarkpromptViews">
        {search?.enabled && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: activeView === 'search' ? 'block' : 'none',
            }}
          >
            <SearchView
              activeView={activeView}
              projectKey={projectKey}
              searchOptions={search}
              close={!search?.enabled ? close : undefined}
              onDidSelectResult={() => emitter.emit('close')}
              debug={debug}
            />
          </div>
        )}

        {chat?.enabled ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: activeView === 'chat' ? 'block' : 'none',
            }}
          >
            <ChatView
              activeView={activeView}
              chatOptions={chat}
              close={!search?.enabled ? close : undefined}
              debug={debug}
              feedbackOptions={feedback}
              onDidSelectReference={() => emitter.emit('close')}
              projectKey={projectKey}
              referencesOptions={references}
            />
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: activeView === 'prompt' ? 'block' : 'none',
            }}
          >
            <PromptView
              activeView={activeView}
              close={!search?.enabled ? close : undefined}
              debug={debug}
              feedbackOptions={feedback}
              onDidSelectReference={() => emitter.emit('close')}
              projectKey={projectKey}
              promptOptions={prompt}
              referencesOptions={references}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export { Markprompt, openMarkprompt, type MarkpromptProps };
