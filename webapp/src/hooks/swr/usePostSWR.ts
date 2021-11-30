import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import fetcher from '../../lib/api/fetcher';
import { Post } from '../../typings/post';

export default function usePostSWR(
  postId: string,
  options: SWRConfiguration = {},
): SWRResponse<Post, any> {
  const response = useSWR<Post>(
    postId ? `/api/posts/${postId}` : null,
    fetcher,
    {
      ...options,
    },
  );

  return response;
}
