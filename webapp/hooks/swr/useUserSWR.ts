import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import fetcher from '@lib/api/fetcher';
import { User } from '@typings/user';

export default function useUserSWR(
  options: SWRConfiguration = {},
): SWRResponse<User, any> & { isLoading: boolean } {
  const response = useSWR<User>('/api/user', fetcher, { ...options });

  return {
    ...response,
    isLoading: !response.error && !response.data,
  };
}
