import useRepliesSWR from '@hooks/swr/useRepliesSWR';
import updateReply from '@lib/api/replies/updateReply';
import { Comment } from '@typings/comment';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

type EditReplyFormProps = {
  reply: Comment;
  commentId: number;
  closeEditReplyForm: () => void;
};

const EditReplyForm: FC<EditReplyFormProps> = ({ reply, commentId, closeEditReplyForm }) => {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { postId } = router.query;

  const { mutate: mutateReplies } = useRepliesSWR({
    commentId,
    postId: postId as string,
    shouldFetch: true,
  });

  const onSubmitComment = useCallback(
    async (content: string) => {
      try {
        await updateReply({
          content,
          postId: postId as string,
          commentId: reply.id,
          mutateReplies,
        });
        reset({ content: '' });
        closeEditReplyForm();
      } catch (error) {
        console.error(error);
      }
    },
    [updateReply, postId],
  );

  const onSubmit = useCallback(
    async ({ content }: { content: string }) => {
      onSubmitComment(content);
    },
    [onSubmitComment],
  );

  useEffect(() => {
    setFocus('content');
    reset({ content: reply.content });
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

export default EditReplyForm;
