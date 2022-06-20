import produce from 'immer';
import { KeyedMutator } from 'swr';
import useUserSWR from '../../../hooks/swr/useUserSWR';
import { Post } from '@typings/post';
import client from '../client';

export default async function toggleLikePost({
  postId,
  mutatePost,
}: {
  postId: string | number;
  mutatePost: KeyedMutator<Post>;
}): Promise<Post> {
  // const { data: userData } = useUserSWR();

  // if (!userData) {
  //   throw new Error('User not found');
  // }

  // mutatePost(
  //   produce((post?: Post) => {
  //     if (!post || !userData) return;

  //     if (post.isLiked) {
  //       post.isLiked = false;
  //       post.likes = post.likes.filter(
  //         (likedUser) => likedUser.id !== userData.id,
  //       );
  //     } else {
  //       post.isLiked = true;
  //       post.likes.push(userData);
  //     }
  //   }),
  //   false,
  // );

  const response = await client.post(`/api/posts/${postId}/likes`);

  // mutatePost();

  return response.data.payload;
}
