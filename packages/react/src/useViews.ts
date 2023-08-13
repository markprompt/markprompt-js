import { useCallback, useState } from 'react';

import type { MarkpromptOptions } from './types.js';

export type View = 'chat' | 'prompt' | 'search';

interface UseViewsResult {
  activeView: View;
  setActiveView: (view: View) => void;
  toggleActiveView: () => void;
}

export function useViews(
  prompt?: MarkpromptOptions['prompt'],
  search?: MarkpromptOptions['search'],
): UseViewsResult {
  const [activeView, setActiveView] = useState<View>(() => {
    if (search?.enabled) return 'search';
    if (prompt?.enableChat) return 'chat';
    return 'prompt';
  });

  const toggleActiveView = useCallback(() => {
    switch (activeView) {
      case 'chat':
      case 'prompt':
        return setActiveView('search');
      case 'search':
        return setActiveView(prompt?.enableChat ? 'chat' : 'prompt');
    }
  }, [activeView, prompt?.enableChat]);

  return { activeView, setActiveView, toggleActiveView };
}
