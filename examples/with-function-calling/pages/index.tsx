import { SubmitChatYield, submitChat } from '@markprompt/core';
import Head from 'next/head';
import type { OpenAI } from 'openai';
import { ReactElement, useCallback, useState } from 'react';

interface ChatCompletionExecution {
  run?: (args: unknown) => void;
}

const tools: (OpenAI.ChatCompletionTool & ChatCompletionExecution)[] = [
  {
    type: 'function',
    function: {
      name: 'get_current_weather',
      description: 'Get the current weather in a given location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city and state, e.g. San Francisco, CA',
          },
          unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
        },
        required: ['location'],
      },
    },
    run: (args) => {
      // eslint-disable-next-line no-console
      console.debug(
        'Calling get_current_weather with arguments',
        JSON.stringify(args, null, 2),
      );
    },
  },
];

export default function IndexPage(): ReactElement {
  const [input, setInput] = useState('');
  const [streamedMessage, setStreamedMessage] = useState('');

  const submitForm = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setStreamedMessage('Fetching response...');

      let acc = {} as SubmitChatYield;

      const toolCalls: OpenAI.Chat.Completions.ChatCompletionChunk.Choice.Delta.ToolCall[] =
        [];
      for await (const chunk of submitChat(
        [
          {
            role: 'system',
            content: 'You are an expert AI assistant who loves to help people.',
          },
          {
            role: 'user',
            content: input,
          },
        ],
        process.env.NEXT_PUBLIC_PROJECT_API_KEY!,
        {
          apiUrl: process.env.NEXT_PUBLIC_MARKPROMPT_API_URL + '/chat',
          tools: tools,
        },
      )) {
        if (chunk.content) {
          setStreamedMessage(chunk.content);
        }

        acc = { ...acc, ...chunk };
      }

      for (const toolCall of acc.tool_calls || []) {
        if (!toolCall.function) {
          continue;
        }
        const tool = tools.find(
          (t) => t.function.name === toolCall.function?.name,
        );
        if (tool) {
          tool.run?.(toolCall.function?.arguments);
          setStreamedMessage(
            `Calling: ${tool.function.name}\n\nArguments:\n\n${
              JSON.stringify(toolCall.function?.arguments, null, 2) || {}
            }`,
          );
        }
      }
    },
    [input],
  );

  return (
    <>
      <Head>
        <title>Function calling</title>
        <meta charSet="utf-8" />
      </Head>
      <div className="Container">
        <form className="InputForm" onSubmit={submitForm}>
          <label className="label" htmlFor="input">
            Input
          </label>
          <input
            id="input"
            type="text"
            placeholder="What is the weather in Paris?"
            onChange={(e) => setInput(e.target.value)}
          ></input>
        </form>
        <div className="Output">
          <p className="label">Output</p>
          <div className="OutputLogs">
            <pre>
              <code>{streamedMessage}</code>
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
