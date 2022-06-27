import { useRouter } from 'next/router';
import { FC } from 'react';
import useCommentsSWR from '@hooks/swr/useCommentsSWR';
import CommentItem from '../CommentItem';
import { Box, Text } from '@mantine/core';

const CommentList: FC = () => {
  const router = useRouter();
  const { postId } = router.query;

  const { data: commentsData } = useCommentsSWR({
    postId: postId as string,
  });

  if (!commentsData) {
    return null;
  }

  if (commentsData.length === 0) {
    return (
      <Box
        sx={(theme) => ({
          textAlign: 'center',
          padding: theme.spacing.xl,
        })}
      >
        <Text color="dimmed">아직 댓글이 없네요!</Text>
      </Box>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {commentsData.map((comment) => (
        <CommentItem comment={comment} key={comment.id} />
      ))}
    </div>
  );
};

export default CommentList;
