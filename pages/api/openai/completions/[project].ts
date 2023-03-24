import type { NextRequest } from 'next/server';
import { createEmbedding, createModeration } from '@/lib/openai.edge';
import {
  I_DONT_KNOW,
  MAX_PROMPT_LENGTH,
  STREAM_SEPARATOR,
} from '@/lib/constants';
import { DbFile, OpenAIModel, Project } from '@/types/types';
import { createClient } from '@supabase/supabase-js';
import { backOff } from 'exponential-backoff';
import { CreateEmbeddingResponse } from 'openai';
import { oneLine, stripIndent } from 'common-tags';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';
import GPT3Tokenizer from 'gpt3-tokenizer';
import { getOrigin, stringToModel } from '@/lib/utils';
import { checkCompletionsRateLimits } from '@/lib/rate-limits';

const CONTEXT_TOKENS_CUTOFF = 800;

export const config = {
  runtime: 'edge',
};

// const MODEL: OpenAIModel = { type: 'chat_completions', value: 'gpt-3.5-turbo' };

const getPayload = (prompt: string, model: OpenAIModel) => {
  const payload = {
    model: model.value,
    temperature: 0.1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 500,
    stream: true,
    n: 1,
  };
  switch (model.type) {
    case 'chat_completions': {
      return {
        ...payload,
        messages: [{ role: 'user', content: prompt }],
      };
    }
    default: {
      return { ...payload, prompt };
    }
  }
};

const getChunkText = (response: any, model: OpenAIModel) => {
  switch (model.type) {
    case 'chat_completions': {
      return response.choices[0].delta.content;
    }
    default: {
      return response.choices[0].text;
    }
  }
};

export default async function handler(req: NextRequest) {
  // Preflight check
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 });
  }

  if (req.method !== 'POST') {
    return new Response(`Method ${req.method} Not Allowed`, { status: 405 });
  }

  const params = await req.json();
  const model = stringToModel(params.model);
  const prompt = (params.prompt as string).substring(0, MAX_PROMPT_LENGTH);
  const iDontKnowMessage = (params.iDontKnowMessage as string) || I_DONT_KNOW;

  const { pathname } = new URL(req.url);

  const projectIdParam = pathname.split('/').slice(-1)[0];

  if (!projectIdParam) {
    return new Response('No project found', { status: 400 });
  }

  if (!prompt) {
    return new Response('No prompt provided', { status: 400 });
  }

  const projectId = projectIdParam as Project['id'];

  // Apply rate limits, in additional to middleware rate limits.
  const rateLimitResult = await checkCompletionsRateLimits({
    value: projectId,
    type: 'projectId',
  });

  if (!rateLimitResult.result.success) {
    console.error(`[TRAIN] [RATE-LIMIT] Project ${projectId}, IP: ${req.ip}`);
    return new Response('Too many requests', { status: 429 });
  }

  const sanitizedQuery = prompt.trim().replaceAll('\n', ' ');

  // Moderate the content
  const moderationResponse = await createModeration(sanitizedQuery);
  if (moderationResponse?.results?.[0]?.flagged) {
    throw new Error('Flagged content');
  }

  let embeddingResult: CreateEmbeddingResponse | undefined = undefined;
  try {
    // Retry with exponential backoff in case of error. Typical cause is
    // too_many_requests.
    embeddingResult = await backOff(() => createEmbedding(sanitizedQuery), {
      startingDelay: 10000,
      numOfAttempts: 10,
    });
  } catch (error) {
    return new Response(
      `Error creating embedding for prompt '${prompt}': ${error}`,
      { status: 400 },
    );
  }

  const promptEmbedding = embeddingResult?.data?.[0]?.embedding;

  if (!promptEmbedding) {
    return new Response(`Error creating embedding for prompt '${prompt}'`, {
      status: 400,
    });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const {
    error,
    data: fileSections,
  }: {
    error: { message: string } | null;
    data:
      | {
          path: string;
          content: string;
          token_count: number;
          similarity: number;
        }[]
      | null;
  } = await supabase.rpc('match_file_sections', {
    embedding: promptEmbedding,
    match_threshold: 0.78,
    match_count: 10,
    min_content_length: 50,
  });

  if (error) {
    return new Response(`Error loading embeddings: ${error.message}`, {
      status: 400,
    });
  }

  if (!fileSections || fileSections?.length === 0) {
    return new Response('No relevant sections found', {
      status: 400,
    });
  }

  // const { completionsTokensCount } = await getTokenCountsForProject(projectId);

  // const maxTokenLimit = 500000;
  // if (completionsTokensCount > maxTokenLimit) {
  //   return new Response('Completions token limit exceeded.', {
  //     status: 429,
  //   });
  // }

  let numTokens = 0;
  let contextText = '';
  const references: DbFile['path'][] = [];
  for (const section of fileSections) {
    numTokens += section.token_count;

    if (numTokens >= CONTEXT_TOKENS_CUTOFF) {
      break;
    }

    contextText += `${section.content.trim()}\n---\n`;
    if (!references.includes(section.path)) {
      references.push(section.path);
    }
  }

  const fullPrompt = stripIndent`
  ${oneLine`You are a very enthusiastic company representative who loves to help people! Given the following sections from the documentation, answer the question using only that information, outputted in Markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "${
    iDontKnowMessage || I_DONT_KNOW
  }"`}

Context sections:
---
${contextText}

Question: "${sanitizedQuery}"

Answer (including related code snippets if available):`;

  const payload = getPayload(fullPrompt, model);

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  // All the text associated with this query, to estimate token
  // count.
  let allText = fullPrompt;
  let didSendHeader = false;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data;
          if (data === '[DONE]') {
            return;
          }

          try {
            if (!didSendHeader) {
              // Done sending chunks, send references
              const queue = encoder.encode(
                `${JSON.stringify(references || [])}${STREAM_SEPARATOR}`,
              );
              controller.enqueue(queue);
              didSendHeader = true;
            }
            const json = JSON.parse(data);
            const text = getChunkText(json, model);
            allText += text;
            if (counter < 2 && (text?.match(/\n/) || []).length) {
              // Prefix character (e.g. "\n\n"), do nothing
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }

      // Estimate the number of tokens used by this request.
      // TODO: update to gpt-4 tokenized if necessary.
      const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
      const allTextEncoded = tokenizer.encode(allText);
      const tokenCount = allTextEncoded.text.length;

      // await incrementMonthCompletionsTokenCountForProject(
      //   projectId,
      //   tokenCount,
      // );

      // We're done, wind down
      parser.reset();
      controller.close();
    },
  });

  return new Response(stream);
}
