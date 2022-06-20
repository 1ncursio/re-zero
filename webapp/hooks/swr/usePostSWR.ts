import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import fetcher from '../../lib/api/fetcher';
import { Post } from '../../typings/post';
import { User } from '../../typings/user';
import useUserSWR from './useUserSWR';

export default function usePostSWR(postId: string, options: SWRConfiguration = {}): SWRResponse<Post, Error> {
  const response = useSWR<Post>(`/api/posts/${postId}`, fetcher, {
    ...options,
  });
  const { data: userData } = useUserSWR();

  // if (response.data && userData) {
  return {
    ...response,
    data: response.data
      ? {
          ...response.data,
          isMine: userData?.id === response.data?.user_id,
          isLiked: response.data?.likes.some((likedUser: User) => likedUser.id === userData?.id) ?? false,
        }
      : undefined,
  };
  // }
}
