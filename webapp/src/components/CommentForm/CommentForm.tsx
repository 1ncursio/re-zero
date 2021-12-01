import React, { forwardRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { userThumbnail } from '../../assets/images';
import useUserSWR from '../../hooks/swr/useUserSWR';
import useComment from '../../hooks/useComment';
import optimizeImage from '../../lib/optimizeImage';

type CommentFormProps = {
  isReply?: boolean;
};

// eslint-disable-next-line no-undef
const CommentForm = forwardRef<HTMLInputElement, CommentFormProps>(
  ({ isReply }, ref) => {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm();
    // const [content, onChangeContent] = useInput('');
    const { postId } = useParams<{ postId: string }>();

    const { data: userData } = useUserSWR();

    const { submitComment } = useComment({ postId });

    const onSubmitComment = useCallback(
      async (data) => {
        console.log({ data });
        const { content } = data;
        // console.log({ content });
        try {
          await submitComment(content);
          reset({ content: '' });
        } catch (error) {
          console.error(error);
        }
      },
      [submitComment, postId, reset],
    );

    const test = (data: any) => console.log({ data });

    return (
      <form onSubmit={handleSubmit(test)} className="flex gap-2 mb-6">
        <img
          src={optimizeImage(userData?.image_url ?? userThumbnail)}
          alt="user"
          className={
            isReply ? 'w-6 h-6 rounded-full' : 'w-8 h-8 rounded-full mr-1'
          }
        />
        <input
          type="text"
          placeholder={isReply ? '답글 추가' : '댓글 추가'}
          {...register('content', { required: true, maxLength: 200 })}
          id="content"
          className="w-full border-b border-blueGray-200 text-sm focus:outline-none focus:border-blueGray-400"
          ref={ref}
        />
        <button type="submit" hidden />
      </form>
    );
  },
);

export default CommentForm;
