import produce from 'immer';
import { SetStateAction, useCallback, useMemo } from 'react';
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

  const isAlreadyLikedComment = useMemo(() => {
    if (!userData || !comment) return false;

    return comment.likes.some((likedUser) => likedUser.id === userData.id);
  }, [comment, userData]);

  const submitComment = useCallback(
    ({
        content,
        setContent,
      }: {
        content: string;
        setContent: (value: SetStateAction<string>) => void;
      }) =>
      async (e: any) => {
        e.preventDefault();
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
          setContent('');
        } catch (e) {
          console.error(e);
        }

        mutateComments();
      },
    [postId, userData, mutateComments],
  );

  const toggleLikeComment = useCallback(async () => {
    if (!userData || !commentId) return;

    if (isAlreadyLikedComment) {
      mutateComments(
        produce((comments?: Comment[]) => {
          if (!comments) return;

          const commentIndex = comments.findIndex(
            (c: Comment) => c.id === commentId,
          );
          if (commentIndex === -1) return;
          // eslint-disable-next-line no-param-reassign
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
      if (!isAlreadyLikedComment) {
        mutateComments(
          produce((comments: any) => {
            const commentIndex = comments.findIndex(
              (c: Comment) => c.id === commentId,
            );
            if (commentIndex === -1) return;
            // eslint-disable-next-line no-param-reassign
            comments[commentIndex].likes = comments[commentIndex].likes.filter(
              (likedUser: User) => likedUser.id !== userData.id,
            );
          }),
          false,
        );
      } else {
        mutateComments(
          produce((comments: any) => {
            const commentIndex = comments.findIndex(
              (c: Comment) => c.id === commentId,
            );
            if (commentIndex === -1) return;
            comments[commentIndex].likes.push(userData);
          }),
          false,
        );
      }
    }
  }, [isAlreadyLikedComment, comment, mutateComments, postId, userData]);

  return {
    isAlreadyLikedComment,
    toggleLikeComment,
    submitComment,
  };
}
