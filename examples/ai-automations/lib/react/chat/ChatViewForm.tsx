import defaults from 'defaults';
import { MessagesSquare } from 'lucide-react';
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEventHandler,
  type ReactElement,
} from 'react';

import { DEFAULT_SUBMIT_CHAT_OPTIONS, submitChatGenerator } from '@/lib/core';

import { ConversationSelect } from './ConversationSelect';
import { ChatContext, selectProjectConversations, useChatStore } from './store';
import {
  Conversation,
  Message,
  createConversation,
  listMessages,
  postMessage,
  useZendeskStore,
} from './zendesk';
import * as BaseMarkprompt from '../primitives/headless';
import type { MarkpromptOptions } from '../types';
import type { View } from '../useViews';

interface ChatViewFormProps {
  activeView?: View;
  chatOptions: MarkpromptOptions['chat'];
}

type TriageResult = 'ai' | 'human';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function triage(
  message: string,
  projectKey: string,
  options: MarkpromptOptions['chat'],
): Promise<TriageResult> {
  const { apiUrl, ...resolvedOptions } = defaults(
    { ...options },
    DEFAULT_SUBMIT_CHAT_OPTIONS,
  );
  const messages = [
    {
      role: 'system',
      content: `You are a triage system that helps categorize incoming user support tickets.\n\nIf a ticket cannot be handled automatically, reply with the word "AIBOT" and nothing else. If it can, reply with the word "AIBOT" and nothing else.\n\nOnly accepted answers are "HUMAN" and "AIBOT".`,
    },
    {
      role: 'user',
      content: `I will send you a support ticket. Based on its content:\n\n- If it can be answered automatically, reply "AIBOT".\n- If not, reply "HUMAN".\n\nHere are my capabilities:\n- Provide answers based on context.\n- Perform reimbursements.\n- Check my credits.\n\nContext:\n---\nThe meaning of life is 42\n---\n\nSupport ticket question:\n
      ${message}`,
    },
  ];

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      projectKey,
      messages,
      ...resolvedOptions,
      stream: false,
    }),
  });
  if (!res.ok) {
    return 'human';
  }
  const json = await res.json();
  return json.text === 'HUMAN' ? 'human' : 'ai';
}

export function ChatViewForm(props: ChatViewFormProps): ReactElement {
  const { activeView, chatOptions } = props;

  const [prompt, setPrompt] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [state, setState] = useState<{
    loading: boolean;
    message?: string;
  }>({ loading: false });

  const projectKey = useChatStore((state) => state.projectKey);
  const options = useChatStore((state) => state.options);
  const submitChat = useChatStore((state) => state.submitChat);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useZendeskStore(
    (state) => (messages: Message[]) => state.setState({ messages }),
  );
  const zendeskEnabled = useZendeskStore((state) => state.enabled);
  const setZendeskEnabled = useZendeskStore(
    (state) => (enabled: boolean) => state.setState({ enabled }),
  );

  const user = useZendeskStore((state) => state.user);
  const conversations = useChatStore(selectProjectConversations);
  const conversation = useZendeskStore((state) => state.conversation);
  const setConversation = useZendeskStore(
    (state) => (conversation: Conversation) => state.setState({ conversation }),
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const value = data.get('markprompt-prompt');

      if (!zendeskEnabled) {
        if (typeof value === 'string') {
          submitChat(value);
        }
      }

      if (zendeskEnabled) {
        await postMessage(conversation!.id, {
          body: JSON.stringify({
            author: {
              type: 'user',
              userExternalId: user?.externalId,
            },
            content: {
              type: 'text',
              text: value,
            },
          }),
        });

        // kick off a message fetch immediately to update the UI asap
        const zendeskMessages = await listMessages(conversation!.id);
        setMessages(zendeskMessages);
      }

      setPrompt('');
    },
    [conversation, setMessages, submitChat, user?.externalId, zendeskEnabled],
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Bring form input in focus when activeView changes.
    inputRef.current?.focus();
  }, [activeView]);

  // keep abortChat up to date, but do not trigger rerenders (and effect hooks calls) when it updates
  const store = useContext(ChatContext);
  const abortChat = useRef(() => store?.getState().abort?.());

  useEffect(
    () =>
      store?.subscribe((state) => {
        abortChat.current = () => state.abort?.();
      }),
    [store],
  );

  useEffect(() => {
    // cancel pending chat requests when the view changes.
    if (activeView && activeView !== 'chat') {
      abortChat.current?.();
    }

    // cancel pending chat request when the component unmounts.
    return () => abortChat.current?.();
  }, [activeView]);

  const speakToAgent = useCallback(async () => {
    if (zendeskEnabled) {
      return setZendeskEnabled(false);
    }

    // enable Zendesk
    setZendeskEnabled(true);

    let localConversation = conversation;

    setState({ loading: true, message: 'Connecting you with an agent...' });
    // toast('Connecting you to an agent.');

    setDisabled(true);

    if (!localConversation) {
      // create conversation
      localConversation = await createConversation({
        body: JSON.stringify({
          type: 'personal',
          participants: [{ userExternalId: user?.externalId }],
        }),
      });

      setConversation(localConversation);

      // If this is a new conversation, start by sending a summary.
      let summary: string | null = '';
      for await (const chunk of submitChatGenerator(
        [
          ...messages,
          {
            role: 'user',
            content:
              "Summarize this conversation. Provide the human agent with all info included in the conversation that could be relevant to resolve the user's issue.",
          },
        ],
        projectKey,
        {
          ...options,
          functions:
            options?.functions?.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ actual, ...definition }) => definition,
            ) ?? [],
        },
      )) {
        summary = chunk.content;
      }

      // todo: create the summary as an internal note for the agent rather than a message.
      // would need to figure out how to get the correct ticket id using the data we have
      // https://developer.zendesk.com/api-reference/ticketing/tickets/ticket_comments/#json-format
      // set public: false in the ticket comment request to create internal notes

      if (!localConversation?.id) {
        return;
      }

      await postMessage(localConversation.id, {
        body: JSON.stringify({
          author: {
            type: 'user',
            userExternalId: user?.externalId,
          },
          content: {
            type: 'text',
            text: `Summary: ${summary}`,
          },
          metadata: {
            isSummary: true,
          },
        }),
      });
    }

    const zendeskMessages = await listMessages(localConversation.id);
    setMessages(zendeskMessages);

    setState({ loading: false });
    // toast('You’re now connected to an agent. How can we help?');

    setDisabled(false);
    inputRef.current?.focus();
  }, [
    conversation,
    messages,
    options,
    projectKey,
    setConversation,
    setMessages,
    setZendeskEnabled,
    user?.externalId,
    zendeskEnabled,
  ]);

  return (
    <div className="flex flex-col gap-2 relative">
      <div className="absolute w-full h-16 bg-gradient-to-t from-white to-white/0 -top-16 z-10" />
      <BaseMarkprompt.Form className="MarkpromptForm" onSubmit={handleSubmit}>
        <BaseMarkprompt.Prompt
          ref={inputRef}
          className="MarkpromptPrompt"
          name="markprompt-prompt"
          type="text"
          autoFocus
          placeholder={
            zendeskEnabled ? 'Send message...' : chatOptions?.placeholder
          }
          labelClassName="MarkpromptPromptLabel"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          disabled={disabled}
        />
        <div className="MarkpromptChatActions z-10">
          <button
            type="button"
            onClick={speakToAgent}
            className="text-neutral-800 font-medium bg-neutral-100 rounded-full px-4 py-1 text-sm flex flex-row gap-2 items-center"
          >
            {zendeskEnabled ? (
              <div
                className={
                  'w-2.5 h-2.5 rounded-full animate-pulse ' +
                  (state.loading ? 'bg-orange-500' : 'bg-green-500')
                }
              />
            ) : (
              <MessagesSquare className="w-4 h-4" />
            )}

            {state.loading ? (
              <>{state.message ?? 'Loading'}</>
            ) : (
              <>
                {zendeskEnabled ? 'Live chat' : 'Speak to an agent'}
                {zendeskEnabled && <span className="text-blue-500">Leave</span>}
              </>
            )}
          </button>
          {conversations.length > 0 && <ConversationSelect />}
        </div>
      </BaseMarkprompt.Form>
    </div>
  );
}
