import type {
  ChatCompletionsJsonResponse,
  FileSectionReference,
  FunctionCall,
} from './types';

export const getErrorMessage = async (res: Response): Promise<string> => {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return json?.error ?? text;
  } catch {
    return text;
  }
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

export function isFileSectionReferences(
  data: unknown,
): data is FileSectionReference[] {
  return (
    Array.isArray(data) &&
    Boolean(data[0]?.file?.path) &&
    Boolean(data[0]?.file?.source?.type)
  );
}

export function isAbortError(err: unknown): err is DOMException {
  return (
    (err instanceof DOMException && err.name === 'AbortError') ||
    (err instanceof Error && err.message.includes('AbortError'))
  );
}

export function isJsonResponse(
  json: unknown,
): json is ChatCompletionsJsonResponse {
  return (
    typeof json === 'object' &&
    json !== null &&
    'text' in json &&
    'functionCall' in json &&
    'references' in json &&
    'promptId' in json &&
    'conversationId' in json
  );
}

export function isFunctionCall(data: unknown): data is FunctionCall {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'arguments' in data
  );
}
