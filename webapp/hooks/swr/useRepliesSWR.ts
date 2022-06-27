import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import fetcher from '@lib/api/fetcher';
import { Comment } from '@typings/comment';
import useUserSWR from './useUserSWR';

export default function useRepliesSWR(
  {
    shouldFetch,
    postId,
    commentId,
  }: {
    shouldFetch: boolean;
    postId: string;
    commentId: number;
  },
  options: SWRConfiguration = {},
): SWRResponse<Comment[], any> {
  const response = useSWR<Comment[]>(
    shouldFetch ? `/api/posts/${postId}/comments/${commentId}/replies` : null,
    fetcher,
    {
      ...options,
    },
  );
  const { data: userData } = useUserSWR();

  return {
    ...response,
    data:
      response.data?.map((reply) => ({
        ...reply,
        isLiked: reply.likes.some((likedUser) => likedUser.id === userData?.id),
        isMine: reply.user.id === userData?.id,
      })) ?? [],
  };
}
