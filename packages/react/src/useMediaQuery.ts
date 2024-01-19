import { useEffect, useState } from 'react';

export function useMediaQuery(mq: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(mq);
    const controller = new AbortController();

    setMatches(mediaQuery.matches);

    const listener = (): void => setMatches(mediaQuery.matches);

    mediaQuery.addEventListener('change', listener, {
      passive: true,
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [mq]);

  return matches;
}
