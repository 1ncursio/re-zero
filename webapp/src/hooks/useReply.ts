import produce from 'immer';
import { useCallback, useMemo, useState } from 'react';
import likeComment from '../lib/api/comments/likeComment';
import createReply from '../lib/api/replies/createReply';
import { Comment } from '../typings/comment';
import { User } from '../typings/user';
import useRepliesSWR from './swr/useRepliesSWR';
import useUserSWR from './swr/useUserSWR';
import useQuery from './useQuery';
import useToggle from './useToggle';

export default function useReply({
  postId,
  commentId,
}: {
  postId: string;
  commentId: number;
}) {
  const [shouldFetch, onToggleShouldFetch] = useToggle(false);
  const [replyPage, setReplyPage] = useState(1);
  //   const query = useQuery();
  const { data: userData } = useUserSWR();
  //   const { data: repliesData, mutate: mutateReplies } = useCommentsSWR({
  //     postId,
  //     page: query.get('page') ?? 1,
  //   });
  const { data: repliesData, mutate: mutateReplies } = useRepliesSWR({
    shouldFetch,
    postId,
    commentId: commentId ?? -1,
    page: replyPage,
  });

  const reply = useMemo(() => {
    if (!repliesData || !commentId) return undefined;

    return repliesData.find((c) => c.id === commentId);
  }, [repliesData, commentId]);

  const isAlreadyLikedComment = useMemo(() => {
    if (!userData || !reply) return false;

    return reply.likes.some((likedUser) => likedUser.id === userData.id);
  }, [reply, userData]);

  const toggleReply = useCallback(async () => {
    if (!commentId) return;

    onToggleShouldFetch();
    // setReplyPage(0);
  }, [commentId, onToggleShouldFetch]);

  const fetchReplies = useCallback(async () => {
    setReplyPage((prev) => prev + 1);
    onToggleShouldFetch();
    mutateReplies();
  }, [setReplyPage, onToggleShouldFetch, mutateReplies]);

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

  const toggleLikeComment = useCallback(async () => {
    if (!userData || !commentId) return;

    if (isAlreadyLikedComment) {
      mutateReplies(
        produce((replies?: Comment[]) => {
          if (!replies) return;

          const replyIndex = replies.findIndex(
            (c: Comment) => c.id === commentId,
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
            (c: Comment) => c.id === commentId,
          );
          if (replyIndex === -1) return;
          replies[replyIndex].likes.push(userData);
        }),
        false,
      );
    }

    try {
      await likeComment({ postId, commentId: commentId.toString() });
    } catch (e) {
      if (!isAlreadyLikedComment) {
        mutateReplies(
          produce((replies: any) => {
            const replyIndex = replies.findIndex(
              (c: Comment) => c.id === commentId,
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
              (c: Comment) => c.id === commentId,
            );
            if (replyIndex === -1) return;
            replies[replyIndex].likes.push(userData);
          }),
          false,
        );
      }
    }
  }, [isAlreadyLikedComment, reply, mutateReplies, postId, userData]);

  return {
    repliesData,
    isAlreadyLikedComment,
    toggleLikeComment,
    submitReply,
    fetchReplies,
    toggleReply,
    shouldFetch,
  };
}
