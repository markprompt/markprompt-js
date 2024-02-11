import {
  isToolCalls,
  type ChatCompletionAssistantMessageParam,
  type ChatCompletionMessageParam,
  type ChatCompletionToolMessageParam,
} from '@markprompt/core';

import type { ChatViewMessage } from './store.js';
import { isPresent } from '../utils.js';

export function toApiMessages(
  messages: (ChatViewMessage & { tool_call_id?: string })[],
): ChatCompletionMessageParam[] {
  return (
    messages
      .map(({ content, role, tool_calls, tool_call_id, name }) => {
        if (!content) {
          // Ignore empty messages
          return undefined;
        }
        switch (role) {
          case 'assistant': {
            const msg: ChatCompletionAssistantMessageParam = {
              content: content ?? null,
              role,
            };

            if (isToolCalls(tool_calls)) msg.tool_calls = tool_calls;

            return msg;
          }
          case 'tool': {
            if (!tool_call_id) throw new Error('tool_call_id is required');
            return {
              content: content ?? null,
              role,
              tool_call_id,
            } satisfies ChatCompletionToolMessageParam;
          }
          case 'user': {
            return {
              content: content ?? null,
              role,
              ...(name ? { name } : {}),
            } satisfies ChatCompletionMessageParam;
          }
        }
      })
      .filter(isPresent)
      // remove the last message if role is assistant and content is null
      // we add this message locally as a placeholder for ourself and OpenAI errors out
      // if we send it to them
      .filter(
        (m, i, arr) =>
          !(
            i === arr.length - 1 &&
            m.role === 'assistant' &&
            m.content === null
          ),
      )
  );
}
