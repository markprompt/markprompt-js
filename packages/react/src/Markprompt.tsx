import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import { clsx } from 'clsx';
import Emittery from 'emittery';
import React, { useEffect, useState, type ReactElement, useMemo } from 'react';

import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { useMarkpromptContext } from './context.js';
import { ChatIcon, SparklesIcon } from './icons.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { PromptView } from './PromptView.js';
import { SearchBoxTrigger } from './SearchBoxTrigger.js';
import { SearchView } from './SearchView.js';
import { type MarkpromptOptions } from './types.js';

type MarkpromptProps = MarkpromptOptions &
  Omit<
    BaseMarkprompt.RootProps,
    | 'activeView'
    | 'children'
    | 'onOpenChange'
    | 'open'
    | 'promptOptions'
    | 'searchOptions'
  > & {
    projectKey: string;
  };

const emitter = new Emittery<{ open: undefined; close: undefined }>();

/**
 * Open Markprompt programmatically. Useful for building a custom trigger
 * or opening the Markprompt dialog in response to other user actions.
 */
function openMarkprompt(): void {
  emitter.emit('open');
}

function Markprompt(props: MarkpromptProps): ReactElement {
  const {
    close,
    debug,
    description,
    display = 'dialog',
    projectKey,
    prompt,
    references,
    search,
    showBranding,
    title,
    trigger,
    ...dialogProps
  } = props;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (display !== 'dialog') {
      return;
    }

    const onOpen = (): void => setOpen(true);
    const onClose = (): void => setOpen(false);

    emitter.on('open', onOpen);
    emitter.on('close', onClose);

    return () => {
      emitter.off('open', onOpen);
      emitter.off('close', onClose);
    };
  }, [trigger?.customElement, display]);

  return (
    <BaseMarkprompt.Root
      projectKey={projectKey}
      display={display}
      promptOptions={prompt}
      searchOptions={search}
      open={open}
      onOpenChange={setOpen}
      debug={debug}
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
                prompt={prompt}
                references={references}
                search={search}
                close={close}
              />
            </BaseMarkprompt.Content>
          </BaseMarkprompt.Portal>
        </>
      )}

      {display === 'plain' && (
        <BaseMarkprompt.PlainContent
          className="MarkpromptContentPlain"
          showBranding={showBranding}
        >
          <MarkpromptContent
            prompt={prompt}
            search={search}
            references={references}
            close={close}
          />
        </BaseMarkprompt.PlainContent>
      )}
    </BaseMarkprompt.Root>
  );
}

type MarkpromptContentProps = {
  prompt: MarkpromptOptions['prompt'];
  references: MarkpromptOptions['references'];
  search: MarkpromptOptions['search'];
  close: MarkpromptOptions['close'];
};

function MarkpromptContent(props: MarkpromptContentProps): ReactElement {
  const { prompt, references, search, close: _close } = props;

  const { abort, activeView, setActiveView } = useMarkpromptContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (
        (event.key === 'Enter' && event.ctrlKey) ||
        (event.key === 'Enter' && event.metaKey)
      ) {
        event.preventDefault();
        if (activeView === 'prompt') {
          setActiveView('search');
        } else if (activeView === 'search') {
          setActiveView('prompt');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeView, setActiveView]);

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
              onClick={() => {
                abort();
                setActiveView('search');
              }}
            >
              {search.tabLabel || DEFAULT_MARKPROMPT_OPTIONS.search!.tabLabel}
            </button>
            <button
              className="MarkpromptTab"
              data-state={activeView === 'prompt' ? 'active' : ''}
              onClick={() => {
                abort();
                setActiveView('prompt');
              }}
            >
              <SparklesIcon
                focusable={false}
                className={clsx('MarkpromptBaseIcon', {
                  MarkpromptPrimaryIcon: activeView === 'prompt',
                  MarkpromptHighlightedIcon: activeView === 'search',
                })}
              />
              {prompt?.tabLabel || DEFAULT_MARKPROMPT_OPTIONS.prompt!.tabLabel}
            </button>
          </div>
          {/* Add close button in the tab bar */}
          {close?.visible !== false && (
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                justifyItems: 'center',
                alignItems: 'center',
                right: '0.75rem',
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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: activeView === 'search' ? 'block' : 'none',
          }}
        >
          <SearchView
            handleViewChange={() => setActiveView('prompt')}
            search={search}
            close={!search?.enabled ? close : undefined}
            onDidSelectResult={() => emitter.emit('close')}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: activeView === 'prompt' ? 'block' : 'none',
          }}
        >
          <PromptView
            prompt={prompt}
            references={references}
            close={!search?.enabled ? close : undefined}
            onDidSelectReference={() => emitter.emit('close')}
          />
        </div>
      </div>
    </div>
  );
}

export { Markprompt, openMarkprompt, type MarkpromptProps };
