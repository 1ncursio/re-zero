import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import fetcher from '../../lib/api/fetcher';
import { IAIHistory } from '../../typings/IAIHistory';

export interface AIHistoriesSWR {
  histories: IAIHistory[];
  count: {
    black_win: number;
    white_win: number;
    draw: number;
  };
  white_win_rate: number;
}

export default function useAIHistoriesSWR(
  options: SWRConfiguration = {},
): SWRResponse<AIHistoriesSWR, Error> {
  const response = useSWR<AIHistoriesSWR>('/api/history/ai', fetcher, {
    ...options,
  });

  return response;
}
