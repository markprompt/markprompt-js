import { Team } from '@/types/types';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../utils';
import useTeams from './use-teams';

export default function useTeam() {
  const router = useRouter();
  const { teams } = useTeams();
  const teamId = teams?.find((t) => t.slug === router.query.team)?.id;
  const {
    data: team,
    mutate,
    error,
  } = useSWR(teamId ? `/api/team/${teamId}` : null, fetcher<Team>);

  const loading = !team && !error;

  return { team, loading, mutate };
}
