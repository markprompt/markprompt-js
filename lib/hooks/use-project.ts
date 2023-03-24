import { Project } from '@/types/types';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../utils';
import useProjects from './use-projects';

export default function useProject() {
  const router = useRouter();
  const { projects } = useProjects();
  const projectId = projects?.find((t) => t.slug === router.query.project)?.id;
  const {
    data: project,
    mutate,
    error,
  } = useSWR(projectId ? `/api/project/${projectId}` : null, fetcher<Project>);

  const loading = !project && !error;

  return { loading, project, mutate };
}
