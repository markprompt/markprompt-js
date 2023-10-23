import type { FileSectionReference } from './types.js';

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

function isSerializable<T>(value: T): boolean {
  return !(
    value === undefined ||
    typeof value === 'function' ||
    typeof value === 'symbol' ||
    value instanceof Date ||
    value instanceof Map ||
    value instanceof Set ||
    value instanceof RegExp
  );
}

export function cleanNonSerializable(obj: { [key: string]: unknown }): {
  [key: string]: unknown;
} {
  const cleanObj: { [key: string]: unknown } = {};

  for (const [key, value] of Object.entries(obj)) {
    if (isSerializable(value)) {
      if (typeof value === 'object' && value !== null) {
        cleanObj[key] = cleanNonSerializable(
          value as { [key: string]: unknown },
        );
      } else {
        cleanObj[key] = value;
      }
    }
  }

  return cleanObj;
}
