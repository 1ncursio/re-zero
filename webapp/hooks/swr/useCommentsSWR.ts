import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import fetcher from '@lib/api/fetcher';
import { Comment } from '@typings/comment';
import useUserSWR from './useUserSWR';

export default function useCommentsSWR(
  { postId }: { postId: string },
  options: SWRConfiguration = {},
): SWRResponse<Comment[], any> {
  const response = useSWR<Comment[]>(`/api/posts/${postId}/comments`, fetcher, {
    ...options,
  });
  const { data: userData } = useUserSWR();

  return {
    ...response,
    data:
      response.data?.map((comment) => ({
        ...comment,
        isLiked: comment.likes.some((likedUser) => likedUser.id === userData?.id),
        isMine: comment.user.id === userData?.id,
      })) ?? [],
  };
}
