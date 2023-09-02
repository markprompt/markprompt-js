import { useCallback, useEffect, useState } from 'react';

import type { MarkpromptOptions } from './types.js';

export type View = 'chat' | 'prompt' | 'search';

interface UseViewsResult {
  activeView: View;
  setActiveView: (view: View) => void;
  toggleActiveView: () => void;
}

export function useViews(
  options: MarkpromptOptions,
  defaultView?: MarkpromptOptions['defaultView'],
): UseViewsResult {
  const { chat, search } = options;

  const [activeView, setActiveView] = useState<View>(() => {
    if (defaultView) return defaultView;
    if (search?.enabled) return 'search';
    if (chat?.enabled) return 'chat';
    return 'prompt';
  });

  const toggleActiveView = useCallback(() => {
    switch (activeView) {
      case 'chat':
      case 'prompt':
        return setActiveView('search');
      case 'search':
        return setActiveView(chat?.enabled ? 'chat' : 'prompt');
    }
  }, [activeView, chat?.enabled]);

  useEffect(() => {
    if (options.chat?.enabled && activeView === 'prompt') {
      setActiveView('chat');
    } else if (!options.chat?.enabled && activeView === 'chat') {
      setActiveView('prompt');
    }
  }, [options.chat?.enabled, activeView]);

  return { activeView, setActiveView, toggleActiveView };
}
