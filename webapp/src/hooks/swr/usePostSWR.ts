import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import fetcher from '../../lib/api/fetcher';
import { User } from '../../typings/user';

export default function usePostSWR(
  options: SWRConfiguration = {},
): SWRResponse<User, any> {
  const response = useSWR<User>('/api/posts', (url) => fetcher(url, true), {
    ...options,
  });

  return response;
}
