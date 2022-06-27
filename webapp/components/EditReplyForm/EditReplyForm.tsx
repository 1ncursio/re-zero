import useRepliesSWR from '@hooks/swr/useRepliesSWR';
import updateReply from '@lib/api/replies/updateReply';
import { Box, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { Comment } from '@typings/comment';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef } from 'react';
import { z } from 'zod';

interface FormValues {
  content: string;
}

type EditReplyFormProps = {
  reply: Comment;
  commentId: number;
  closeEditReplyForm: () => void;
};

const schema = z.object({
  content: z.string().max(200, { message: '댓글은 최대 200자입니다.' }),
});

const EditReplyForm: FC<EditReplyFormProps> = ({ reply, commentId, closeEditReplyForm }) => {
  const form = useForm<FormValues>({
    schema: zodResolver(schema),
    initialValues: {
      content: '',
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { postId } = router.query;

  const { mutate: mutateReplies } = useRepliesSWR({
    commentId,
    postId: postId as string,
    shouldFetch: true,
  });

  const onSubmitComment = useCallback(
    async ({ content }: FormValues) => {
      try {
        await updateReply({
          content,
          postId: postId as string,
          commentId: reply.id,
          mutateReplies,
        });
        form.setValues({ content: '' });
        closeEditReplyForm();
      } catch (error) {
        console.error(error);
      }
    },
    [postId, form, closeEditReplyForm, reply.id, mutateReplies],
  );

  useEffect(() => {
    inputRef.current?.focus();
    form.setValues({ content: reply.content });
  }, []);

  return (
    <form onSubmit={form.onSubmit(onSubmitComment)}>
      <Box mb="xs">
        <TextInput
          required
          placeholder="댓글 수정"
          variant="default"
          autoComplete="off"
          sx={{ flexGrow: 1 }}
          {...form.getInputProps('content')}
          ref={inputRef}
        />
        <button type="submit" hidden />
      </Box>
    </form>
  );
};

export default EditReplyForm;
