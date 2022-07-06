import CommentLikeButton from '@components/CommentLikeButton';
import useCommentsSWR from '@hooks/swr/useCommentsSWR';
import useRepliesSWR from '@hooks/swr/useRepliesSWR';
import useBoolean from '@hooks/useBoolean';
import useReply from '@hooks/useReply';
import deleteReply from '@lib/api/replies/deleteReply';
import optimizeImage from '@lib/optimizeImage';
import relativeCreatedAt from '@lib/relativeCreatedAt';
import { Avatar, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Comment } from '@typings/comment';
import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';
import EditReplyForm from '../EditReplyForm';

type ReplyItemProps = {
  reply: Comment;
  commentId: number;
};

const ReplyItem: FC<ReplyItemProps> = ({ reply, commentId }) => {
  const modals = useModals();

  const [isOpenEditReplyForm, openEditReplyForm, closeEditReplyForm] = useBoolean(false);

  const router = useRouter();
  const { postId } = router.query;

  const { toggleLikeReply } = useReply({
    postId: postId as string,
    commentId,
    replyId: reply.id,
  });
  const { mutate: mutateComments } = useCommentsSWR({ postId: postId as string });
  const { mutate: mutateReplies } = useRepliesSWR({
    postId: postId as string,
    commentId,
    shouldFetch: true,
  });

  const onDeleteReply = useCallback(() => {
    deleteReply({
      postId: postId as string,
      commentId: reply.id,
      mutateReplies,
      mutateComments,
    });
  }, [reply.id, postId, mutateReplies, mutateComments]);

  const openDeleteReplyModal = useCallback(() => {
    modals.openConfirmModal({
      title: '답글 삭제',
      children: <Text size="sm">답글을 정말로 삭제하시겠습니까?</Text>,
      labels: {
        cancel: '취소',
        confirm: '삭제',
      },
      confirmProps: {
        color: 'red',
      },
      onConfirm: onDeleteReply,
    });
  }, [modals, onDeleteReply]);

  return (
    <Group key={reply.id} align="start" spacing="xs">
      <Avatar src={optimizeImage(reply.user?.image_url)} alt="user" radius="xl" size="sm" />
      <Stack spacing="xs" sx={{ flexGrow: 1 }}>
        <Group position="apart">
          <Group spacing="xs">
            <Text size="xs">{reply.user.name}</Text>
            <Text size="xs" color="dimmed">
              {relativeCreatedAt(reply.created_at)}
            </Text>
          </Group>
          {reply.isMine && (
            <Group spacing="xs">
              <UnstyledButton onClick={openEditReplyForm}>
                <Text size="xs">수정</Text>
              </UnstyledButton>
              <UnstyledButton onClick={openDeleteReplyModal}>
                <Text size="xs" color="red">
                  삭제
                </Text>
              </UnstyledButton>
            </Group>
          )}
        </Group>
        {isOpenEditReplyForm ? (
          <EditReplyForm reply={reply} closeEditReplyForm={closeEditReplyForm} commentId={commentId} />
        ) : (
          <Text size="sm">{reply.content}</Text>
        )}
        <CommentLikeButton toggleLikeComment={toggleLikeReply} comment={reply} />
      </Stack>
    </Group>
  );
};

export default ReplyItem;
