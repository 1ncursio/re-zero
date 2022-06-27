import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef } from 'react';
import useCommentsSWR from '@hooks/swr/useCommentsSWR';
import updateComment from '@lib/api/comments/updateComment';
import { Comment } from '@typings/comment';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { Box, TextInput } from '@mantine/core';

interface FormValues {
  content: string;
}

type EditCommentFormProps = {
  comment: Comment;
  closeEditCommentForm: () => void;
};

const schema = z.object({
  content: z.string().max(200, { message: '댓글은 최대 200자입니다.' }),
});

const EditCommentForm: FC<EditCommentFormProps> = ({ comment, closeEditCommentForm }) => {
  const form = useForm<FormValues>({
    schema: zodResolver(schema),
    initialValues: {
      content: '',
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { postId } = router.query;

  const { mutate: mutateComments } = useCommentsSWR({ postId: postId as string });

  const onSubmitComment = useCallback(
    async ({ content }: FormValues) => {
      try {
        await updateComment({
          content,
          postId: postId as string,
          commentId: comment.id,
          mutateComments,
        });
        form.setValues({ content: '' });
        closeEditCommentForm();
      } catch (error) {
        console.error(error);
      }
    },
    [postId, closeEditCommentForm, comment.id, mutateComments, form],
  );

  useEffect(() => {
    inputRef.current?.focus();
    form.setValues({ content: comment.content });
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

export default EditCommentForm;
