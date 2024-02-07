import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMarkpromptStore = create(
  persist(
    () => ({
      clientId: crypto.randomUUID(),
    }),
    {
      name: 'markprompt-global-store',
      version: 1,
    },
  ),
);
