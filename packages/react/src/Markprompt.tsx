import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tabs from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import Emittery from 'emittery';
import {
  lazy,
  Suspense,
  useEffect,
  useState,
  type ReactElement,
  useCallback,
  type JSXElementConstructor,
  useMemo,
} from 'react';

import { ChatView } from './chat/ChatView.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { CreateTicketView } from './CreateTicketView.js';
import { ChatIcon, CloseIcon, SparklesIcon } from './icons.js';
import { ChatProvider, useChatStore } from './index.js';
import { Menu } from './Menu.js';
import * as BaseMarkprompt from './primitives/headless.js';
import { SearchBoxTrigger } from './search/SearchBoxTrigger.js';
import { GlobalStoreProvider, useGlobalStore } from './store.js';
import { TicketDeflectionForm } from './TicketDeflectionForm.js';
import type { MarkpromptOptions, View } from './types.js';
import { NavigationMenu } from './ui/navigation-menu.js';
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

const emitter = new Emittery<{ open: { view?: View }; close: undefined }>();

/**
 * Open Markprompt programmatically. Useful for building a custom trigger
 * or opening the Markprompt dialog in response to other user actions.
 */
function openMarkprompt(view?: View): void {
  emitter.emit('open', { view });
}

/**
 * Close Markprompt programmatically. Useful for building a custom trigger
 * or closing the Markprompt dialog in response to other user actions.
 */
function closeMarkprompt(): void {
  emitter.emit('close');
}

type TriggerProps = Pick<
  MarkpromptProps,
  'display' | 'trigger' | 'children'
> & {
  hasMenu?: boolean;
  onClick?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: string | JSXElementConstructor<any>;
};

function Trigger(props: TriggerProps): JSX.Element {
  const { display, trigger, hasMenu, Component, onClick, children } = props;

  return (
    <>
      {!trigger?.customElement && !children && display !== 'plain' && (
        <>
          {trigger?.floating !== false ? (
            <Component className="MarkpromptFloatingTrigger" onClick={onClick}>
              {trigger?.buttonLabel && <span>{trigger.buttonLabel}</span>}
              <AccessibleIcon.Root label={trigger?.label || ''}>
                {trigger?.iconSrc ? (
                  <img
                    className="MarkpromptChatIcon"
                    width="20"
                    height="20"
                    src={trigger.iconSrc}
                  />
                ) : (
                  <ChatIcon
                    className="MarkpromptChatIcon"
                    width="20"
                    height="20"
                  />
                )}
              </AccessibleIcon.Root>
            </Component>
          ) : (
            <SearchBoxTrigger trigger={trigger} onClick={onClick} />
          )}
        </>
      )}

      {children && (display !== 'plain' || hasMenu) && (
        <div onClick={onClick}>{children}</div>
      )}
    </>
  );
}

function Markprompt(props: MarkpromptProps): JSX.Element {
  const { projectKey, onDidRequestOpenChange, ...dialogProps } = props;

  if (!projectKey) {
    throw new Error(
      'Markprompt: a project key is required. Make sure to pass the projectKey prop to <Markprompt />.',
    );
  }

  const {
    apiUrl,
    display,
    sticky,
    defaultView,
    close,
    description,
    feedback,
    menu,
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
      apiUrl: props.apiUrl,
      display: props.display,
      sticky: props.sticky,
      defaultView: getDefaultView(props.defaultView, props),
      close: props.close,
      description: props.description,
      feedback: props.feedback,
      menu: props.menu,
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

  const [openViews, setOpenViews] = useState<{ [key in View]?: boolean }>({});

  const globalStoreOptions = useMemo(
    () => ({
      apiUrl,
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
    }),
    [
      apiUrl,
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
    ],
  );

  useEffect(() => {
    const onOpen = ({ view = 'chat' }: { view?: View }): void => {
      onDidRequestOpenChange?.(true);
      setOpenViews((v) => {
        const closed = Object.keys(v).reduce((acc, value) => {
          return { ...acc, [value]: false };
        }, {});
        return { ...closed, [view]: true };
      });
    };

    const onClose = (): void => {
      onDidRequestOpenChange?.(false);
      if (display === 'dialog' || display === 'sheet') {
        setOpenViews({});
      }
    };

    emitter.on('open', onOpen);
    emitter.on('close', onClose);

    return () => {
      emitter.off('open', onOpen);
      emitter.off('close', onClose);
    };
  }, [trigger?.customElement, display, onDidRequestOpenChange]);

  const onTriggerClicked = useCallback(() => {
    openMarkprompt(menu ? 'menu' : 'chat');
  }, [menu]);

  return (
    <>
      {display !== 'plain' && (
        <>
          {!menu ? (
            <Trigger
              display={display}
              trigger={trigger}
              Component="button"
              onClick={onTriggerClicked}
            >
              {children}
            </Trigger>
          ) : (
            <Menu
              menu={menu}
              open={openViews.menu}
              onOpenChange={(open) => {
                setOpenViews((v) => ({ ...v, menu: open }));
              }}
            >
              <Trigger
                display={display}
                trigger={trigger}
                hasMenu
                Component={DropdownMenu.Trigger}
              >
                {children}
              </Trigger>
            </Menu>
          )}
        </>
      )}

      <GlobalStoreProvider options={globalStoreOptions}>
        <ChatProvider
          chatOptions={chat}
          debug={debug}
          projectKey={projectKey}
          apiUrl={apiUrl}
        >
          {display !== 'plain' && (
            <BaseMarkprompt.Root
              display="dialog"
              open={openViews.ticket}
              onOpenChange={(open) => {
                onDidRequestOpenChange?.(open);
                setOpenViews((v) => ({ ...v, ticket: open }));
              }}
              {...dialogProps}
            >
              <BaseMarkprompt.Portal>
                <BaseMarkprompt.Overlay className="MarkpromptOverlay" />
                <BaseMarkprompt.Content
                  className="MarkpromptContentDialog"
                  data-variant="dialog"
                  data-size="adaptive"
                  onPointerDownOutside={(e) => e.preventDefault()}
                >
                  <TicketDeflectionForm />
                </BaseMarkprompt.Content>
              </BaseMarkprompt.Portal>
            </BaseMarkprompt.Root>
          )}

          <BaseMarkprompt.Root
            display={display}
            open={openViews.chat}
            onOpenChange={(open) => {
              onDidRequestOpenChange?.(open);
              setOpenViews((v) => ({ ...v, chat: open }));
            }}
            {...dialogProps}
          >
            {display !== 'plain' && (
              <>
                <BaseMarkprompt.Portal>
                  {!sticky && (
                    <BaseMarkprompt.Overlay className="MarkpromptOverlay" />
                  )}
                  <BaseMarkprompt.Content
                    className="MarkpromptContentDialog"
                    data-variant={display}
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
                      projectKey={projectKey}
                      chat={chat}
                      debug={debug}
                      feedback={feedback}
                      integrations={integrations}
                      references={references}
                      search={search}
                      layout={layout}
                      linkAs={linkAs}
                      branding={branding}
                      display={display}
                    />
                  </BaseMarkprompt.Content>
                </BaseMarkprompt.Portal>
              </>
            )}

            {display === 'plain' && (
              <BaseMarkprompt.PlainContent className="MarkpromptContentPlain">
                <MarkpromptContent
                  chat={chat}
                  feedback={feedback}
                  layout={layout}
                  linkAs={linkAs}
                  projectKey={projectKey}
                  references={references}
                  branding={branding}
                  display={display}
                  // Currently, we don't support integrations and
                  // search in the plain UI
                  integrations={undefined}
                  search={undefined}
                />
              </BaseMarkprompt.PlainContent>
            )}
          </BaseMarkprompt.Root>
        </ChatProvider>
      </GlobalStoreProvider>
    </>
  );
}

type MarkpromptContentProps = {
  projectKey: string;
  apiUrl?: string;
  chat?: MarkpromptOptions['chat'];
  close?: MarkpromptOptions['close'];
  debug?: boolean;
  display?: MarkpromptOptions['display'];
  layout?: MarkpromptOptions['layout'];
  feedback?: MarkpromptOptions['feedback'];
  references?: MarkpromptOptions['references'];
  search?: MarkpromptOptions['search'];
  linkAs?: MarkpromptOptions['linkAs'];
  integrations?: MarkpromptOptions['integrations'];
} & BaseMarkprompt.BrandingProps;

function MarkpromptContent(props: MarkpromptContentProps): ReactElement {
  const {
    chat,
    close,
    debug,
    display,
    feedback,
    integrations,
    layout,
    linkAs,
    projectKey,
    references,
    search,
    branding,
  } = props;

  const activeView = useGlobalStore((state) => state.activeView);
  const setActiveView = useGlobalStore((state) => state.setActiveView);
  const submitChat = useChatStore((state) => state.submitChat);
  const isTouchDevice = useMediaQuery('(pointer: coarse)');

  if (!search?.enabled) {
    return (
      <div className="MarkpromptTabsContainer">
        {/* We still include a div to preserve the grid-template-rows rules */}
        <div>
          {display !== 'plain' && (
            <NavigationMenu title={chat?.title} close={close} />
          )}
        </div>

        <div className="MarkpromptViews">
          <div
            style={{
              position: 'absolute',
              inset: 0,
            }}
          >
            {chat?.enabled && (
              <ChatView
                activeView={activeView}
                chatOptions={chat}
                debug={debug}
                feedbackOptions={feedback}
                projectKey={projectKey}
                referencesOptions={references}
                branding={branding}
                display={display}
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
              onDidPressBack={() => setActiveView('search')}
              projectKey={projectKey}
              referencesOptions={references}
              showBack={layout === 'panels'}
              linkAs={linkAs}
              branding={branding}
              display={display}
            />
          </Tabs.Content>
        )}

        {integrations?.createTicket?.enabled && (
          <Tabs.Content
            value="ticket"
            style={{ position: 'absolute', inset: 0 }}
          >
            <CreateTicketView
              handleGoBack={() => setActiveView('chat')}
              includeCTA
              includeNav
            />
          </Tabs.Content>
        )}
      </div>
    </Tabs.Root>
  );
}

export {
  closeMarkprompt,
  Markprompt,
  openMarkprompt,
  type MarkpromptProps,
  Trigger,
};
