import { useCallback, useRef } from 'react';

interface useAbortControllerResult {
  ref: React.MutableRefObject<AbortController | undefined>;
  abort: () => void;
}

export function useAbortController(): useAbortControllerResult {
  const ref = useRef<AbortController>();

  const abort = useCallback(() => {
    if (ref.current) {
      ref.current.abort();
      ref.current = undefined;
    }
  }, []);

  return {
    ref,
    abort,
  };
}
