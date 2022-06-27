import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import fetcher from '@lib/api/fetcher';
import { Post } from '@typings/post';
import useUserSWR from './useUserSWR';

export interface ILink {
  url: string;
  label: string;
  active: boolean;
}

export default function useSearchPostsSWR(
  { q, page }: { q: string | null; page: number | string },
  options: SWRConfiguration = {},
): SWRResponse<Post[], Error> & { links: ILink[]; total: number; last_page: number } {
  const response = useSWR<any>(q ? `/api/search?q=${q}&page=${page}` : null, fetcher, {
    ...options,
  });
  const { data: userData } = useUserSWR();

  return {
    ...response,
    data:
      response?.data?.data.map((post: Post) => ({
        ...post,
        isLiked: post.likes.some((likedUser) => likedUser.id === userData?.id),
        isMine: post.user.id === userData?.id,
      })) ?? [],
    links: response?.data?.links ?? [],
    total: response?.data?.total ?? 0,
    last_page: response?.data?.last_page ?? 1,
  };
}
