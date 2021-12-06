import produce from 'immer';
import { KeyedMutator } from 'swr';
import { Comment } from '../../../typings/comment';
import client from '../client';

export default async function updateComment({
  postId,
  commentId,
  content,
  mutateComments,
}: {
  postId: string;
  commentId: number;
  content: string;
  mutateComments: KeyedMutator<Comment[]>;
}): Promise<Comment> {
  mutateComments(
    produce((comments?: Comment[]) => {
      if (!comments) return;
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) return;
      comment.content = content;
    }),
    false,
  );

  const response = await client.put(
    `/api/posts/${postId}/comments/${commentId}`,
    {
      content,
    },
  );

  mutateComments();
  return response.data.payload;
}
