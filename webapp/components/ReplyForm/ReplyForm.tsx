import useCommentsSWR from '@hooks/swr/useCommentsSWR';
import useRepliesSWR from '@hooks/swr/useRepliesSWR';
import useUserSWR from '@hooks/swr/useUserSWR';
import createReply from '@lib/api/replies/createReply';
import optimizeImage from '@lib/optimizeImage';
import { Avatar, Group, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';
import { z } from 'zod';

interface FormValues {
  content: string;
}

type ReplyFormProps = {
  commentId: number;
};

const schema = z.object({
  content: z.string().max(200, { message: '댓글은 최대 200자입니다.' }),
});

// eslint-disable-next-line no-undef
const ReplyForm: FC<ReplyFormProps> = ({ commentId }) => {
  const form = useForm<FormValues>({
    schema: zodResolver(schema),
    initialValues: {
      content: '',
    },
  });

  const router = useRouter();
  const { postId } = router.query;

  const { data: userData } = useUserSWR();

  const { mutate: mutateComments } = useCommentsSWR({ postId: postId as string });

  const { data: repliesData, mutate: mutateReplies } = useRepliesSWR({
    postId: postId as string,
    commentId,
    shouldFetch: true,
  });

  const onSubmitReply = useCallback(
    async ({ content }: FormValues) => {
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
        form.setValues({ content: '' });
      } catch (error) {
        console.error(error);
      } finally {
        mutateReplies();
      }
    },
    [commentId, postId, mutateReplies, userData, form, mutateComments],
  );

  return (
    <form onSubmit={form.onSubmit(onSubmitReply)}>
      <Group mb={16}>
        <Avatar src={optimizeImage(userData?.image_url)} alt="user" radius="xl" size="sm" />
        <TextInput
          required
          placeholder="답글 추가"
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

export default ReplyForm;
