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
    it('should clear stored thread and message data', () => {
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
      expect(clearedState.threadIdsByProjectKey[projectKey]).toEqual([]);
      expect(clearedState.messagesByThreadId).toEqual({});
      expect(clearedState.toolCallsByToolCallId).toEqual({});
      expect(clearedState.didAcceptDisclaimerByProjectKey).toEqual({});
    });

    it('should clear localStorage when persistChatHistory is enabled', () => {
      const persistentStore = createChatStore({
        projectKey,
        persistChatHistory: true,
      });

      persistentStore.setState((currentState) => ({
        ...currentState,
        threadIdsByProjectKey: {
          ...currentState.threadIdsByProjectKey,
          [projectKey]: ['test-thread-2'],
        },
        messagesByThreadId: {
          'test-thread-2': {
            lastUpdated: new Date().toISOString(),
            messages: [],
          },
        },
      }));

      // verify set state
      const localStorageKey = 'markprompt';
      expect(localStorage.getItem(localStorageKey)).toBeTruthy();

      // verify clear storage
      const state = persistentStore.getState();
      state.clearStorage();

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
