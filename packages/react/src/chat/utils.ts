import {
  isToolCalls,
  type ChatCompletionAssistantMessageParam,
  type ChatCompletionMessageParam,
  type ChatCompletionToolMessageParam,
} from '@markprompt/core/chat';

import type { ChatViewMessage } from '../types.js';
import { isPresent } from '../utils.js';

export function toValidApiMessages(
  messages: (ChatViewMessage & { tool_call_id?: string })[],
): ChatCompletionMessageParam[] {
  return (
    messages
      .map((message, i) => {
        switch (message.role) {
          case 'assistant': {
            const { content, role, tool_calls } = message;
            const msg: ChatCompletionAssistantMessageParam = {
              content: content ?? '',
              role,
            };

            if (isToolCalls(tool_calls)) {
              msg.tool_calls = tool_calls;
              // If this is a tool_calls assistant message and the next
              // message is not a tool message, ignore it, as it will
              // result in an invalid API request.
              const nextMessage = messages[i + 1];
              if (nextMessage && nextMessage.role !== 'tool') {
                return undefined;
              }
            }

            return msg;
          }
          case 'tool': {
            const { content, role, tool_call_id } = message;
            if (!tool_call_id) throw new Error('tool_call_id is required');
            return {
              content: content ?? '',
              role,
              tool_call_id,
            } satisfies ChatCompletionToolMessageParam;
          }
          case 'user': {
            const { content, role, name } = message;
            return {
              content: content ?? '',
              role,
              ...(name ? { name } : {}),
            } satisfies ChatCompletionMessageParam;
          }
        }
      })
      .filter(isPresent)
      // Remove the last message if role is assistant and content is null
      // and is not a tool call. We add this message locally as a placeholder
      // for ourselves, and our API will error if we send it.
      .filter(
        (m, i, arr) =>
          !(
            i === arr.length - 1 &&
            m.role === 'assistant' &&
            isToolCalls(m.tool_calls) &&
            m.content === null
          ),
      )
  );
}

// Source: https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6?permalink_comment_id=4594127#gistcomment-4594127.
// We use our own implementation here, rather than lodash.merge, since
// lodash.merge makes use of non-edge-compatible functions.
export const deepMerge = (target: any | null, source: any | null) => {
  const result = { ...(target ?? {}), ...(source ?? {}) };
  for (const key of Object.keys(result)) {
    result[key] =
      typeof target?.[key] === 'object' && typeof source?.[key] === 'object'
        ? deepMerge(target[key], source[key])
        : structuredClone(result[key]);
  }
  return result;
};

export const RealtimeChatEvent = {
  MESSAGE: 'message',
  MESSAGE_ACK: 'message-ack',
  ASSIGN_TO_AI: 'assign-to-ai',
} as const;
