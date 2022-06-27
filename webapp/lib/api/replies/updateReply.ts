import produce from 'immer';
import { KeyedMutator } from 'swr';
import { Comment } from '@typings/comment';
import client from '../client';

export default async function updateReply({
  postId,
  commentId,
  content,
  mutateReplies,
}: {
  postId: string;
  commentId: number;
  content: string;
  mutateReplies: KeyedMutator<Comment[]>;
}): Promise<Comment> {
  mutateReplies(
    produce((comments?: Comment[]) => {
      if (!comments) return;
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) return;
      comment.content = content;
    }),
    false,
  );

  const response = await client.put(`/api/posts/${postId}/comments/${commentId}`, {
    content,
  });

  mutateReplies();
  return response.data.payload;
}
