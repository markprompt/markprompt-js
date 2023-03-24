import { Team } from '@/types/types';
import useSWR from 'swr';
import { fetcher } from '../utils';
import useUser from './use-user';

export default function useTeams() {
  const { user } = useUser();
  const {
    data: teams,
    mutate,
    error,
  } = useSWR(user ? '/api/teams' : null, fetcher<Team[]>);

  const loading = !teams && !error;

  return { loading, teams, mutate };
}
