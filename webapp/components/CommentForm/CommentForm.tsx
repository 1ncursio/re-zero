import useUserSWR from '@hooks/swr/useUserSWR';
import useComment from '@hooks/useComment';
import optimizeImage from '@lib/optimizeImage';
import { Avatar, Group, TextInput } from '@mantine/core';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const CommentForm: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { postId } = router.query;
  // const { postId } = useParams<{ postId: string }>();

  const { data: userData } = useUserSWR();

  const { submitComment } = useComment({ postId: postId as string });

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Group mb={16}>
        <Avatar src={optimizeImage(userData?.image_url)} alt="user" radius="xl" size="sm" />
        <TextInput
          placeholder="댓글 추가"
          variant="default"
          {...register('content', { required: true, maxLength: 200 })}
          autoComplete="off"
          sx={(theme) => ({ flexGrow: 1 })}
        />
        <button type="submit" hidden />
      </Group>
    </form>
  );
};

export default CommentForm;
