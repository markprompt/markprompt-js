import { useRouter } from 'next/router';
import { useMemo } from 'react';
import useSWR from 'swr';

import { Project } from '@/types/types';

import useProjects from './use-projects';
import { fetcher } from '../utils';
import { getMarkpromptConfigOrDefault } from '../utils.browser';

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

  const config = useMemo(() => {
    return getMarkpromptConfigOrDefault(project?.markprompt_config);
  }, [project?.markprompt_config]);

  return { loading, project, config, mutate };
}
