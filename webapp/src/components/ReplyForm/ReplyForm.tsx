import React, { FC, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { userThumbnail } from '../../assets/images';
import useUserSWR from '../../hooks/swr/useUserSWR';
import useReply from '../../hooks/useReply';
import optimizeImage from '../../lib/optimizeImage';

type ReplyFormProps = {
  replyId: number;
};

// eslint-disable-next-line no-undef
const ReplyForm: FC<ReplyFormProps> = ({ replyId }) => {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm();
  const { postId } = useParams<{ postId: string }>();

  const { data: userData } = useUserSWR();

  const { submitReply } = useReply({ postId, commentId: replyId });

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
      onSubmitReply(content);
    },
    [submitReply],
  );

  useEffect(() => {
    setFocus('content');
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mb-6">
      <img
        src={optimizeImage(userData?.image_url ?? userThumbnail)}
        alt="user"
        className="w-6 h-6 rounded-full"
      />
      <input
        placeholder="답글 추가"
        {...register('content', { required: true, maxLength: 200 })}
        className="w-full border-b border-blueGray-200 text-sm focus:outline-none focus:border-blueGray-400"
      />
      <button type="submit" hidden />
    </form>
  );
};

export default ReplyForm;
