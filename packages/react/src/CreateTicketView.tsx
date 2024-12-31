import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import { getMessageTextContent } from '@markprompt/core/utils';
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { clsx } from 'clsx';
import { useSelect } from 'downshift';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type FormEvent,
  type JSX,
} from 'react';

import { useChatStore } from './chat/store.js';
import { toValidApiMessages } from './chat/utils.js';
import { useGlobalStore } from './context/global/store.js';
import { ChevronDownIcon, ChevronLeftIcon, LoadingIcon } from './icons.js';
import type { ChatViewMessage, CustomField } from './types.js';
import { isPresent } from './utils.js';

export interface CreateTicketViewProps {
  handleGoBack: () => void;
  includeNav?: boolean;
  includeCTA?: boolean;
  forceThreadId?: string;
}

export function CreateTicketView(props: CreateTicketViewProps): JSX.Element {
  const { handleGoBack, includeNav, includeCTA, forceThreadId } = props;

  const form = useRef<HTMLFormElement>(null);
  const createTicketOptions = useGlobalStore(
    (state) => state.options.integrations?.createTicket,
  );
  const projectKey = useGlobalStore((state) => state.options.projectKey);
  const storeThreadId = useChatStore((state) => state.threadId);

  // When the form is opened from another chat modal, the threadId is
  // not carried over in the state. Instead, we need to pass it
  // explicitly.
  const threadId = forceThreadId ?? storeThreadId;

  const apiUrl = useGlobalStore((state) => state.options?.apiUrl);
  const headers = useGlobalStore((state) => state.options?.headers);
  const summary = useGlobalStore((state) =>
    threadId ? state.tickets?.summaryByThreadId[threadId] : undefined,
  );

  const messages = useChatStore((state) =>
    threadId ? state.messagesByThreadId[threadId]?.messages : undefined,
  );

  const [summaryData, setSummaryData] = useState<{
    subject: string;
    body: string;
  }>({ subject: '', body: '' });
  const [totalFileSize, setTotalFileSize] = useState<number>(0);

  const [result, setResult] = useState<Response>();
  const [error, setError] = useState<Error>();
  const [isSubmittingCase, setSubmittingCase] = useState(false);

  const provider = createTicketOptions?.provider;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!apiUrl || !projectKey || !provider) {
      return;
    }

    try {
      const data = new FormData(event.currentTarget);

      if (!data.get('email') || !data.get('userName') || !data.get('summary')) {
        return;
      }

      setResult(undefined);
      setSubmittingCase(true);

      const files = data.getAll('files') as File[];

      const requestBody = files?.some((f) => f.size > 0)
        ? {
            method: 'POST',
            // don't pass a Content-Type header here, the browser will
            // generate a correct header which includes the boundary.
            body: data,
            headers,
          }
        : {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(data.entries())),
            headers: {
              ...headers,
              'Content-Type': 'application/json',
            },
          };

      // copy a field for legacy reasons
      const result = await fetch(
        `${apiUrl}/integrations/create-ticket?projectKey=${projectKey}`,
        requestBody,
      );

      setSubmittingCase(false);
      setResult(result);
      setTotalFileSize(0);
      setError(undefined);
      form.current?.reset();
    } catch (error) {
      console.error(error);

      setSubmittingCase(false);
      setResult(undefined);
      setTotalFileSize(0);

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

  useEffect(() => {
    if (!messages || messages.length === 0) {
      return;
    }
    setSummaryData(getFullSummaryData(summary, messages));
  }, [summary, messages]);

  return (
    <div className="MarkpromptCreateTicketView">
      {includeNav ? (
        <div className="MarkpromptChatViewNavigation">
          <button
            className="MarkpromptGhostButton"
            onClick={handleGoBack}
            type="button"
          >
            <AccessibleIcon label="go back">
              <ChevronLeftIcon
                style={{ width: 16, height: 16 }}
                strokeWidth={2.5}
              />
            </AccessibleIcon>
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
          <div className="MarkpromptFormGroup">
            <label htmlFor="subject" id="subject-label">
              {createTicketOptions?.form?.subjectLabel || 'Description'}
            </label>
            <input
              name="subject"
              id="subject"
              value={summaryData.subject}
              onChange={(event) => {
                setSummaryData((d) => ({ ...d, subject: event.target.value }));
              }}
              placeholder={createTicketOptions?.form?.subjectPlaceholder}
              required
              aria-labelledby="subject-label"
              disabled={isSubmittingCase}
              style={{ color: 'var(--markprompt-foreground)' }}
            />
          </div>
          <div className="MarkpromptFormGroup MarkpromptFormGroupGrow">
            <label htmlFor="summary" id="summary-label">
              {createTicketOptions?.form?.summaryLabel || 'Description'}
            </label>
            <textarea
              name="summary"
              id="summary"
              value={summaryData.body}
              onChange={(event) => {
                setSummaryData((d) => ({ ...d, body: event.target.value }));
              }}
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
          {createTicketOptions?.form?.customFields?.map((field) => (
            <CustomFieldSelect key={field.id} customField={field} />
          ))}
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
                onChange={(event) => {
                  const files = event.currentTarget.files;
                  if (!files) return;
                  let _totalFileSize = 0;
                  for (const file of files) {
                    _totalFileSize += file.size / 1024 ** 2; // file size in MB
                  }
                  setTotalFileSize(_totalFileSize);
                }}
                multiple
              />
              {totalFileSize >= 4.5 && (
                <p className="MarkpromptTicketViewFormGroupMessage">
                  {createTicketOptions?.form?.maxFileSizeError}
                </p>
              )}
            </div>
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
                disabled={isSubmittingCase || totalFileSize >= 4.5}
              >
                {createTicketOptions?.form?.submitLabel || 'Send message'}
                {isSubmittingCase && (
                  <LoadingIcon
                    style={{ width: 16, height: 16 }}
                    aria-label="submitting case"
                  />
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

interface CustomFieldSelectProps {
  customField: CustomField;
}

function CustomFieldSelect(props: CustomFieldSelectProps): JSX.Element {
  const { customField } = props;

  // refactor this to use flatMap instead of reduce
  const flatItems = useMemo(
    () => customField.items.flatMap((x) => ('items' in x ? x.items : x)),
    [customField.items],
  );

  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: flatItems,
  });

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement: 'bottom-start',
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const id = useId();

  return (
    <div className="MarkpromptFormGroup" style={isOpen ? { zIndex: 10 } : {}}>
      <label htmlFor={`custom_field_${id}`}>{customField.label}</label>
      <input
        type="hidden"
        id={`custom_field_${id}`}
        name="customFields"
        value={
          selectedItem
            ? JSON.stringify({ id: customField.id, value: selectedItem.value })
            : undefined
        }
      />

      <div className="MarkpromptSelect">
        <button
          type="button"
          className={clsx(
            'MarkpromptSelectToggle',
            'MarkpromptSelectToggleWithIcon',
            { MarkpromptSelectToggleMuted: !selectedItem },
          )}
          {...getToggleButtonProps({ ref: refs.setReference })}
        >
          {selectedItem?.label || 'Select…'}{' '}
          <ChevronDownIcon width={16} height={16} aria-hidden />
        </button>

        <ul
          {...getMenuProps({ ref: refs.setFloating })}
          className="MarkpromptSelectMenu"
          data-open={isOpen}
          style={floatingStyles}
        >
          {customField.items.map((item) => {
            if ('items' in item) {
              return (
                <li key={item.label}>
                  <strong className="MarkpromptSelectGroupLabel">
                    {item.label}
                  </strong>
                  <ul>
                    {item.items.map((option) => (
                      <li
                        key={option.value}
                        {...getItemProps({ item: option })}
                        data-highlighted={
                          highlightedIndex === flatItems.indexOf(option)
                        }
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }
            return (
              <li
                key={item.value}
                {...getItemProps({ item })}
                data-highlighted={highlightedIndex === flatItems.indexOf(item)}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function getFullSummaryData(
  summary: ChatViewMessage | undefined,
  messages: ChatViewMessage[],
): { subject: string; body: string } {
  const transcript = `Full transcript:\n\n${toValidApiMessages(messages)
    .map((m) => {
      const content = getMessageTextContent(m);
      if (!content) return;
      return `${m.role === 'user' ? 'Me' : 'AI'}: ${content}`;
    })
    .filter(isPresent)
    .join('\n\n')}`;

  let subject = '';
  let body = transcript;

  if (summary?.content) {
    try {
      const data = JSON.parse(summary.content) as {
        subject: string;
        fullSummary?: string;
      };
      subject = data.subject;
      body = `${data.fullSummary ?? ''}\n\n---\n\n${transcript}`;
    } catch {
      // Do nothing
    }
  }

  return { subject, body };
}

export function CustomCaseFormRenderer(props: {
  CustomCaseForm: ComponentType<{
    summaryData?: { subject: string; body: string };
  }>;
}): JSX.Element {
  const { CustomCaseForm } = props;

  const messages = useChatStore((state) => state.messages);
  const threadId = useChatStore((state) => state.threadId);
  const summary = useGlobalStore((state) =>
    threadId ? state.tickets?.summaryByThreadId[threadId] : undefined,
  );

  const summaryData = getFullSummaryData(summary, messages);

  return <CustomCaseForm summaryData={summaryData} />;
}
