import { customAlphabet } from 'nanoid';
import React, { useEffect } from 'react';

import { Data } from '@/pages';

import { ChatViewForm } from './ChatViewForm';
import { ConversationSidebar } from './ConversationSidebar';
import { Messages } from './Messages';
import { ChatProvider } from './store';
import {
  Message,
  User,
  ZendeskUserInfo,
  getOrCreateUser,
  listMessages,
  useZendeskStore,
} from './zendesk';
import { DEFAULT_MARKPROMPT_OPTIONS } from '../constants';
import type { MarkpromptOptions } from '../types';
import { useDefaults } from '../useDefaults';
import type { View } from '../useViews';

export interface ChatViewProps {
  activeView?: View;
  chatOptions?: MarkpromptOptions['chat'];
  debug?: boolean;
  feedbackOptions?: MarkpromptOptions['feedback'];
  onDidSelectReference?: () => void;
  projectKey: string;
  referencesOptions?: MarkpromptOptions['references'];
}

const nanoid = customAlphabet('1234567890abcdef', 6);

function getMarkpromptDemoData() {
  const demoDataString = localStorage.getItem('markprompt-demo-data');
  if (demoDataString) {
    return JSON.parse(demoDataString) as Data;
  }
  return undefined;
}

export function ChatView(props: ChatViewProps): JSX.Element {
  const { activeView, debug, projectKey } = props;

  if (!projectKey) {
    throw new Error(
      `Markprompt: a project key is required. Make sure to pass your Markprompt project key to <ChatView />.`,
    );
  }

  // we are also merging defaults in the Markprompt component, but this makes sure
  // that standalone ChatView components also have defaults as expected.
  const chatOptions = useDefaults(
    { ...props.chatOptions },
    DEFAULT_MARKPROMPT_OPTIONS.chat,
  );

  const feedbackOptions = useDefaults(
    { ...props.feedbackOptions },
    DEFAULT_MARKPROMPT_OPTIONS.feedback,
  );

  const referencesOptions = useDefaults(
    { ...props.referencesOptions },
    DEFAULT_MARKPROMPT_OPTIONS.references,
  );

  const user = useZendeskStore((state) => state.user);
  const setUser = useZendeskStore(
    (state) => (user: User) => state.setState({ user }),
  );

  const conversation = useZendeskStore((state) => state.conversation);
  const setMessages = useZendeskStore(
    (state) => (messages: Message[]) => state.setState({ messages }),
  );

  useEffect(() => {
    if (user) {
      return;
    }

    const abortController = new AbortController();

    const initUser = async () => {
      const randomizeEmail = (email: string) => {
        const parts = email.split('@');
        return `${parts[0]}-${nanoid()}@${parts[1]}`;
      };
      try {
        // create zendesk user
        const demoUser = getMarkpromptDemoData()?.user;
        const externalId = demoUser
          ? randomizeEmail(demoUser.email)
          : crypto.randomUUID();
        let userInfo: ZendeskUserInfo;
        if (!demoUser) {
          userInfo = {
            givenName: 'Alice',
            surname: 'Hansen',
            email: 'alice@acme.com',
            avatarUrl: '/avatar.png',
          };
        } else {
          userInfo = {
            givenName: demoUser.firstName,
            surname: demoUser.lastName,
            email: demoUser.email,
            avatarUrl: demoUser.avatarUrl,
          };
        }

        const newUser = await getOrCreateUser(externalId, userInfo);

        if (!newUser || 'errors' in newUser) {
          return;
        }

        setUser(newUser);
      } catch (err) {
        console.error(err);
      }
    };

    initUser();

    return () => {
      abortController.abort();
    };
  }, [setUser, user]);

  useEffect(() => {
    if (!conversation) return;

    let timeout: NodeJS.Timeout;
    let controller: AbortController | undefined;

    async function poll() {
      await new Promise(
        (resolve) =>
          (timeout = setTimeout(
            resolve,
            Math.round(4_000 + 2_000 * Math.random()),
          )),
      ); // wait 5 seconds

      try {
        controller = new AbortController();
        const messages = await listMessages(conversation!.id);
        setMessages(messages);
      } catch (error) {
        console.error('Polling failed:', error);
        await new Promise(
          (resolve) =>
            (timeout = setTimeout(
              resolve,
              Math.round(9_000 + 2_000 * Math.random()),
            )),
        );
        // handle error
      } finally {
        controller = undefined;
        poll(); // schedule the next poll
      }
    }

    poll();

    return () => {
      clearTimeout(timeout);
      controller?.abort();
    };
  }, [conversation, setMessages]);

  return (
    <ChatProvider
      chatOptions={chatOptions}
      debug={debug}
      projectKey={projectKey}
    >
      <div className="MarkpromptChatView">
        <ConversationSidebar />

        <div className="MarkpromptChatViewChat">
          <Messages
            projectKey={projectKey}
            feedbackOptions={feedbackOptions}
            referencesOptions={referencesOptions}
          />
          <ChatViewForm activeView={activeView} chatOptions={chatOptions} />
        </div>
      </div>
    </ChatProvider>
  );
}
