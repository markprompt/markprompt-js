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

function isSerializable<T>(val: T, seen = new Set()): boolean {
  if (val === null) {
    return true;
  }
  if (typeof val === 'object' || typeof val === 'function') {
    if (seen.has(val)) {
      return false; // Detect circular references
    }

    seen.add(val);

    for (const key in val) {
      if (!isSerializable(val[key], seen)) {
        return false;
      }
    }
  }
  if (
    typeof val === 'function' ||
    typeof val === 'symbol' ||
    typeof val === 'undefined'
  ) {
    return false;
  }
  return true;
}

export function cleanNonSerializable(obj: { [key: string]: unknown }): {
  [key: string]: unknown;
} {
  const cleanObj: { [key: string]: unknown } = {};
  for (const key in obj) {
    if (isSerializable(obj[key])) {
      cleanObj[key] =
        typeof obj[key] === 'object'
          ? cleanNonSerializable(obj[key] as { [key: string]: unknown })
          : obj[key];
    }
  }
  return cleanObj;
}
