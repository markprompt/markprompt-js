import useSWR from 'swr';

import { Team } from '@/types/types';

import useUser from './use-user';
import { fetcher } from '../utils';

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
