import useSWR from 'swr';

import { Domain } from '@/types/types';

import useProject from './use-project';
import { fetcher } from '../utils';

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
