import { useState } from 'react';

import type { MarkpromptOptions, View } from './types';

interface UseViewsResult {
  activeView: View;
  setActiveView: (view: View) => void;
}

export function useViews(
  options: MarkpromptOptions,
  defaultView?: MarkpromptOptions['defaultView'],
): UseViewsResult {
  const { search } = options;

  const [activeView, setActiveView] = useState<View>(() => {
    if (defaultView) return defaultView;
    if (search?.enabled) return 'search';
    return 'chat';
  });

  return { activeView, setActiveView };
}
