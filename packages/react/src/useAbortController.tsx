import { useCallback, useRef, type RefObject } from 'react';

interface useAbortControllerResult {
  ref: RefObject<AbortController | undefined | null>;
  abort: () => void;
}

export function useAbortController(): useAbortControllerResult {
  const ref = useRef<AbortController>(undefined);

  const abort = useCallback(() => {
    if (ref.current) {
      ref.current.abort();
      ref.current = undefined;
    }
  }, []);

  return { ref, abort };
}
