import { Project } from '@/types/types';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../utils';
import useTeams from './use-teams';

export default function useProjects() {
  const router = useRouter();
  const { teams } = useTeams();
  const teamId = teams?.find((t) => t.slug === router.query.team)?.id;
  const {
    data: projects,
    mutate,
    error,
  } = useSWR(
    teamId ? `/api/team/${teamId}/projects` : null,
    fetcher<Project[]>,
  );

  const loading = !projects && !error;

  return { loading, projects, mutate };
}
