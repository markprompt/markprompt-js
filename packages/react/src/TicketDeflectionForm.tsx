import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from 'react';

import { ChatView } from './chat/ChatView.js';
import { ChatProvider, useChatStore } from './chat/store.js';
import {
  CreateTicketView,
  CustomCaseFormRenderer,
} from './CreateTicketView.js';
import { ChevronLeftIcon, LoadingIcon } from './icons.js';
import { DEFAULT_MARKPROMPT_OPTIONS, type MarkpromptOptions } from './index.js';
import {
  GlobalStoreProvider,
  useGlobalStore,
  type GlobalOptions,
} from './store.js';
import { NavigationMenu } from './ui/navigation-menu.js';
import { RichText } from './ui/rich-text.js';
import { useDefaults } from './useDefaults.js';

type TicketDeflectionFormView = 'chat' | 'ticket';

interface TicketDeflectionFormProps {
  isStandalone?: boolean;
  defaultView?: TicketDeflectionFormView;
  CustomCaseForm?: ComponentType<{ summary?: string }>;
}

export function TicketDeflectionForm(
  props: TicketDeflectionFormProps,
): JSX.Element {
  const { defaultView = 'chat', isStandalone, CustomCaseForm } = props;

  const chat = useGlobalStore((state) => state.options.chat);
  const feedback = useGlobalStore((state) => state.options.feedback);
  const integrations = useGlobalStore((state) => state.options.integrations);
  const projectKey = useGlobalStore((state) => state.options.projectKey);
  const references = useGlobalStore((state) => state.options.references);
  const createTicketSummary = useGlobalStore(
    (state) => state.tickets?.createTicketSummary,
  );

  const threadId = useChatStore((state) => state.threadId);
  const messages = useChatStore((state) => state.messages);
  const selectThread = useChatStore((state) => state.selectThread);

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
      <div className="MarkpromptDialogFooter">
        {view === 'chat' ? (
          <>
            <RichText>
              {integrations?.createTicket?.chat?.disclaimerView?.message || ''}
            </RichText>
            <button
              className="MarkpromptButton"
              data-variant="outline"
              disabled={isCreatingTicketSummary}
              onClick={() => handleCreateTicketSummary()}
            >
              {isCreatingTicketSummary ? 'Creating case...' : 'Create case'}
              {isCreatingTicketSummary && (
                <LoadingIcon style={{ width: 16, height: 16 }} />
              )}
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                justifyItems: 'start',
                marginLeft: '-0.5rem',
              }}
            >
              <div
                className="MarkpromptIconLink"
                onClick={() => setView('chat')}
              >
                <ChevronLeftIcon className="MarkpromptButtonIcon" />
                Back to help
              </div>
            </div>
          </>
        )}
      </div>
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
