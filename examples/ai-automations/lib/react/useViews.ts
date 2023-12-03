import { useCallback, useEffect, useState } from 'react';

import type { MarkpromptOptions } from './types';

export type View = 'chat' | 'prompt' | 'search';

interface UseViewsResult {
  activeView: View;
  setActiveView: (view: View) => void;
}

export function useViews(
  options: MarkpromptOptions,
  defaultView?: MarkpromptOptions['defaultView'],
): UseViewsResult {
  const { chat, search } = options;

  const numViewsEnabled = [chat?.enabled || true, search?.enabled].filter(
    Boolean,
  ).length;

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

  // update the active view when props change
  useEffect(() => {
    if (options.chat?.enabled && activeView === 'prompt') {
      setActiveView('chat');
    } else if (!options.chat?.enabled && activeView === 'chat') {
      setActiveView('prompt');
    }
  }, [options.chat?.enabled, activeView]);

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
