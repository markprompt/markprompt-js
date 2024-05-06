import { useCallback, useEffect, useMemo, useState } from 'react';

import { ChatView } from './chat/ChatView.js';
import { useChatStore } from './chat/store.js';
import { CreateTicketView } from './CreateTicketView.js';
import { ChevronLeftIcon, LoadingIcon } from './icons.js';
import { useGlobalStore } from './store.js';
import type { MarkpromptOptions } from './types.js';
import { NavigationMenu } from './ui/navigation-menu.js';
import { RichText } from './ui/rich-text.js';

type TicketDeflectionFormView = 'chat' | 'ticket';

type TicketDeflectionFormProps = Pick<
  MarkpromptOptions,
  'apiUrl' | 'chat' | 'branding' | 'feedback' | 'references' | 'integrations'
> & {
  projectKey: string;
  defaultView?: TicketDeflectionFormView;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function TicketDeflectionForm(props: TicketDeflectionFormProps): JSX.Element {
  const {
    apiUrl,
    projectKey,
    chat,
    feedback,
    references,
    integrations,
    defaultView = 'chat',
  } = props;
  const [view, setView] = useState<TicketDeflectionFormView>(defaultView);
  const [didTransitionViewOnce, setDidTransitionViewOnce] = useState(false);
  const [isCreatingTicketSummary, setIsCreatingTicketSummary] = useState(false);
  const threadId = useChatStore((state) => state.threadId);
  const messages = useChatStore((state) => state.messages);
  const selectThread = useChatStore((state) => state.selectThread);
  const createTicketSummary = useGlobalStore(
    (state) => state.tickets?.createTicketSummary,
  );

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
    threadId,
    createTicketSummary,
    integrations?.createTicket?.enabled,
    messages,
  ]);

  return (
    <div
      className="MarkpromptTicketDeflectionForm"
      data-expanded={(messages && messages.length > 0) || view === 'ticket'}
      data-animate-shrink={didTransitionViewOnce}
    >
      <NavigationMenu
        title={integrations?.createTicket?.chat?.title}
        subtitle={integrations?.createTicket?.chat?.subtitle}
        close={{ visible: true, hasIcon: true }}
      />
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
            minInputRows={10}
          />
        ) : (
          <CreateTicketView
            createTicketOptions={integrations?.createTicket}
            handleGoBack={() => setView('chat')}
            includeNav={false}
            includeCTA={true}
          />
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

export { TicketDeflectionForm };
