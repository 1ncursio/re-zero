import useCommentsSWR from '@hooks/swr/useCommentsSWR';
import useRepliesSWR from '@hooks/swr/useRepliesSWR';
import useUserSWR from '@hooks/swr/useUserSWR';
import createReply from '@lib/api/replies/createReply';
import optimizeImage from '@lib/optimizeImage';
import { Avatar, Group, TextInput } from '@mantine/core';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

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
  const router = useRouter();
  const { postId } = router.query;

  const { data: userData } = useUserSWR();

  const { mutate: mutateComments } = useCommentsSWR({ postId: postId as string });

  const { data: repliesData, mutate: mutateReplies } = useRepliesSWR({
    postId: postId as string,
    commentId,
    shouldFetch: true,
  });

  const onSubmit = useCallback(
    async ({ content }: { content: string }) => {
      if (!userData || !content.trim()) return;

      try {
        await createReply({
          content,
          postId: postId as string,
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Group mb={16}>
        <Avatar src={optimizeImage(userData?.image_url)} alt="user" radius="xl" size="sm" />
        <TextInput
          placeholder="답글 추가"
          variant="default"
          autoComplete="off"
          sx={(theme) => ({ flexGrow: 1 })}
          {...register('content', { required: true, maxLength: 200 })}
        />
        <button type="submit" hidden />
      </Group>
    </form>
  );
};

export default ReplyForm;
