import produce from 'immer';
import { KeyedMutator } from 'swr';
import { Post } from '../../../typings/post';
import client from '../client';

export default async function updatePost({
  content,
  title,
  postId,
  mutatePost,
}: {
  content: string;
  title: string;
  postId: string | number;
  mutatePost: KeyedMutator<Post>;
}): Promise<Post> {
  mutatePost(
    produce((post?: Post) => {
      if (!post) return;

      post.content = content;
      post.title = title;
    }),
    false,
  );

  const response = await client.put(`/api/posts/${postId}`, {
    content,
    title,
  });

  mutatePost();

  return response.data.payload;
}
