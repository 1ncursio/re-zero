import React, { FC, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { userThumbnail } from '../../assets/images';
import useCommentsSWR from '../../hooks/swr/useCommentsSWR';
import useRepliesSWR from '../../hooks/swr/useRepliesSWR';
import useUserSWR from '../../hooks/swr/useUserSWR';
import createReply from '../../lib/api/replies/createReply';
import optimizeImage from '../../lib/optimizeImage';

type ReplyFormProps = {
  commentId: number;
};

// eslint-disable-next-line no-undef
const ReplyForm: FC<ReplyFormProps> = ({ commentId }) => {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm();
  const { postId } = useParams<{ postId: string }>();

  const { data: userData } = useUserSWR();

  const { mutate: mutateComments } = useCommentsSWR({ postId });

  const { data: repliesData, mutate: mutateReplies } = useRepliesSWR({
    postId,
    commentId,
    shouldFetch: true,
  });

  const onSubmit = useCallback(
    async ({ content }: { content: string }) => {
      if (!userData || !content.trim()) return;

      try {
        await createReply({
          content,
          postId,
          commentId,
          mutateReplies,
          mutateComments,
          user: userData,
        });
        reset({ content: '' });
      } catch (error) {
        console.error(error);
      } finally {
        mutateReplies();
      }
    },
    [commentId, postId, mutateReplies, userData, reset],
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
        autoComplete="off"
        {...register('content', { required: true, maxLength: 200 })}
        className="w-full border-b border-blueGray-200 text-sm focus:outline-none focus:border-blueGray-400"
      />
      <button type="submit" hidden />
    </form>
  );
};

export default ReplyForm;
