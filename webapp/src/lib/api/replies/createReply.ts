import { Comment } from '../../../typings/comment';
import client from '../client';

export default async function createReply({
  postId,
  commentId,
  content,
}: {
  postId: string;
  commentId: number;
  content: string;
}): Promise<Comment> {
  const response = await client.post(
    `/api/posts/${postId}/comments/${commentId}/replies`,
    {
      content,
    },
  );
  return response.data.payload;
}
