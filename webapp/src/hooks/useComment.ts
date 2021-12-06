import produce from 'immer';
import { useCallback, useMemo } from 'react';
import createComment from '../lib/api/comments/createComment';
import likeComment from '../lib/api/comments/likeComment';
import { Comment } from '../typings/comment';
import { User } from '../typings/user';
import useCommentsSWR from './swr/useCommentsSWR';
import useUserSWR from './swr/useUserSWR';
import useQuery from './useQuery';

export default function useComment({
  postId,
  commentId,
}: {
  postId: string;
  commentId?: number;
}) {
  const query = useQuery();
  const { data: userData } = useUserSWR();
  const { data: commentsData, mutate: mutateComments } = useCommentsSWR({
    postId,
    page: query.get('page') ?? 1,
  });

  const comment = useMemo(() => {
    if (!commentsData || !commentId) return undefined;

    return commentsData.find((c) => c.id === commentId);
  }, [commentsData, commentId]);

  const submitComment = useCallback(
    async (content: string) => {
      if (!content || !userData) return;

      mutateComments(
        produce((comments?: Comment[] | any) => {
          comments?.push({
            id: Math.floor(Math.random() * 100000),
            content,
            user: userData,
            likes: [],
          });
        }),
        false,
      );

      try {
        await createComment({ postId, content });
      } catch (e) {
        console.error(e);
      }

      mutateComments();
    },
    [postId, userData, mutateComments],
  );

  const toggleLikeComment = useCallback(async () => {
    if (!userData || !commentId || !comment) return;

    if (comment.isLiked) {
      mutateComments(
        produce((comments?: Comment[]) => {
          if (!comments) return;

          const commentIndex = comments.findIndex(
            (c: Comment) => c.id === commentId,
          );
          if (commentIndex === -1) return;
          comments[commentIndex].likes = comments[commentIndex].likes.filter(
            (likedUser: User) => likedUser.id !== userData.id,
          );
        }),
        false,
      );
    } else {
      mutateComments(
        produce((comments?: Comment[]) => {
          if (!comments) return;

          const commentIndex = comments.findIndex(
            (c: Comment) => c.id === commentId,
          );
          if (commentIndex === -1) return;
          comments[commentIndex].likes.push(userData);
        }),
        false,
      );
    }

    try {
      await likeComment({ postId, commentId: commentId.toString() });
    } catch (e) {
      console.error(e);
    } finally {
      mutateComments();
    }
  }, [comment, mutateComments, postId, userData]);

  return {
    toggleLikeComment,
    submitComment,
  };
}
