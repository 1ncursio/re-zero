import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useCommentsSWR from '@hooks/swr/useCommentsSWR';
import updateComment from '@lib/api/comments/updateComment';
import { Comment } from '@typings/comment';

type EditCommentFormProps = {
  comment: Comment;
  closeEditCommentForm: () => void;
};

const EditCommentForm: FC<EditCommentFormProps> = ({ comment, closeEditCommentForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { postId } = router.query;

  // const { data: userData } = useUserSWR();
  const { mutate: mutateComments } = useCommentsSWR({ postId: postId as string });

  const onSubmitComment = useCallback(
    async (content: string) => {
      try {
        await updateComment({
          content,
          postId: postId as string,
          commentId: comment.id,
          mutateComments,
        });
        reset({ content: '' });
        closeEditCommentForm();
      } catch (error) {
        console.error(error);
      }
    },
    [updateComment, postId],
  );

  const onSubmit = useCallback(
    async ({ content }: { content: string }) => {
      onSubmitComment(content);
    },
    [onSubmitComment],
  );

  useEffect(() => {
    setFocus('content');
    reset({ content: comment.content });
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-2">
      <input
        placeholder="댓글 수정"
        autoComplete="off"
        {...register('content', { required: true, maxLength: 200 })}
        className="w-full border-b border-blueGray-200 text-sm focus:outline-none focus:border-blueGray-400"
      />
      <button type="submit" hidden />
    </form>
  );
};

export default EditCommentForm;
