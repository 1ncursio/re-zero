import useSWR, { KeyedMutator, SWRConfiguration, SWRResponse } from 'swr';
import fetcher from '../../lib/api/fetcher';
import { Post } from '../../typings/post';
import useUserSWR from './useUserSWR';

export interface ILink {
  url: string;
  label: string;
  active: boolean;
}

export interface PostsSWRResponse extends SWRResponse<Post[], Error> {
  data: Post[];
  // error: Error;
  // isValidating: boolean;
  // current_page: number;
  // first_page_url: string;
  // from: number;
  // last_page: number;
  // last_page_url: string;
  links: ILink[];
  // next_page_url: string;
  // path: string;
  // per_page: number;
  // prev_page_url: null;
  // to: number;
  // total: number;
}

export default function usePostsSWR(
  { page }: { page: number | string },
  options: SWRConfiguration = {},
): SWRResponse<Post[], Error> & { links: ILink[] } {
  const response = useSWR<any>(
    `/api/posts?page=${page ?? 1}`,
    // (url) => fetcher(url, true),
    fetcher,
    {
      ...options,
    },
  );
  const { data: userData } = useUserSWR({ ...options });

  return {
    ...response,
    data:
      response?.data?.data.map((post: Post) => ({
        ...post,
        isLiked: post.likes.some((likedUser) => likedUser.id === userData?.id),
        isMine: post.user.id === userData?.id,
      })) ?? [],
    links: response?.data?.links ?? [],
  };
}
