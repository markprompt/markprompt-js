import { DbFile } from '@/types/types';
import useSWR from 'swr';
import { fetcher } from '../utils';
import useProject from './use-project';

export default function useFiles() {
  const { project } = useProject();
  const {
    data: files,
    mutate,
    error,
  } = useSWR(
    project?.id ? `/api/project/${project.id}/files` : null,
    fetcher<DbFile[]>,
  );

  const loading = !files && !error;

  return { files, loading, mutate };
}
