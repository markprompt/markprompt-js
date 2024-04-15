import { useMemo, useState, type FormEvent } from 'react';

import { toApiMessages } from './chat/utils.js';
import { ChevronLeftIcon } from './icons.js';
import { useChatStore, type MarkpromptOptions } from './index.js';
import { useGlobalStore } from './store.js';

export interface CreateTicketViewProps {
  handleGoBack: () => void;
  createTicketOptions: NonNullable<
    MarkpromptOptions['integrations']
  >['createTicket'];
  includeNav?: boolean;
  includeCTA?: boolean;
}

export function CreateTicketView(props: CreateTicketViewProps): JSX.Element {
  const { handleGoBack, createTicketOptions, includeNav, includeCTA } = props;

  const projectKey = useGlobalStore((state) => state.options.projectKey);
  const conversationId = useChatStore((state) => state.conversationId);
  const provider = useGlobalStore(
    (state) => state.options.integrations?.createTicket?.provider,
  );
  const apiUrl = useGlobalStore(
    (state) => state.options.integrations?.createTicket?.apiUrl,
  );
  const summary = useGlobalStore((state) =>
    conversationId
      ? state.tickets?.summaryByConversationId[conversationId]
      : undefined,
  );
  const messages = useChatStore((state) => state.messages);

  const [result, setResult] = useState<Response>();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!apiUrl || !projectKey || !provider) {
      return;
    }

    setResult(undefined);

    const result = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectKey,
        email: event.currentTarget.email.value,
        name: event.currentTarget.user_name.value,
        content: event.currentTarget.summary.value,
        provider,
      }),
    });

    setResult(result);
  };

  const description = useMemo(() => {
    if (!messages || messages.length === 0) {
      return '';
    }
    const transcript = toApiMessages(messages)
      .map((m) => {
        return `${m.role === 'user' ? 'Me' : 'AI'}: ${m.content}`;
      })
      .join('\n\n');
    return `${summary?.content || ''}\n\n---\n\nFull transcript:\n\n${transcript}`;
  }, [summary?.content, messages]);

  return (
    <div className="MarkpromptCreateTicketView">
      {includeNav ? (
        <div className="MarkpromptChatViewNavigation">
          <button className="MarkpromptGhostButton" onClick={handleGoBack}>
            <ChevronLeftIcon
              style={{ width: 16, height: 16 }}
              strokeWidth={2.5}
            />
          </button>
        </div>
      ) : (
        <div />
      )}
      <div className="MarkpromptCreateTicket">
        <form onSubmit={handleSubmit} className="MarkpromptCreateTicketForm">
          <div className="MarkpromptFormGroup">
            <label htmlFor="user_name">
              {createTicketOptions?.view?.nameLabel || 'Name'}
            </label>
            <input
              required
              type="text"
              id="user_name"
              name="user_name"
              value={createTicketOptions?.user?.name}
              disabled={!!createTicketOptions?.user?.name}
              placeholder={createTicketOptions?.view?.namePlaceholder}
            />
          </div>
          <div className="MarkpromptFormGroup">
            <label htmlFor="email">
              {createTicketOptions?.view?.emailLabel || 'Email'}
            </label>
            <input
              required
              type="email"
              id="email"
              name="email"
              value={createTicketOptions?.user?.email}
              disabled={!!createTicketOptions?.user?.name}
              placeholder={createTicketOptions?.view?.emailPlaceholder}
            />
          </div>
          <div className="MarkpromptFormGroup MarkpromptFormGroupGrow">
            <label htmlFor="summary" id="summary-label">
              {createTicketOptions?.view?.summaryLabel || 'Description'}
            </label>
            <textarea
              value={description}
              placeholder={
                summary?.state &&
                summary.state !== 'done' &&
                summary?.state !== 'cancelled'
                  ? createTicketOptions?.view?.summaryLoading
                  : createTicketOptions?.view?.summaryPlaceholder
              }
              required
              aria-labelledby="summary-label"
              id="summary"
              style={{
                color:
                  summary?.state &&
                  summary.state !== 'done' &&
                  summary?.state !== 'cancelled'
                    ? 'var(--markprompt-mutedForeground)'
                    : 'var(--markprompt-foreground)',
              }}
            />
          </div>
          {includeCTA && (
            <div className="MarkpromptTicketViewButtonRow">
              <div>
                {result && (
                  <p>
                    {result.ok
                      ? createTicketOptions?.view?.ticketCreatedOk
                      : createTicketOptions?.view?.ticketCreatedError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="MarkpromptButton"
                data-variant="primary"
              >
                {createTicketOptions?.view?.submitLabel || 'Send message'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
