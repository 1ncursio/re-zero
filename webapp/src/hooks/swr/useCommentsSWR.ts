import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import fetcher from '../../lib/api/fetcher';
import { Comment } from '../../typings/comment';

export default function useCommentsSWR(
  { postId, page }: { postId: string; page: number | string },
  options: SWRConfiguration = {},
): SWRResponse<Comment[], any> {
  const response = useSWR<Comment[]>(
    `/api/posts/${postId}/comments?page=${page ?? 1}`,
    (url) => fetcher(url, true),
    {
      ...options,
    },
  );

  return response;
}
