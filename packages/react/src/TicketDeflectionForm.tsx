import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type JSX,
} from 'react';

import { ChatView } from './chat/ChatView.js';
import { ChatProvider } from './chat/provider.js';
import { useChatStore } from './chat/store.js';
import { DEFAULT_MARKPROMPT_OPTIONS } from './constants.js';
import { GlobalStoreProvider } from './context/global/provider.js';
import { useGlobalStore, type GlobalOptions } from './context/global/store.js';
import {
  CreateTicketView,
  CustomCaseFormRenderer,
} from './CreateTicketView.js';
import { ChevronLeftIcon, LoadingIcon } from './icons.js';
import type { MarkpromptOptions, TicketDeflectionFormView } from './types.js';
import { NavigationMenu } from './ui/navigation-menu.js';
import { RichText } from './ui/rich-text.js';
import { useDefaults } from './useDefaults.js';

interface TicketDeflectionFormProps {
  isStandalone?: boolean;
  forceThreadId?: string;
  defaultView?: TicketDeflectionFormView;
  showBackLink?: boolean;
  CustomCaseForm?: ComponentType<{
    summaryData?: { subject: string; body: string };
  }>;
}

export function TicketDeflectionForm(
  props: TicketDeflectionFormProps,
): JSX.Element {
  const {
    forceThreadId,
    defaultView = 'chat',
    showBackLink,
    isStandalone,
    CustomCaseForm,
  } = props;

  const apiUrl = useGlobalStore((state) => state.options.apiUrl);
  const chat = useGlobalStore((state) => state.options.chat);
  const feedback = useGlobalStore((state) => state.options.feedback);
  const integrations = useGlobalStore((state) => state.options.integrations);
  const projectKey = useGlobalStore((state) => state.options.projectKey);
  const references = useGlobalStore((state) => state.options.references);
  const createTicketSummary = useGlobalStore(
    (state) => state.tickets?.createTicketSummary,
  );

  const storeThreadId = useChatStore((state) => state.threadId);
  const messages = useChatStore((state) => state.messages);
  const selectThread = useChatStore((state) => state.selectThread);

  // When the form is opened from another chat modal, the threadId is
  // not carried over in the state. Instead, we need to pass it
  // explicitly.
  const threadId = forceThreadId ?? storeThreadId;

  const [view, setView] = useState<TicketDeflectionFormView>(defaultView);
  const [didTransitionViewOnce, setDidTransitionViewOnce] = useState(false);
  const [isCreatingTicketSummary, setIsCreatingTicketSummary] = useState(false);

  useEffect(() => {
    // Clear past thread
    selectThread(undefined);
  }, [selectThread]);

  const placeholder = useMemo(() => {
    const _placeholder = integrations?.createTicket?.chat?.placeholder;
    if (typeof _placeholder === 'string') {
      return _placeholder;
    }
    if (messages.length > 0) {
      return _placeholder?.[1];
    }
    return _placeholder?.[0];
  }, [messages.length, integrations?.createTicket?.chat?.placeholder]);

  useEffect(() => {
    if (view !== defaultView) {
      setDidTransitionViewOnce(true);
    }
  }, [view, defaultView]);

  const handleCreateTicketSummary = useCallback(async () => {
    if (!integrations?.createTicket?.enabled) {
      return;
    }

    if (!messages || messages.length === 0 || !threadId) {
      setView('ticket');
      return;
    }

    setIsCreatingTicketSummary(true);
    await createTicketSummary?.(threadId, messages);
    setIsCreatingTicketSummary(false);
    setView('ticket');
  }, [
    integrations?.createTicket?.enabled,
    messages,
    threadId,
    createTicketSummary,
  ]);

  const caseForm = CustomCaseForm ? (
    <CustomCaseFormRenderer CustomCaseForm={CustomCaseForm} />
  ) : (
    <CreateTicketView
      handleGoBack={() => setView('chat')}
      includeNav={false}
      includeCTA={true}
      forceThreadId={threadId}
    />
  );

  return (
    <div
      className="MarkpromptTicketDeflectionForm"
      data-expanded={(messages && messages.length > 0) || view === 'ticket'}
      data-animate-shrink={didTransitionViewOnce}
    >
      {!isStandalone && (
        <NavigationMenu
          title={integrations?.createTicket?.chat?.title}
          subtitle={integrations?.createTicket?.chat?.subtitle}
          close={{ visible: true, hasIcon: true }}
        />
      )}
      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
        {view === 'chat' ? (
          <ChatView
            apiUrl={apiUrl}
            activeView="chat"
            chatOptions={{
              ...chat,
              defaultView: undefined,
              history: false,
              placeholder,
              buttonLabel: integrations?.createTicket?.chat?.buttonLabel,
            }}
            feedbackOptions={feedback}
            projectKey={projectKey}
            referencesOptions={references}
            branding={{ show: false }}
            submitOnEnter={false}
            minInputRows={3}
          />
        ) : (
          caseForm
        )}
      </div>
      {(view === 'chat' || showBackLink) && (
        <div className="MarkpromptDialogFooter">
          {view === 'chat' ? (
            <>
              <RichText>
                {integrations?.createTicket?.chat?.disclaimerView?.message ||
                  ''}
              </RichText>
              <button
                className="MarkpromptButton"
                data-variant="outline"
                disabled={isCreatingTicketSummary}
                type="button"
                onClick={() => handleCreateTicketSummary()}
              >
                {isCreatingTicketSummary
                  ? (integrations?.createTicket?.chat?.openTicketFormLoading ??
                    DEFAULT_MARKPROMPT_OPTIONS.integrations.createTicket.chat
                      .openTicketFormLoading)
                  : (integrations?.createTicket?.chat?.openTicketFormLabel ??
                    DEFAULT_MARKPROMPT_OPTIONS.integrations.createTicket.chat
                      .openTicketFormLabel)}
                {isCreatingTicketSummary && (
                  <LoadingIcon
                    style={{ width: 16, height: 16 }}
                    aria-label="creating summary"
                  />
                )}
              </button>
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyItems: 'start',
                marginLeft: '-0.5rem',
              }}
            >
              <button
                className="MarkpromptIconLink"
                type="button"
                onClick={() => setView('chat')}
              >
                <ChevronLeftIcon
                  className="MarkpromptButtonIcon"
                  aria-hidden="true"
                />
                Back to help
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export interface StandaloneTicketDeflectionFormProps
  extends Pick<
    MarkpromptOptions,
    'apiUrl' | 'chat' | 'feedback' | 'integrations' | 'references'
  > {
  projectKey: string;
}

export function StandaloneTicketDeflectionForm(
  props: StandaloneTicketDeflectionFormProps,
): JSX.Element {
  const { apiUrl, chat, feedback, integrations, references, projectKey } =
    props;

  const options = useDefaults(
    {
      projectKey,
      apiUrl,
      chat,
      feedback,
      integrations: {
        ...integrations,
        createTicket: {
          ...integrations?.createTicket,
          // always enable the integration for the standalone form
          enabled: true,
        },
      },
      references,
    },
    DEFAULT_MARKPROMPT_OPTIONS,
  ) satisfies GlobalOptions;

  return (
    <GlobalStoreProvider options={options}>
      <ChatProvider
        projectKey={projectKey}
        apiUrl={apiUrl}
        chatOptions={chat}
        storeKey="ticket-deflection"
      >
        <div className="MarkpromptStandaloneTicketDeflectionForm">
          <TicketDeflectionForm
            isStandalone
            CustomCaseForm={integrations?.createTicket?.CustomCaseForm}
          />
        </div>
      </ChatProvider>
    </GlobalStoreProvider>
  );
}

// make sure we can use these with the bubble side by side
// eg. set different store keys
