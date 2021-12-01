import React, { FC, forwardRef, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { userThumbnail } from '../../assets/images';
import useUserSWR from '../../hooks/swr/useUserSWR';
import useComment from '../../hooks/useComment';
import useReply from '../../hooks/useReply';
import optimizeImage from '../../lib/optimizeImage';

type CommentFormProps = {
  isReply?: boolean;
  commentId?: number;
};

// eslint-disable-next-line no-undef
const CommentForm: FC<CommentFormProps> = ({ isReply, commentId = -1 }) => {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm();
  // const [content, onChangeContent] = useInput('');
  const { postId } = useParams<{ postId: string }>();

  const { data: userData } = useUserSWR();

  const { submitComment } = useComment({ postId });
  const { submitReply } = useReply({ postId, commentId });

  const onSubmitComment = useCallback(
    async (content: string) => {
      try {
        await submitComment(content);
        reset({ content: '' });
      } catch (error) {
        console.error(error);
      }
    },
    [submitComment, postId, reset],
  );

  const onSubmitReply = useCallback(
    async (content: string) => {
      try {
        await submitReply(content);
        reset({ content: '' });
      } catch (error) {
        console.error(error);
      }
    },
    [submitReply, postId, reset],
  );

  const onSubmit = useCallback(
    async ({ content }: { content: string }) => {
      if (isReply) {
        onSubmitReply(content);
      } else {
        onSubmitComment(content);
      }
    },
    [isReply, submitComment, submitReply],
  );

  useEffect(() => {
    if (isReply) {
      setFocus('content');
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mb-6">
      <img
        src={optimizeImage(userData?.image_url ?? userThumbnail)}
        alt="user"
        className={
          isReply ? 'w-6 h-6 rounded-full' : 'w-8 h-8 rounded-full mr-1'
        }
      />
      <input
        placeholder={isReply ? '답글 추가' : '댓글 추가'}
        {...register('content', { required: true, maxLength: 200 })}
        className="w-full border-b border-blueGray-200 text-sm focus:outline-none focus:border-blueGray-400"
      />
      <button type="submit" hidden />
    </form>
  );
};

export default CommentForm;
