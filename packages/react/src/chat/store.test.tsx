import { describe, it, expect, beforeEach } from 'vitest';

import { createChatStore } from './store.js';

describe('ChatStore', () => {
  let store: ReturnType<typeof createChatStore>;
  const projectKey = 'test-project-key';

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    store = createChatStore({
      projectKey,
      // when `persistChatHistory` is `false` > session storage
      persistChatHistory: false,
    });
  });

  describe('clearStorage', () => {
    it('should clear local state and session storage', () => {
      store.setState((currentState) => ({
        ...currentState,
        threadId: 'test-thread-1',
        messages: [
          {
            id: crypto.randomUUID(),
            content: 'test-content-1',
            role: 'user',
            state: 'done',
            references: [],
          },
        ],
        threadIdsByProjectKey: {
          ...currentState.threadIdsByProjectKey,
          [projectKey]: ['test-thread-1'],
        },
        messagesByThreadId: {
          'test-thread-1': {
            lastUpdated: new Date().toISOString(),
            messages: [
              {
                id: crypto.randomUUID(),
                content: 'test-content-1',
                role: 'user',
                state: 'done',
                references: [],
              },
            ],
          },
        },
        toolCallsByToolCallId: { 'tool-1': { status: 'done' } },
        didAcceptDisclaimerByProjectKey: { [projectKey]: true },
      }));

      // verify set state
      const currentState = store.getState();
      expect(currentState.threadId).toBe('test-thread-1');
      expect(currentState.messages).toHaveLength(1);

      currentState.clearStorage();

      // verify cleared state
      const clearedState = store.getState();
      expect(clearedState.threadId).toBeUndefined();
      expect(clearedState.messages).toEqual([]);
      expect(clearedState.threadIdsByProjectKey[projectKey]).toEqual([]);
      expect(clearedState.messagesByThreadId).toEqual({});
      expect(clearedState.toolCallsByToolCallId).toEqual({});
      expect(clearedState.didAcceptDisclaimerByProjectKey).toEqual({});
    });

    it('should clear local state and localStorage', () => {
      const persistentStore = createChatStore({
        projectKey,
        persistChatHistory: true,
      });

      persistentStore.setState((currentState) => ({
        ...currentState,
        threadId: 'test-thread-2',
        messages: [
          {
            id: crypto.randomUUID(),
            content: 'test-content-2',
            role: 'user',
            state: 'done',
            references: [],
          },
        ],
        threadIdsByProjectKey: {
          ...currentState.threadIdsByProjectKey,
          [projectKey]: ['test-thread-2'],
        },
        messagesByThreadId: {
          'test-thread-2': {
            lastUpdated: new Date().toISOString(),
            messages: [
              {
                id: crypto.randomUUID(),
                content: 'test-content-2',
                role: 'user',
                state: 'done',
                references: [],
              },
            ],
          },
        },
      }));

      // verify set state
      const localStorageKey = 'markprompt';
      const currentState = persistentStore.getState();
      expect(currentState.threadId).toBe('test-thread-2');
      expect(currentState.messages).toHaveLength(1);
      expect(localStorage.getItem(localStorageKey)).toBeTruthy();

      // verify clear storage
      currentState.clearStorage();

      // verify cleared state
      const clearedState = persistentStore.getState();
      expect(clearedState.threadId).toBeUndefined();
      expect(clearedState.messages).toEqual([]);

      // verify localStorage is updated
      const localStorageData = JSON.parse(
        localStorage.getItem(localStorageKey) || '{}',
      );
      expect(
        localStorageData.state?.threadIdsByProjectKey?.[projectKey],
      ).toEqual([]);
      expect(localStorageData.state?.messagesByThreadId).toEqual({});
    });
  });
});
