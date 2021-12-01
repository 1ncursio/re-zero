import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import fetcher from '../../lib/api/fetcher';
import { Comment } from '../../typings/comment';

export default function useRepliesSWR(
  {
    shouldFetch,
    postId,
    commentId,
    page,
  }: {
    shouldFetch: boolean;
    postId: string;
    commentId: number;
    page: number | string;
  },
  options: SWRConfiguration = {},
): SWRResponse<Comment[], any> {
  const response = useSWR<Comment[]>(
    shouldFetch
      ? `/api/posts/${postId}/comments/${commentId}/replies?page=${page ?? 1}`
      : null,
    (url) => fetcher(url, true),
    {
      ...options,
    },
  );

  return response;
}
