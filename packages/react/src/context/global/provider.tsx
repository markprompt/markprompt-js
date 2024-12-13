import { useEffect, useRef, type ReactNode, type JSX } from 'react';

import {
  createGlobalStore,
  type GlobalOptions,
  type GlobalStore,
} from './store.js';
import { GlobalStoreContext } from './store.js';
import { getEnabledViews, getInitialView } from './utils.js';

interface GlobalStoreProviderProps {
  options: GlobalOptions;
  children: ReactNode;
}

function updateStateOnOptionsChange(
  store: GlobalStore,
  nextOptions: GlobalOptions,
): void {
  const activeView = store.getState().activeView;
  const nextInitialView = getInitialView(nextOptions);
  const nextEnabledViews = getEnabledViews(nextOptions);

  // only change the active view to the nextInitialView if the current view is no longer enabled
  store?.setState({
    activeView: nextEnabledViews.includes(activeView)
      ? activeView
      : nextInitialView,
    options: nextOptions,
  });
}

export function GlobalStoreProvider(
  props: GlobalStoreProviderProps,
): JSX.Element {
  const { options, children } = props;

  const store = useRef<GlobalStore>(null);

  if (!store.current) {
    store.current = createGlobalStore(options);
  }

  useEffect(() => {
    if (!store.current) return;
    updateStateOnOptionsChange(store.current, options);
  }, [options]);

  return (
    <GlobalStoreContext.Provider value={store.current}>
      {children}
    </GlobalStoreContext.Provider>
  );
}
