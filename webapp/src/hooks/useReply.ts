import produce from 'immer';
import { useCallback, useMemo } from 'react';
import likeComment from '../lib/api/comments/likeComment';
import { Comment } from '../typings/comment';
import { User } from '../typings/user';
import useRepliesSWR from './swr/useRepliesSWR';
import useUserSWR from './swr/useUserSWR';

export default function useReply({
  postId,
  commentId,
  replyId,
  isOpenReply = true,
}: {
  postId: string;
  commentId: number;
  replyId?: number;
  isOpenReply?: boolean;
}) {
  const { data: userData } = useUserSWR();
  const { data: repliesData, mutate: mutateReplies } = useRepliesSWR({
    shouldFetch: isOpenReply,
    postId,
    commentId,
    page: 1,
  });

  const reply = useMemo(() => {
    if (!repliesData || !replyId) return undefined;

    return repliesData.find((c) => c.id === replyId);
  }, [repliesData, replyId]);

  const toggleLikeReply = useCallback(async () => {
    if (!userData || !reply) return;

    if (reply.isLiked) {
      mutateReplies(
        produce((replies?: Comment[]) => {
          if (!replies) return;

          const replyIndex = replies.findIndex(
            (c: Comment) => c.id === reply.id,
          );
          if (replyIndex === -1) return;
          replies[replyIndex].likes = replies[replyIndex].likes.filter(
            (likedUser: User) => likedUser.id !== userData.id,
          );
        }),
        false,
      );
    } else {
      mutateReplies(
        produce((replies?: Comment[]) => {
          if (!replies) return;

          const replyIndex = replies.findIndex(
            (c: Comment) => c.id === reply.id,
          );
          if (replyIndex === -1) return;
          replies[replyIndex].likes.push(userData);
        }),
        false,
      );
    }

    try {
      await likeComment({ postId, commentId: reply.id.toString() });
    } catch (e) {
      console.error(e);
    } finally {
      mutateReplies();
    }
  }, [reply, mutateReplies, postId, userData]);

  return {
    toggleLikeReply,
    shouldFetch: isOpenReply,
  };
}
