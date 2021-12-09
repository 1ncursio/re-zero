import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import fetcher from '../../lib/api/fetcher';
import { IAIHistory } from '../../typings/IAIHistory';

export interface UsersAIHistoriesSWR {
  histories: IAIHistory[];
  count: {
    black_win: number;
    white_win: number;
    draw: number;
  };
  black_win_rate: number;
}

export default function useUsersAIHistoriesSWR(
  options: SWRConfiguration = {},
): SWRResponse<UsersAIHistoriesSWR, Error> {
  const response = useSWR<UsersAIHistoriesSWR>(
    '/api/history/ai/user',
    fetcher,
    {
      ...options,
    },
  );

  return response;
}
