import { useState } from 'react';

export type View = 'prompt' | 'search';

interface UseViewsResult {
  activeView: View;
  setActiveView: (view: View) => void;
}

export function useViews(isSearchEnabled?: boolean): UseViewsResult {
  const [activeView, setActiveView] = useState<View>(
    isSearchEnabled ? 'search' : 'prompt',
  );

  return { activeView, setActiveView };
}
