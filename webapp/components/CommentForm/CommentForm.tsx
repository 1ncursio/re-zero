import useUserSWR from '@hooks/swr/useUserSWR';
import useComment from '@hooks/useComment';
import optimizeImage from '@lib/optimizeImage';
import { Avatar, Group, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';
import { z } from 'zod';

interface FormValues {
  content: string;
}

const schema = z.object({
  content: z.string().max(200, { message: '댓글은 최대 200자입니다.' }),
});

const CommentForm: FC = () => {
  const form = useForm<FormValues>({
    schema: zodResolver(schema),
    initialValues: {
      content: '',
    },
  });

  const router = useRouter();
  const { postId } = router.query;

  const { data: userData } = useUserSWR();

  const { submitComment } = useComment({ postId: postId as string });

  const onSubmitComment = useCallback(
    async ({ content }: FormValues) => {
      try {
        await submitComment(content);
        form.setValues({ content: '' });
      } catch (error) {
        console.error(error);
      }
    },
    [submitComment, form],
  );

  return (
    <form onSubmit={form.onSubmit(onSubmitComment)}>
      <Group mb={16}>
        <Avatar src={optimizeImage(userData?.image_url)} alt="user" radius="xl" size="sm" />
        <TextInput
          required
          placeholder="댓글 추가"
          variant="default"
          autoComplete="off"
          sx={{ flexGrow: 1 }}
          {...form.getInputProps('content')}
        />
        <button type="submit" hidden />
      </Group>
    </form>
  );
};

export default CommentForm;
