import { useRect } from '@reach/rect';
import { useEffect, useState } from 'react';

export const useTop = (ref: any) => {
  const [top, setTop] = useState<number | undefined>(undefined);
  const rect = useRect(ref);
  const rectTop = rect ? rect.top : undefined;

  useEffect(() => {
    if (typeof rectTop === 'undefined') return;
    const newTop = rectTop + window.pageYOffset;
    if (newTop !== top) {
      setTop(newTop);
    }
  }, [rectTop, top]);

  return top;
};
