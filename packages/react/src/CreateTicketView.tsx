import { useMemo, useRef, useState, type FormEvent } from 'react';

import { toApiMessages } from './chat/utils.js';
import { ChevronLeftIcon, LoadingIcon } from './icons.js';
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

  const form = useRef<HTMLFormElement>(null);
  const projectKey = useGlobalStore((state) => state.options.projectKey);
  const conversationId = useChatStore((state) => state.conversationId);
  const provider = useGlobalStore(
    (state) => state.options.integrations?.createTicket?.provider,
  );
  const apiUrl = useGlobalStore((state) => state.options?.apiUrl);
  const summary = useGlobalStore((state) =>
    conversationId
      ? state.tickets?.summaryByConversationId[conversationId]
      : undefined,
  );
  const messages = useChatStore((state) => state.messages);

  const [result, setResult] = useState<Response>();
  const [error, setError] = useState<Error>();
  const [isSubmittingCase, setSubmittingCase] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (
      !apiUrl ||
      !projectKey ||
      !provider ||
      !event.currentTarget.email.value ||
      !event.currentTarget.userName.value ||
      !event.currentTarget.summary.value
    ) {
      return;
    }

    setResult(undefined);
    setSubmittingCase(true);

    try {
      const data = new FormData(event.currentTarget);
      // copy a field for legacy reasons
      const result = await fetch(`${apiUrl}/integrations/create-ticket`, {
        method: 'POST',
        // don't pass a Content-Type header here, the browser will
        // generate a correct header which includes the boundary.
        body: data,
      });

      setSubmittingCase(false);
      setResult(result);
      form.current?.reset();
    } catch (error) {
      setSubmittingCase(false);
      setResult(undefined);

      // eslint-disable-next-line no-console
      console.error(error);

      if (error instanceof Error) {
        setError(error);
      } else {
        setError(
          new Error('Something went wrong while submitting your case', {
            cause: error,
          }),
        );
      }
    }
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
        <form
          onSubmit={handleSubmit}
          className="MarkpromptCreateTicketForm"
          ref={form}
        >
          <input type="hidden" name="projectKey" value={projectKey} />
          <input type="hidden" name="provider" value={provider} />

          <div className="MarkpromptFormGroup">
            <label htmlFor="userName">
              {createTicketOptions?.form?.nameLabel || 'Name'}
            </label>
            <input
              required
              type="text"
              id="userName"
              name="userName"
              value={createTicketOptions?.user?.name}
              readOnly={!!createTicketOptions?.user?.name}
              disabled={isSubmittingCase}
              placeholder={createTicketOptions?.form?.namePlaceholder}
            />
          </div>
          <div className="MarkpromptFormGroup">
            <label htmlFor="email">
              {createTicketOptions?.form?.emailLabel || 'Email'}
            </label>
            <input
              required
              type="email"
              id="email"
              name="email"
              value={createTicketOptions?.user?.email}
              readOnly={!!createTicketOptions?.user?.email}
              disabled={isSubmittingCase}
              placeholder={createTicketOptions?.form?.emailPlaceholder}
            />
          </div>
          <div className="MarkpromptFormGroup MarkpromptFormGroupGrow">
            <label htmlFor="summary" id="summary-label">
              {createTicketOptions?.form?.summaryLabel || 'Description'}
            </label>
            <textarea
              name="summary"
              id="summary"
              value={description}
              placeholder={
                summary?.state &&
                summary.state !== 'done' &&
                summary?.state !== 'cancelled'
                  ? createTicketOptions?.form?.summaryLoading
                  : createTicketOptions?.form?.summaryPlaceholder
              }
              required
              aria-labelledby="summary-label"
              disabled={isSubmittingCase}
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
          {createTicketOptions?.form?.hasFileUploadInput && (
            <div className="MarkpromptFormGroup">
              <label htmlFor="files">
                {createTicketOptions?.form?.uploadFileLabel || 'Attach a file'}
              </label>
              <input
                type="file"
                name="files"
                id="files"
                disabled={isSubmittingCase}
                multiple
              />
            </div>
          )}
          {error && (
            <p style={{ color: 'red' }}>
              Something went wrong when submitting your case. Please try again
              or contact support.
            </p>
          )}
          {includeCTA && (
            <div className="MarkpromptTicketViewButtonRow">
              <div>
                {result && (
                  <p className="MarkpromptTicketViewButtonRowMessage">
                    {result.ok
                      ? createTicketOptions?.form?.ticketCreatedOk
                      : createTicketOptions?.form?.ticketCreatedError}
                  </p>
                )}
                {error && (
                  <p className="MarkpromptTicketViewButtonRowMessage">
                    {createTicketOptions?.form?.ticketCreatedError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="MarkpromptButton"
                data-variant="primary"
                disabled={isSubmittingCase}
              >
                {createTicketOptions?.form?.submitLabel || 'Send message'}
                {isSubmittingCase && (
                  <LoadingIcon style={{ width: 16, height: 16 }} />
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
