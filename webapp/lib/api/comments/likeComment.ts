import { Comment } from '../../../typings/comment';
import client from '../client';

export default async function likeComment({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}): Promise<Comment> {
  const response = await client.post(
    `/api/posts/${postId}/comments/${commentId}/likes`,
  );
  return response.data.payload;
}
