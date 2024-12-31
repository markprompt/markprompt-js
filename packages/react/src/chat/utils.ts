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
      .map(({ content, role, tool_calls, tool_call_id, name }, i) => {
        switch (role) {
          case 'assistant': {
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
            if (!tool_call_id) throw new Error('tool_call_id is required');
            return {
              content: content ?? '',
              role,
              tool_call_id,
            } satisfies ChatCompletionToolMessageParam;
          }
          case 'user': {
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
