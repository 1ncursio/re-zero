import React, { useCallback, useEffect, VFC } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { userThumbnail } from '../../assets/images';
import useUserSWR from '../../hooks/swr/useUserSWR';
import useComment from '../../hooks/useComment';
import optimizeImage from '../../lib/optimizeImage';

// eslint-disable-next-line no-undef
const CommentForm: VFC = () => {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm();
  const { postId } = useParams<{ postId: string }>();

  const { data: userData } = useUserSWR();

  const { submitComment } = useComment({ postId });

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

  const onSubmit = useCallback(
    async ({ content }: { content: string }) => {
      onSubmitComment(content);
    },
    [onSubmitComment],
  );

  useEffect(() => {
    setFocus('content');
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mb-6">
      <img
        src={optimizeImage(userData?.image_url ?? userThumbnail)}
        alt="user"
        className="w-8 h-8 rounded-full mr-1"
      />
      <input
        placeholder="댓글 추가"
        {...register('content', { required: true, maxLength: 200 })}
        autoComplete="off"
        className="w-full border-b border-blueGray-200 text-sm focus:outline-none focus:border-blueGray-400"
      />
      <button type="submit" hidden />
    </form>
  );
};

export default CommentForm;
