import { Domain } from '@/types/types';
import useSWR from 'swr';
import { fetcher } from '../utils';
import useProject from './use-project';

export default function useDomains() {
  const { project } = useProject();
  const {
    data: domains,
    mutate,
    error,
  } = useSWR(
    project?.id ? `/api/project/${project.id}/domains` : null,
    fetcher<Domain[]>,
  );

  const loading = !domains && !error;

  return { domains, loading, mutate };
}
