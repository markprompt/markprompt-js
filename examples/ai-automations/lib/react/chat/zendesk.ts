import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const base = `/api/zendesk`;

async function zendesk(endpoint: string, init?: RequestInit) {
  const res = await fetch(`${base}${endpoint}`, {
    ...init,
  });
  return res.json();
}

type ErrorResponse = { errors: unknown[] };

export type ZendeskUserInfo = {
  givenName: string;
  surname: string;
  email: string;
  avatarUrl: string;
};

export type User = {
  externalId: string;
  hasPaymentInfo: boolean;
  id: string;
  identities: unknown[];
  metadata: Record<string, unknown>;
  profile: {
    locale: string;
    localeOrigin: string;
  };
  signedUpAt: string;
};

async function getUserById(externalId: string): Promise<User | ErrorResponse> {
  const json = await zendesk(`/users/${externalId}`, {
    method: 'GET',
  });

  console.log('getUserById', JSON.stringify(json, null, 2));

  if (json.errors) {
    return json;
  }

  return json.user;
}

export async function getOrCreateUser(
  externalId: string,
  profile: ZendeskUserInfo,
): Promise<User | ErrorResponse> {
  const found = await getUserById(externalId);

  if (!(found as ErrorResponse).errors) {
    return found;
  }

  const json = await zendesk(`/users`, {
    method: 'POST',
    body: JSON.stringify({
      externalId,
      profile,
    }),
  });

  return json.user;
}

export type Conversation = {
  id: string;
  isDefault: boolean;
  lastUpdatedAt: string;
  type: 'personal' | 'sdkSource';
};

export async function createConversation(
  init?: RequestInit,
): Promise<Conversation> {
  const json = await zendesk(`/conversations`, {
    method: 'POST',
    ...init,
  });

  return json.conversation;
}

export async function postMessage(conversationId: string, init?: RequestInit) {
  const json = await zendesk(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    ...init,
  });

  return json.message;
}

type Page = {
  after: string;
  before: string;
  size: string;
};

export type Message = {
  id: string;
  received: string;
  author: {
    type: 'user' | 'business';
    userId: string;
    displayName: string;
    avatarUrl: string;
  };
  content: {
    type: string;
    text: string;
    actions: unknown[];
    payload: string;
  };
  source: unknown;
  quotedMessage: unknown;
  metadata?: {
    isSummary?: boolean;
  };
  deleted: boolean;
};

type MessagesResponse = {
  messages: Message[];
  meta: {
    hasMore: boolean;
    afterCursor: string;
    beforeCursor: string;
  };
  links: {
    prev: string;
    next: string;
  };
};

export async function listMessages(
  conversationId: string,
  page?: Page,
): Promise<Message[]> {
  const params = new URLSearchParams(page);

  const messages = [];
  let hasMore = true;

  do {
    try {
      const json: MessagesResponse = await zendesk(
        `/conversations/${conversationId}/messages?${params}`,
      );

      messages.push(...json.messages);
      hasMore = json.meta.hasMore;

      if (hasMore) {
        params.set('after', json.meta.afterCursor);
      }
    } catch {
      hasMore = false;
    }
  } while (hasMore);

  return messages;
}

type State = {
  enabled: boolean;
  user?: User;
  conversation?: Conversation;
  messages?: Message[];
};

type Actions = {
  setState: (state: Partial<State>) => void;
};

export const useZendeskStore = create<State & Actions>()(
  persist(
    (set) => ({
      enabled: false,
      user: undefined,
      conversation: undefined,
      messages: undefined,
      setState: (state) => set(state),
    }),
    {
      name: 'markprompt-zendesk-store',
      partialize: ({ user, conversation, messages }) => ({
        user,
        conversation,
        messages,
      }),
    },
  ),
);
