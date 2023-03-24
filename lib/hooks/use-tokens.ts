import { Token } from '@/types/types';
import useSWR from 'swr';
import { fetcher } from '../utils';
import useProject from './use-project';

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
