import { ChatCompletionsJsonResponse, FileSectionReference } from './types';

export const timeout = (ms: number) => {
  return new Promise((res) =>
    setTimeout(() => {
      res(true);
    }, ms),
  );
};

export const parseEncodedJSONHeader = (
  response: Response,
  name: string,
): unknown | undefined => {
  try {
    const headerValue = response.headers.get(name);
    if (headerValue) {
      const headerArray = new Uint8Array(headerValue.split(',').map(Number));
      const decoder = new TextDecoder();
      const decodedValue = decoder.decode(headerArray);
      return JSON.parse(decodedValue);
    }
  } catch (e) {
    // Do nothing
  }
  return undefined;
};

export function isJsonResponse(
  json: unknown,
): json is ChatCompletionsJsonResponse {
  return (
    typeof json === 'object' &&
    json !== null &&
    'text' in json &&
    'references' in json &&
    'promptId' in json &&
    'conversationId' in json
  );
}

export function isFileSectionReferences(
  data: unknown,
): data is FileSectionReference[] {
  return (
    Array.isArray(data) &&
    Boolean(data[0]?.file?.path) &&
    Boolean(data[0]?.file?.source?.type)
  );
}
