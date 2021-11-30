import { Comment } from '../../../typings/comment';
import client from '../client';

export default async function createComment({
  postId,
  content,
}: {
  postId: string;
  content: string;
}): Promise<Comment> {
  const response = await client.post(`/api/posts/${postId}/comments`, {
    content,
  });
  return response.data.payload;
}
