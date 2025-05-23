import {
  type ChatCompletionMessageParam,
  type SubmitChatYield,
  submitChat,
} from '@markprompt/core/chat';
import Head from 'next/head';
import type { ChatCompletionTool } from 'openai/resources/chat/completions';
import { useCallback, useState } from 'react';
import type { FormEvent, JSX } from 'react';

interface ChatCompletionExecution {
  run?: (args: unknown) => void;
}

const tools: (ChatCompletionTool & ChatCompletionExecution)[] = [
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
      console.debug(
        'Calling get_current_weather with arguments',
        JSON.stringify(args, null, 2),
      );
    },
  },
];

export default function IndexPage(): JSX.Element {
  const [input, setInput] = useState('');
  const [streamedMessage, setStreamedMessage] = useState('');

  const submitForm = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setStreamedMessage('Fetching response...');

      let acc = {} as SubmitChatYield;

      const messages = [
        {
          role: 'system',
          content: 'You are an expert AI assistant who loves to help people.',
        },
        {
          role: 'user',
          content: input,
        },
      ] as ChatCompletionMessageParam[];

      const submitChatOptions = {
        tools: tools.map((tool) => {
          const { run, ...rest } = tool;
          return rest;
        }),
      };

      for await (const chunk of submitChat(
        messages,
        process.env.NEXT_PUBLIC_PROJECT_API_KEY!,
        submitChatOptions,
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
              toolCall.function?.arguments || JSON.stringify({})
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
        <form
          className="InputForm"
          onSubmit={(event) => {
            void submitForm(event);
          }}
        >
          <label className="label" htmlFor="input">
            Input
          </label>
          <input
            id="input"
            type="text"
            placeholder="What is the weather in Paris?"
            onChange={(e) => setInput(e.target.value)}
          />
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
