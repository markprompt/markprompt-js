import {
  createContext,
  useContext,
  type ReactNode,
  useRef,
  useEffect,
} from 'react';
import { createStore, useStore, type StoreApi } from 'zustand';

import type { MarkpromptOptions, View } from './types.js';

interface State {
  options: MarkpromptOptions;
  activeView: View;
}

interface Actions {
  setActiveView: (view: View) => void;
}

export type GlobalStore = StoreApi<State & Actions>;

function getInitialView(options: MarkpromptOptions): View {
  if (options.defaultView) return options.defaultView;
  if (options?.search?.enabled) return 'search';
  return 'chat';
}

function getEnabledViews(options: MarkpromptOptions): View[] {
  const views: View[] = ['chat'];

  if (options?.search?.enabled) views.push('search');
  if (typeof options?.integrations?.createTicket === 'string') {
    views.push('create-ticket');
  }

  return views;
}

export const createGlobalStore = (options: MarkpromptOptions): GlobalStore => {
  return createStore((set) => ({
    options,
    activeView: getInitialView(options),
    setActiveView: (view: View) => set({ activeView: view }),
  }));
};

export const GlobalStoreContext = createContext<GlobalStore | undefined>(
  undefined,
);

interface GlobalStoreProviderProps {
  options: MarkpromptOptions;
  children: ReactNode;
}

function updateStateOnOptionsChange(
  store: GlobalStore,
  nextOptions: MarkpromptOptions,
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

  const store = useRef<GlobalStore>();

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

export function useGlobalStore<T>(selector: (state: State & Actions) => T): T {
  const store = useContext(GlobalStoreContext);
  if (!store) {
    throw new Error(
      'Missing GlobalStoreProvider. Make sure to wrap your component tree with <GlobalStoreProvider />.',
    );
  }
  return useStore(store, selector);
}
