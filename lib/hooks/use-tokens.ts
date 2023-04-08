import useSWR from 'swr';

import { Token } from '@/types/types';

import useProject from './use-project';
import { fetcher } from '../utils';

export default function useTokens() {
  const { project } = useProject();
  const {
    data: tokens,
    mutate,
    error,
  } = useSWR(
    project?.id ? `/api/project/${project.id}/tokens` : null,
    fetcher<Token[]>,
  );

  const loading = !tokens && !error;

  return { tokens, loading, mutate };
}
