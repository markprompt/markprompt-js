import { set } from 'lodash';
import { useState, type FormEvent } from 'react';

import { ChevronLeftIcon } from './icons.js';
import { useChatStore } from './index.js';
import { useGlobalStore } from './store.js';

export interface CreateTicketViewProps {
  handleGoBack: () => void;
}

export function CreateTicketView(props: CreateTicketViewProps): JSX.Element {
  const { handleGoBack } = props;

  const projectKey = useGlobalStore((state) => state.options.projectKey);
  const conversationId = useChatStore((state) => state.conversationId);
  const provider = useGlobalStore(
    (state) => state.options.integrations?.createTicket?.provider,
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

    setResult(undefined);

    const result = await fetch('http://api.localhost:3000/create-ticket', {
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
      <div className="MarkpromptChatViewNavigation">
        <button className="MarkpromptGhostButton" onClick={handleGoBack}>
          <ChevronLeftIcon
            style={{ width: 16, height: 16 }}
            strokeWidth={2.5}
          />
        </button>
      </div>

      <div className="MarkpromptCreateTicket">
        <h1>Create a case</h1>
        <form onSubmit={handleSubmit} className="MarkpromptCreateTicketForm">
          <div className="MarkpromptFormGroup">
            <label htmlFor="name">Your Name</label>

            <input
              required
              type="text"
              id="user_name"
              name="user_name"
              placeholder="Markprompt AI"
            />
          </div>

          <div className="MarkpromptFormGroup">
            <label htmlFor="email">Email</label>

            <input
              required
              type="email"
              id="email"
              name="email"
              placeholder="bot@markprompt.com"
            />
          </div>

          <div className="MarkpromptFormGroup">
            <label htmlFor="summary" id="summary-label">
              How can we help?
            </label>
            <textarea
              value={
                summary?.content
                  ? summary.content
                  : summary?.state &&
                      summary.state !== 'done' &&
                      summary?.state !== 'cancelled'
                    ? 'Generating summary…'
                    : 'Please describe your issue'
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

          <button type="submit" className="MarkpromptPromptSubmitButton">
            Submit case
          </button>

          {result && (
            <p>
              {result.ok
                ? 'Ticket created successfully!'
                : 'An error occurred while creating the case'}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
