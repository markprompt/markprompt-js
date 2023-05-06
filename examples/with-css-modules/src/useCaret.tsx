import { useEffect, useRef, useState } from 'react';

export function useCaret<T extends HTMLElement>() {
  const [ref, set] = useState<T | null>();

  useEffect(() => {
    console.log(ref);
    if (!ref) return;

    const observer = new MutationObserver((mutations) => {
      console.log(mutations);
    });

    observer.observe(ref, {
      childList: true,
      subtree: true,
    });

    console.log('observing', ref);

    return () => {
      observer.disconnect();
    };
  }, []);

  return set;
}
