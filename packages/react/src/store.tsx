import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  clientId: string;
  userData: { [key: string]: unknown } | undefined;
}

export const useMarkpromptStore = create(
  persist<State>(
    () => ({
      clientId: crypto.randomUUID(),
      userData: undefined,
    }),
    {
      name: 'markprompt-global-store',
      version: 1,
    },
  ),
);
