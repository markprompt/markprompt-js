import { useState, type FormEvent } from 'react';

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
        <h1>{createTicketOptions?.view?.title}</h1>
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
              placeholder={createTicketOptions?.view?.emailPlaceholder}
            />
          </div>
          <div className="MarkpromptFormGroup MarkpromptFormGroupGrow">
            <label htmlFor="summary" id="summary-label">
              {createTicketOptions?.view?.summaryLabel || 'Description'}
            </label>
            <textarea
              value={summary?.content ? summary.content : ''}
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
            <div
              className="MarkpromptTicketViewButtonRow"
              style={{ paddingBottom: '1rem' }}
            >
              <button
                type="submit"
                className="MarkpromptButton"
                data-variant="primary"
              >
                {createTicketOptions?.view?.submitLabel || 'Send message'}
              </button>

              {result && (
                <p>
                  {result.ok
                    ? createTicketOptions?.view?.ticketCreatedOk
                    : createTicketOptions?.view?.ticketCreatedError}
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
