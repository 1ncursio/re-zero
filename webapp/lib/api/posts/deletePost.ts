import { Post } from '../../../typings/post';
import client from '../client';

export default async function deletePost({
  postId,
}: {
  postId: string;
}): Promise<Post> {
  const response = await client.delete(`/api/posts/${postId}`);

  return response.data.payload;
}
