import { act } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import type * as zustand from 'zustand';

const {
  create: actualCreate,
  createStore: actualCreateStore,
  useStore: actualUseStore,
} = await vi.importActual<typeof zustand>('zustand');

// a variable to hold reset functions for all stores declared in the app
export const storeResetFns = new Set<() => void>();

const createUncurried = <T>(
  stateCreator: zustand.StateCreator<T>,
): zustand.UseBoundStore<zustand.StoreApi<T>> => {
  const store = actualCreate(stateCreator);
  const initialState = store.getState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
};

// when creating a store, we get its initial state, create a reset function and add it in the set
export const create = (<T>(stateCreator: zustand.StateCreator<T>) => {
  // to support curried version of create
  return typeof stateCreator === 'function'
    ? createUncurried(stateCreator)
    : createUncurried;
}) as typeof zustand.create;

const createStoreUncurried = <T>(
  stateCreator: zustand.StateCreator<T>,
): zustand.StoreApi<T> => {
  const store = actualCreateStore(stateCreator);
  const initialState = store.getState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
};

// when creating a store, we get its initial state, create a reset function and add it in the set
export const createStore = (<T>(stateCreator: zustand.StateCreator<T>) => {
  // to support curried version of createStore
  return typeof stateCreator === 'function'
    ? createStoreUncurried(stateCreator)
    : createStoreUncurried;
}) as typeof zustand.createStore;

afterEach(() => {
  act(() => {
    localStorage.clear();
    for (const resetFn of storeResetFns) {
      resetFn();
    }
  });
});

export { actualUseStore as useStore };
