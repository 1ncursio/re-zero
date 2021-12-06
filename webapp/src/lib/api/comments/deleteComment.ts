import produce from 'immer';
import { KeyedMutator } from 'swr';
import { Comment } from '../../../typings/comment';
import client from '../client';

export default async function deleteComment({
  postId,
  commentId,
  mutateComments,
}: {
  postId: string;
  commentId: number;
  mutateComments: KeyedMutator<Comment[]>;
}): Promise<Comment> {
  mutateComments(
    produce((comments?: Comment[]) => {
      if (!comments) return;
      const commentIndex = comments.findIndex(
        (comment) => comment.id === commentId,
      );
      if (commentIndex === -1) return;
      comments.splice(commentIndex, 1);
    }),
    false,
  );

  const response = await client.delete(
    `/api/posts/${postId}/comments/${commentId}`,
  );

  mutateComments();

  return response.data.payload;
}
