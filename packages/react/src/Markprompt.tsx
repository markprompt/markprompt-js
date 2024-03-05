import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import * as Tabs from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import Emittery from 'emittery';
import {
  lazy,
  Suspense,
  useEffect,
  useState,
  useTransition,
  type ReactElement,
} from 'react';

import { ChatView } from './chat/ChatView.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { CreateTicketView } from './CreateTicketView.js';
import { ChatIcon, CloseIcon, SparklesIcon } from './icons.js';
import { ChatProvider, useChatStore } from './index.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { SearchBoxTrigger } from './search/SearchBoxTrigger.js';
import { GlobalStoreProvider, useGlobalStore } from './store.js';
import { type MarkpromptOptions, type View } from './types.js';
import { useDefaults } from './useDefaults.js';
import { useMediaQuery } from './useMediaQuery.js';
import { getDefaultView } from './utils.js';

const SearchView = lazy(() =>
  import('./search/SearchView.js').then((m) => ({ default: m.SearchView })),
);

type MarkpromptProps = MarkpromptOptions &
  Omit<
    BaseMarkprompt.RootProps,
    'activeView' | 'open' | 'onOpenChange' | 'promptOptions' | 'searchOptions'
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
    sticky,
    defaultView,
    close,
    description,
    feedback,
    chat,
    references,
    search,
    trigger,
    title,
    branding,
    linkAs,
    layout,
    debug,
    integrations,
    children,
  }: MarkpromptOptions = useDefaults(
    {
      display: props.display,
      sticky: props.sticky,
      defaultView: getDefaultView(props.defaultView, props),
      close: props.close,
      description: props.description,
      feedback: props.feedback,
      chat: props.chat,
      references: props.references,
      search: props.search,
      trigger: props.trigger,
      title: props.title,
      branding: props.branding || { show: props.showBranding },
      layout: props.layout,
      linkAs: props.linkAs,
      debug: props.debug,
      children: props.children,
      integrations: props.integrations,
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
    <GlobalStoreProvider
      options={{
        branding,
        chat,
        close,
        debug,
        defaultView,
        description,
        display,
        feedback,
        integrations,
        layout,
        linkAs,
        projectKey,
        references,
        search,
        sticky,
        title,
        trigger,
      }}
    >
      <ChatProvider chatOptions={chat} debug={debug} projectKey={projectKey}>
        <BaseMarkprompt.Root
          display={display}
          open={open}
          onOpenChange={(open) => {
            onDidRequestOpenChange?.(open);
            setOpen(open);
          }}
          {...dialogProps}
        >
          {!trigger?.customElement && !children && display === 'dialog' && (
            <>
              {trigger?.floating !== false ? (
                <BaseMarkprompt.DialogTrigger className="MarkpromptFloatingTrigger">
                  {trigger.buttonLabel && <span>{trigger.buttonLabel}</span>}
                  <AccessibleIcon.Root label={trigger.label!}>
                    {trigger.iconSrc ? (
                      <img
                        className="MarkpromptChatIcon"
                        width="24"
                        height="24"
                        src={trigger.iconSrc}
                      />
                    ) : (
                      <ChatIcon
                        className="MarkpromptChatIcon"
                        width="24"
                        height="24"
                      />
                    )}
                  </AccessibleIcon.Root>
                </BaseMarkprompt.DialogTrigger>
              ) : (
                <SearchBoxTrigger
                  trigger={trigger}
                  setOpen={setOpen}
                  open={open}
                />
              )}
            </>
          )}

          {children && display === 'dialog' && (
            <BaseMarkprompt.DialogTrigger asChild>
              {children}
            </BaseMarkprompt.DialogTrigger>
          )}

          {display === 'dialog' && (
            <>
              <BaseMarkprompt.Portal>
                {!sticky && (
                  <BaseMarkprompt.Overlay className="MarkpromptOverlay" />
                )}
                <BaseMarkprompt.Content
                  className="MarkpromptContentDialog"
                  footerClassName="MarkpromptFooter"
                  branding={branding}
                  showAlgolia={
                    search?.enabled && search.provider?.name === 'algolia'
                  }
                  onPointerDownOutside={
                    sticky
                      ? (e) => {
                          e.preventDefault();
                        }
                      : undefined
                  }
                >
                  <BaseMarkprompt.Title hide={title.hide}>
                    {title.text}
                  </BaseMarkprompt.Title>

                  {description.text && (
                    <BaseMarkprompt.Description hide={description.hide}>
                      {description.text}
                    </BaseMarkprompt.Description>
                  )}

                  <MarkpromptContent
                    close={close}
                    chat={chat}
                    debug={debug}
                    feedback={feedback}
                    integrations={integrations}
                    projectKey={projectKey}
                    references={references}
                    search={search}
                    layout={layout}
                    linkAs={linkAs}
                  />
                </BaseMarkprompt.Content>
              </BaseMarkprompt.Portal>
            </>
          )}

          {display === 'plain' && (
            <BaseMarkprompt.PlainContent
              className="MarkpromptContentPlain"
              branding={branding}
              showAlgolia={
                search?.enabled && search.provider?.name === 'algolia'
              }
            >
              <MarkpromptContent
                chat={chat}
                feedback={feedback}
                integrations={integrations}
                layout={layout}
                linkAs={linkAs}
                projectKey={projectKey}
                references={references}
                search={search}
              />
            </BaseMarkprompt.PlainContent>
          )}
        </BaseMarkprompt.Root>
      </ChatProvider>
    </GlobalStoreProvider>
  );
}

interface MarkpromptContentProps {
  projectKey: string;
  chat?: MarkpromptOptions['chat'];
  close?: MarkpromptOptions['close'];
  debug?: boolean;
  layout?: MarkpromptOptions['layout'];
  feedback?: MarkpromptOptions['feedback'];
  references?: MarkpromptOptions['references'];
  search?: MarkpromptOptions['search'];
  linkAs?: MarkpromptOptions['linkAs'];
  integrations?: MarkpromptOptions['integrations'];
}

function MarkpromptContent(props: MarkpromptContentProps): ReactElement {
  const {
    chat,
    close,
    debug,
    feedback,
    integrations,
    layout,
    linkAs,
    projectKey,
    references,
    search,
  } = props;

  const activeView = useGlobalStore((state) => state.activeView);
  const setActiveView = useGlobalStore((state) => state.setActiveView);
  const submitChat = useChatStore((state) => state.submitChat);
  const isTouchDevice = useMediaQuery('(pointer: coarse)');
  const messages = useChatStore((state) => state.messages);
  const conversationId = useChatStore((state) => state.conversationId);
  const createTicketSummary = useGlobalStore(
    (state) => state.tickets?.createTicketSummary,
  );
  const [, startTransition] = useTransition();

  async function handleCreateTicket(): Promise<void> {
    if (!integrations?.createTicket?.enabled) return;

    setActiveView('create-ticket');

    if (conversationId && messages.length > 0) {
      startTransition(() => {
        createTicketSummary?.(conversationId, messages);
      });
    }
  }

  if (!search?.enabled) {
    return (
      <div className="MarkpromptTabsContainer">
        {/* We still include a div to preserve the grid-template-rows rules */}
        <div></div>

        <div className="MarkpromptViews">
          <div
            style={{
              position: 'absolute',
              inset: 0,
            }}
          >
            {close?.visible && (
              <div
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '0.5rem',
                  zIndex: 10,
                }}
              >
                <BaseMarkprompt.Close className="MarkpromptClose">
                  <AccessibleIcon.Root label={close!.label!}>
                    {isTouchDevice || close.hasIcon ? (
                      <CloseIcon width={20} height={20} />
                    ) : (
                      <kbd>Esc</kbd>
                    )}
                  </AccessibleIcon.Root>
                </BaseMarkprompt.Close>
              </div>
            )}
            {chat?.enabled && (
              <ChatView
                activeView={activeView}
                chatOptions={chat}
                debug={debug}
                feedbackOptions={feedback}
                integrations={integrations}
                handleCreateTicket={handleCreateTicket}
                projectKey={projectKey}
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
      {layout === 'tabs' ? (
        <div style={{ position: 'relative' }}>
          <Tabs.List className="MarkpromptTabsList">
            {search.enabled && (
              <Tabs.Trigger
                value="search"
                aria-label={search.tabLabel}
                className="MarkpromptTab"
              >
                {search.tabLabel}
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
                right: '0.5rem',
                top: '0rem',
                bottom: '0rem',
              }}
            >
              <BaseMarkprompt.Close
                className="MarkpromptClose"
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '0rem',
                  bottom: '0rem',
                }}
              >
                <AccessibleIcon.Root label={close!.label!}>
                  {isTouchDevice ? (
                    <CloseIcon width={20} height={20} />
                  ) : (
                    <kbd>Esc</kbd>
                  )}
                </AccessibleIcon.Root>
              </BaseMarkprompt.Close>
            </div>
          )}
        </div>
      ) : (
        // We still include a div to preserve the grid-template-rows rules
        <div></div>
      )}

      <div className="MarkpromptViews">
        {search.enabled && (
          <Tabs.Content
            value="search"
            style={{
              position: 'absolute',
              inset: 0,
            }}
          >
            <Suspense fallback={null}>
              <SearchView
                activeView={activeView}
                projectKey={projectKey}
                layout={layout}
                searchOptions={search}
                linkAs={linkAs}
                onDidSelectResult={() => emitter.emit('close')}
                onDidSelectAsk={(query?: string) => {
                  setActiveView('chat');
                  if (query) {
                    submitChat([{ role: 'user', content: query }]);
                  }
                }}
                debug={debug}
              />
            </Suspense>
          </Tabs.Content>
        )}

        {chat?.enabled && (
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
              integrations={integrations}
              onDidPressBack={() => setActiveView('search')}
              handleCreateTicket={handleCreateTicket}
              projectKey={projectKey}
              referencesOptions={references}
              showBack={layout === 'panels'}
              linkAs={linkAs}
            />
          </Tabs.Content>
        )}

        {integrations?.createTicket?.enabled && (
          <Tabs.Content
            value="create-ticket"
            style={{ position: 'absolute', inset: 0 }}
          >
            <CreateTicketView
              createTicketOptions={integrations.createTicket}
              handleGoBack={() => setActiveView('chat')}
            />
          </Tabs.Content>
        )}
      </div>
    </Tabs.Root>
  );
}

export { closeMarkprompt, Markprompt, openMarkprompt, type MarkpromptProps };
