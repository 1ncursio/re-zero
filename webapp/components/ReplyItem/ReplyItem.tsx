import CommentLikeButton from '@components/CommentLikeButton';
import useCommentsSWR from '@hooks/swr/useCommentsSWR';
import useRepliesSWR from '@hooks/swr/useRepliesSWR';
import useBoolean from '@hooks/useBoolean';
import useReply from '@hooks/useReply';
import deleteReply from '@lib/api/replies/deleteReply';
import optimizeImage from '@lib/optimizeImage';
import relativeCreatedAt from '@lib/relativeCreatedAt';
import { Avatar, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { Comment } from '@typings/comment';
import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';
import EditReplyForm from '../EditReplyForm';
import ReplyLikeButton from '../ReplyLikeButton';
import StyledModal from '../StyledModal';

type ReplyItemProps = {
  reply: Comment;
  commentId: number;
};

const ReplyItem: FC<ReplyItemProps> = ({ reply, commentId }) => {
  const [isOpen, openModal, closeModal] = useBoolean(false);
  const [isOpenEditReplyForm, openEditReplyForm, closeEditReplyForm] = useBoolean(false);
  useBoolean(false);
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
    closeModal();
  }, [closeModal, reply.id, postId, mutateReplies, mutateComments]);

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
              <UnstyledButton onClick={openModal}>
                <Text size="xs" color="red">
                  삭제
                </Text>
              </UnstyledButton>
              <StyledModal
                isOpen={isOpen}
                onRequestClose={closeModal}
                onRequestOk={onDeleteReply}
                title="댓글 삭제"
                showCloseButton
                showOkButton
                width="480px"
              >
                댓글을 정말로 삭제하시겠습니까?
              </StyledModal>
            </Group>
          )}
        </Group>
        {isOpenEditReplyForm ? (
          <EditReplyForm reply={reply} closeEditReplyForm={closeEditReplyForm} commentId={commentId} />
        ) : (
          <Text size="sm" mb={8}>
            {reply.content}
          </Text>
        )}
        <CommentLikeButton toggleLikeComment={toggleLikeReply} comment={reply} />
      </Stack>
    </Group>
  );
};

export default ReplyItem;
