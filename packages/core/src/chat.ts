import defaults from 'defaults';

import {
  DEFAULT_COMPLETIONS_OPTIONS,
  type CompletionsOptions,
} from './constants.js';
import type { FileSectionReference } from './types.js';
import { isFileSectionReferences, parseEncodedJSONHeader } from './utils.js';

export interface SubmitChatOptions extends CompletionsOptions {
  /**
   * URL at which to fetch completions
   * @default "https://api.markprompt.com/v1/chat"
   * */
  apiUrl?: string;
  /**
   * AbortController signal
   * @default undefined
   **/
  signal?: AbortSignal;
}

type DefaultSubmitChatOptions = Omit<Required<SubmitChatOptions>, 'signal'> &
  Pick<SubmitChatOptions, 'signal'>;

export const STREAM_SEPARATOR = '___START_RESPONSE_STREAM___';

export const DEFAULT_SUBMIT_CHAT_OPTIONS = {
  ...DEFAULT_COMPLETIONS_OPTIONS,
  apiUrl: 'https://api.markprompt.com/v1/chat',
} satisfies DefaultSubmitChatOptions;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Submit a prompt to the Markprompt Chat API.
 *
 * @param messages - Chat messages to submit to the model
 * @param projectKey - Project key for the project
 * @param onAnswerChunk - Answers come in via streaming. This function is called when a new chunk arrives
 * @param onReferences - This function is called when a chunk includes references.
 * @param onError - Called when an error occurs
 * @param [options] - Optional parameters
 */
export async function submitChat(
  messages: ChatMessage[],
  projectKey: string,
  onAnswerChunk: (answerChunk: string) => boolean | undefined | void,
  onReferences: (references: FileSectionReference[]) => void,
  onPromptId: (promptId: string) => void,
  onError: (error: Error) => void,
  options: SubmitChatOptions = {},
  debug?: boolean,
): Promise<void> {
  if (!projectKey) {
    throw new Error('A projectKey is required.');
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) return;

  try {
    // todo: look into typing this properly
    const resolvedOptions = defaults(
      { ...options },
      DEFAULT_SUBMIT_CHAT_OPTIONS,
    ) as DefaultSubmitChatOptions;

    const res = await fetch(resolvedOptions.apiUrl, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        messages: messages,
        projectKey: projectKey,
        ...resolvedOptions,
      }),
      signal: resolvedOptions.signal,
    });

    if (!res.ok || !res.body) {
      const text = await res.text();
      onAnswerChunk(resolvedOptions.iDontKnowMessage!);
      onError(new Error(text));
      return;
    }

    const data = parseEncodedJSONHeader(res, 'x-markprompt-data');
    const debugInfo = parseEncodedJSONHeader(res, 'x-markprompt-debug-info');

    if (debug && debugInfo) {
      // eslint-disable-next-line no-console
      console.debug(JSON.stringify(debugInfo, null, 2));
    }

    if (
      typeof data === 'object' &&
      data !== null &&
      'references' in data &&
      isFileSectionReferences(data.references)
    ) {
      onReferences(data?.references);
    }

    if (
      typeof data === 'object' &&
      data !== null &&
      'promptId' in data &&
      typeof data.promptId === 'string'
    ) {
      onPromptId(data?.promptId);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      if (chunkValue) {
        const shouldContinue = onAnswerChunk(chunkValue);
        if (!shouldContinue) {
          // If callback returns false, it means it wishes
          // to interrupt the streaming.
          done = true;
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error(`${error}`));
  }
}
