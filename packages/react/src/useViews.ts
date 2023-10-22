import { useCallback, useEffect, useState } from 'react';

import type { DefaultView } from './types.js';

export type View = 'chat' | 'prompt' | 'search';

interface UseViewsResult {
  activeView: View;
  setActiveView: (view: View) => void;
}

export function useViews(
  options: { chat?: boolean; search?: boolean },
  defaultView?: DefaultView,
): UseViewsResult {
  const { chat, search } = options;

  const numViewsEnabled = [chat || true, search].filter(Boolean).length;

  const [activeView, setActiveView] = useState<View>(() => {
    if (defaultView) return defaultView;
    if (search) return 'search';
    if (chat) return 'chat';
    return 'prompt';
  });

  const toggleActiveView = useCallback(() => {
    switch (activeView) {
      case 'chat':
      case 'prompt':
        return setActiveView('search');
      case 'search':
        return setActiveView(chat ? 'chat' : 'prompt');
    }
  }, [activeView, chat]);

  // update the active view when props change
  useEffect(() => {
    if (options.chat && activeView === 'prompt') {
      setActiveView('chat');
    } else if (!options.chat && activeView === 'chat') {
      setActiveView('prompt');
    }
  }, [options.chat, activeView]);

  // toggle the view when a hotkey is pressed
  useEffect(() => {
    if (numViewsEnabled === 1) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (
        (event.key === 'Enter' && event.ctrlKey) ||
        (event.key === 'Enter' && event.metaKey)
      ) {
        event.preventDefault();
        toggleActiveView();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [numViewsEnabled, toggleActiveView]);

  return { activeView, setActiveView };
}
