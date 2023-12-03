/* eslint-disable @next/next/no-img-element */
import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import * as Tabs from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import Emittery from 'emittery';
import { MessageCircle } from 'lucide-react';
import { useEffect, useState, type ReactElement, useMemo } from 'react';

import { ChatView } from './chat/ChatView';
import { DEFAULT_MARKPROMPT_OPTIONS } from './constants';
import { SparklesIcon } from './icons';
import * as BaseMarkprompt from './primitives/headless';
import { PromptView } from './prompt/PromptView';
import { SearchView } from './search/SearchView';
import { type MarkpromptOptions } from './types';
import { useDefaults } from './useDefaults';
import { useViews, type View } from './useViews';
import { companyData } from '../constants';

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

/**
 * Close Markprompt programmatically. Useful for building a custom trigger
 * or closing the Markprompt dialog in response to other user actions.
 */
function closeMarkprompt(): void {
  emitter.emit('close');
}

function Markprompt(props: MarkpromptProps): JSX.Element {
  const { projectKey, onDidRequestOpenChange, ...dialogProps } = props;

  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey prop to <Markprompt />.',
    );
  }

  const {
    display,
    defaultView,
    close,
    description,
    feedback,
    chat,
    prompt,
    references,
    search,
    trigger,
    title,
    showBranding,
    debug,
  }: MarkpromptOptions = useDefaults(
    {
      display: props.display,
      defaultView: props.defaultView,
      close: props.close,
      description: props.description,
      feedback: props.feedback,
      chat: props.chat,
      prompt: props.prompt,
      references: props.references,
      search: props.search,
      trigger: props.trigger,
      title: props.title,
      showBranding: props.showBranding,
      debug: props.debug,
    },
    DEFAULT_MARKPROMPT_OPTIONS,
  );

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
      onOpenChange={(open) => {
        onDidRequestOpenChange?.(open);
        setOpen(open);
      }}
      {...dialogProps}
    >
      {!trigger?.customElement && display === 'dialog' && (
        <>
          <BaseMarkprompt.DialogTrigger className="MarkpromptFloatingTrigger flex flex-row items-center gap-2 px-6 py-3 active:scale-95 transform transition">
            <AccessibleIcon.Root label={trigger!.label!}>
              <MessageCircle
                className="MarkpromptChatIcon"
                width="24"
                height="24"
              />
            </AccessibleIcon.Root>
            <p className="text-base font-semibold">Chat</p>
          </BaseMarkprompt.DialogTrigger>
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
              <BaseMarkprompt.Title hide={title?.hide}>
                {title!.text}
              </BaseMarkprompt.Title>

              {description?.text && (
                <BaseMarkprompt.Description hide={description.hide}>
                  {description.text}
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
    close,
    debug,
    defaultView,
    feedback,
    projectKey,
    chat,
    prompt,
    references,
    search,
  } = props;

  const { activeView, setActiveView } = useViews({ search, chat }, defaultView);

  if (!search?.enabled) {
    return (
      <div className="MarkpromptTabsContainer">
        <div className="bg-blue-500 p-6">
          <img
            src={`/logos/${companyData.id}/icon-white.svg`}
            alt={`${companyData.name} Logo`}
            className="dark:invert h-6"
          />
        </div>
        {/* We still include a div to preserve the grid-template-rows rules */}
        {/* <div></div> */}

        <div className="MarkpromptViews">
          <div
            style={{
              position: 'absolute',
              inset: 0,
            }}
          >
            {chat?.enabled ? (
              <ChatView
                activeView={activeView}
                chatOptions={chat}
                debug={debug}
                feedbackOptions={feedback}
                onDidSelectReference={() => emitter.emit('close')}
                projectKey={projectKey}
                referencesOptions={references}
              />
            ) : (
              <PromptView
                activeView={activeView}
                debug={debug}
                feedbackOptions={feedback}
                onDidSelectReference={() => emitter.emit('close')}
                projectKey={projectKey}
                promptOptions={prompt}
                referencesOptions={references}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Tabs.Root
      className="MarkpromptTabsContainer"
      value={activeView}
      onValueChange={(value) => setActiveView(value as View)}
    >
      <div style={{ position: 'relative' }}>
        <Tabs.List className="MarkpromptTabsList">
          <Tabs.Trigger
            value="search"
            aria-label={search.tabLabel}
            className="MarkpromptTab"
          >
            {search.tabLabel}
          </Tabs.Trigger>
          {!chat?.enabled && (
            <Tabs.Trigger
              value="prompt"
              className="MarkpromptTab"
              onClick={() => setActiveView('prompt')}
            >
              <SparklesIcon
                focusable={false}
                className={clsx('MarkpromptBaseIcon', {
                  MarkpromptPrimaryIcon: activeView === 'prompt',
                  MarkpromptHighlightedIcon: activeView === 'search',
                })}
              />
              {prompt!.tabLabel}
            </Tabs.Trigger>
          )}
          {chat?.enabled && (
            <Tabs.Trigger
              value="chat"
              className="MarkpromptTab"
              onClick={() => setActiveView('chat')}
            >
              <SparklesIcon
                focusable={false}
                className={clsx('MarkpromptBaseIcon', {
                  MarkpromptPrimaryIcon: activeView === 'chat',
                  MarkpromptHighlightedIcon: activeView === 'search',
                })}
              />
              {chat?.tabLabel}
            </Tabs.Trigger>
          )}
        </Tabs.List>

        {/* Add close button in the tab bar */}
        {close?.visible && (
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
              <AccessibleIcon.Root label={close!.label!}>
                <kbd>Esc</kbd>
              </AccessibleIcon.Root>
            </BaseMarkprompt.Close>
          </div>
        )}
      </div>

      <div className="MarkpromptViews">
        <Tabs.Content
          value="search"
          style={{
            position: 'absolute',
            inset: 0,
          }}
        >
          <SearchView
            activeView={activeView}
            projectKey={projectKey}
            searchOptions={search}
            onDidSelectResult={() => emitter.emit('close')}
            debug={debug}
          />
        </Tabs.Content>

        {chat?.enabled ? (
          <Tabs.Content
            value="chat"
            style={{
              position: 'absolute',
              inset: 0,
            }}
          >
            <ChatView
              activeView={activeView}
              chatOptions={chat}
              debug={debug}
              feedbackOptions={feedback}
              onDidSelectReference={() => emitter.emit('close')}
              projectKey={projectKey}
              referencesOptions={references}
            />
          </Tabs.Content>
        ) : (
          <Tabs.Content
            value="prompt"
            style={{
              position: 'absolute',
              inset: 0,
            }}
          >
            <PromptView
              activeView={activeView}
              debug={debug}
              feedbackOptions={feedback}
              onDidSelectReference={() => emitter.emit('close')}
              projectKey={projectKey}
              promptOptions={prompt}
              referencesOptions={references}
            />
          </Tabs.Content>
        )}
      </div>
    </Tabs.Root>
  );
}

export { Markprompt, closeMarkprompt, openMarkprompt, type MarkpromptProps };
