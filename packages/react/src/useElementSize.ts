import { useLayoutEffect, useRef, useState, type RefObject } from 'react';

interface ElementSize {
  width: number;
  height: number;
}

function useElementSize<T extends Element>(): [RefObject<T>, ElementSize] {
  const ref = useRef<T>(null);

  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    let observer: ResizeObserver;
    let unmounted = false;

    const callback: ResizeObserverCallback = (entries) => {
      if (unmounted) return;
      if (!ref.current) return;

      for (const entry of entries) {
        if (entry.target === ref.current) {
          const { inlineSize: width, blockSize: height } =
            entry.borderBoxSize[0];
          setSize({ width, height });
        }
      }
    };

    if (ref.current) {
      observer = new ResizeObserver(callback);
      observer.observe(ref.current);
    }

    return () => {
      unmounted = true;
      observer.disconnect();
    };
  }, []);

  return [ref, size];
}

export { useElementSize };
