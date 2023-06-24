import { useMemo, useState } from 'react';

export function useToggle(initial: boolean): [on: boolean, toggle: () => void] {
  const [on, set] = useState(initial);
  return useMemo(() => [on, () => set((prev) => !prev)], [on]);
}
