import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import fetcher from '../../lib/api/fetcher';
import { Post } from '../../typings/post';

export default function usePostsSWR(
  options: SWRConfiguration = {},
): SWRResponse<Post[], any> {
  const response = useSWR<Post[]>('/api/posts', (url) => fetcher(url, true), {
    ...options,
  });

  return response;
}
