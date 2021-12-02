import produce from 'immer';
import { useCallback, useMemo } from 'react';
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
  isOpenReply = false,
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

  // const reply = useMemo(() => {
  //   console.log({ repliesData, commentId, replyId });
  //   if (!repliesData || !commentId || !replyId) return undefined;

  //   return repliesData.find((c) => c.id === replyId);
  // }, [repliesData, commentId, replyId]);

  const isAlreadyLikedReply = useMemo(() => {
    console.log(replyId);
    // console.log({ reply });
    if (!userData || !repliesData) return false;

    const reply = repliesData.find((c) => c.id === replyId);
    if (!reply) return false;

    return reply.likes.some((likedUser) => likedUser.id === userData.id);
    // return reply.likes.some((likedUser) => likedUser.id === userData.id);
  }, [userData, repliesData, replyId]);

  const fetchReplies = useCallback(async () => {
    mutateReplies();
  }, [mutateReplies]);

  const submitReply = useCallback(
    async (content: string) => {
      if (!content || !userData) return;

      await mutateReplies(
        produce((replies?: Comment[] | any) => {
          console.log({ replies });
          replies?.push({
            id: Math.floor(Math.random() * 100000),
            content,
            user: userData,
            likes: [],
            create_at: new Date(),
            reply_id: commentId,
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
    if (!userData || !replyId) return;

    if (isAlreadyLikedReply) {
      mutateReplies(
        produce((replies?: Comment[]) => {
          if (!replies) return;

          const replyIndex = replies.findIndex(
            (c: Comment) => c.id === replyId,
          );
          if (replyIndex === -1) return;
          // eslint-disable-next-line no-param-reassign
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
            (c: Comment) => c.id === replyId,
          );
          if (replyIndex === -1) return;
          replies[replyIndex].likes.push(userData);
        }),
        false,
      );
    }

    try {
      await likeComment({ postId, commentId: replyId.toString() });
    } catch (e) {
      if (!isAlreadyLikedReply) {
        mutateReplies(
          produce((replies: any) => {
            const replyIndex = replies.findIndex(
              (c: Comment) => c.id === replyId,
            );
            if (replyIndex === -1) return;
            // eslint-disable-next-line no-param-reassign
            replies[replyIndex].likes = replies[replyIndex].likes.filter(
              (likedUser: User) => likedUser.id !== userData.id,
            );
          }),
          false,
        );
      } else {
        mutateReplies(
          produce((replies: any) => {
            const replyIndex = replies.findIndex(
              (c: Comment) => c.id === replyId,
            );
            if (replyIndex === -1) return;
            replies[replyIndex].likes.push(userData);
          }),
          false,
        );
      }
    }
  }, [isAlreadyLikedReply, mutateReplies, postId, userData]);

  return {
    repliesData,
    isAlreadyLikedReply,
    toggleLikeReply,
    submitReply,
    fetchReplies,
    shouldFetch: isOpenReply,
  };
}
