// IMPORTANT: this code needs to be able to run on the Vercel edge runtime.
// Make sure no Node.js APIs are called/imported transitively.

import { CreateEmbeddingResponse, CreateModerationResponse } from 'openai';

export interface OpenAIStreamPayload {
  model: string;
  prompt: string;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

export const createModeration = async (
  input: string,
): Promise<CreateModerationResponse> => {
  return fetch('https://api.openai.com/v1/moderations', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    method: 'POST',
    body: JSON.stringify({ input }),
  }).then((r) => r.json());
};

export const createEmbedding = async (
  input: string,
): Promise<CreateEmbeddingResponse> => {
  return await fetch('https://api.openai.com/v1/embeddings', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: input.trim().replaceAll('\n', ' '),
    }),
  }).then((r) => r.json());
};
