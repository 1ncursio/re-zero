import produce from 'immer';
import { useCallback } from 'react';
import likeComment from '../lib/api/comments/likeComment';
import createReply from '../lib/api/replies/createReply';
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
    commentId: commentId ?? -1,
    page: 1,
  });

  // const fetchReplies = useCallback(async () => {
  //   mutateReplies();
  // }, [mutateReplies]);

  const submitReply = useCallback(
    async (content: string) => {
      if (!content || !userData) return;

      await mutateReplies(
        produce((replies?: Comment[]) => {
          console.log({ replies });
          replies?.push({
            id: Math.floor(Math.random() * 100000),
            content,
            user: userData,
            likes: [],
            created_at: new Date(),
            updated_at: new Date(),
            reply_id: commentId,
            isLiked: false,
            isMine: true,
            post_id: +postId,
            reply_count: 0,
            user_id: userData.id,
          });
        }),
        false,
      );

      console.log('mutate invoked');

      try {
        await createReply({ postId, content, commentId });
      } catch (e) {
        console.error(e);
      }

      mutateReplies();
    },
    [postId, userData, mutateReplies, commentId],
  );

  const toggleLikeReply = useCallback(async () => {
    const reply = repliesData?.find((r) => r.id === replyId);

    if (!userData || !reply) return;

    if (reply.isLiked) {
      console.log('이미 좋아요를 누른 상태입니다.');
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
          replies[replyIndex].isLiked = false;
        }),
        false,
      );
    } else {
      console.log('좋아요를 누르겠습니다.');
      mutateReplies(
        produce((replies?: Comment[]) => {
          if (!replies) return;

          const replyIndex = replies.findIndex(
            (c: Comment) => c.id === reply.id,
          );
          if (replyIndex === -1) return;
          replies[replyIndex].likes.push(userData);
          replies[replyIndex].isLiked = true;
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
  }, [mutateReplies, postId, userData]);

  return {
    repliesData,
    toggleLikeReply,
    submitReply,
    shouldFetch: isOpenReply,
  };
}
