import produce from 'immer';
import { KeyedMutator } from 'swr';
import { Comment } from '../../../typings/comment';
import client from '../client';

export default async function deleteReply({
  postId,
  commentId,
  mutateReplies,
  mutateComments,
}: {
  postId: string;
  commentId: number;
  mutateReplies: KeyedMutator<Comment[]>;
  mutateComments: KeyedMutator<Comment[]>;
}): Promise<Comment> {
  mutateReplies(
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

  mutateComments(
    produce((comments?: Comment[]) => {
      const comment = comments?.find((comment) => comment.id === commentId);
      if (comment) {
        comment.reply_count -= 1;
      }
    }),
    false,
  );

  const response = await client.delete(
    `/api/posts/${postId}/comments/${commentId}`,
  );

  mutateReplies();
  mutateComments();

  return response.data.payload;
}
