import useCommentsSWR from '@hooks/swr/useCommentsSWR';
import useRepliesSWR from '@hooks/swr/useRepliesSWR';
import useBoolean from '@hooks/useBoolean';
import useComment from '@hooks/useComment';
import useToggle from '@hooks/useToggle';
import deleteComment from '@lib/api/comments/deleteComment';
import optimizeImage from '@lib/optimizeImage';
import relativeCreatedAt from '@lib/relativeCreatedAt';
import { Avatar, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Comment } from '@typings/comment';
import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'tabler-icons-react';
import CommentLikeButton from '../CommentLikeButton';
import EditCommentForm from '../EditCommentForm';
import ReplyForm from '../ReplyForm';
import ReplyList from '../ReplyList';

type CommentItemProps = {
  comment: Comment;
};

const CommentItem: FC<CommentItemProps> = ({ comment }) => {
  const modals = useModals();

  const [isOpenReply, toggleReply] = useToggle(false);
  const [isOpenReplyForm, openReplyForm] = useBoolean(false);
  const [isOpenEditCommentForm, openEditCommentForm, closeEditCommentForm] = useBoolean(false);

  const router = useRouter();
  const { postId } = router.query;

  const { mutate: mutateComments } = useCommentsSWR({
    postId: postId as string,
  });

  const { toggleLikeComment } = useComment({
    postId: postId as string,
    commentId: comment.id,
  });

  const { data: repliesData } = useRepliesSWR({
    postId: postId as string,
    commentId: comment.id,
    shouldFetch: isOpenReply,
  });

  const onDeleteComment = useCallback(() => {
    deleteComment({
      postId: postId as string,
      commentId: comment.id,
      mutateComments,
    });
  }, [comment.id, mutateComments, postId]);

  const openDeleteCommentModal = useCallback(() => {
    modals.openConfirmModal({
      title: '댓글 삭제',
      children: <Text size="sm">댓글을 정말로 삭제하시겠습니까?</Text>,
      labels: {
        cancel: '취소',
        confirm: '삭제',
      },
      confirmProps: {
        color: 'red',
      },
      onConfirm: onDeleteComment,
    });
  }, [modals, onDeleteComment]);

  return (
    <Group key={comment.id} align="start" spacing="xs">
      <Avatar src={optimizeImage(comment.user?.image_url)} alt="user" radius="xl" size="sm" />
      <Stack spacing="xs" sx={{ flexGrow: 1 }}>
        <Group position="apart">
          <Group spacing="xs">
            <Text size="xs">{comment.user.name}</Text>
            <Text size="xs" color="dimmed">
              {relativeCreatedAt(comment.created_at)}
            </Text>
          </Group>
          {comment.isMine && (
            <Group spacing="xs">
              <UnstyledButton onClick={openEditCommentForm}>
                <Text size="xs">수정</Text>
              </UnstyledButton>
              <UnstyledButton onClick={openDeleteCommentModal}>
                <Text size="xs" color="red">
                  삭제
                </Text>
              </UnstyledButton>
            </Group>
          )}
        </Group>
        {isOpenEditCommentForm ? (
          <EditCommentForm comment={comment} closeEditCommentForm={closeEditCommentForm} />
        ) : (
          <Text size="sm">{comment.content}</Text>
        )}
        <Group>
          <CommentLikeButton toggleLikeComment={toggleLikeComment} comment={comment} />
          {!comment.reply_id && (
            <UnstyledButton onClick={openReplyForm}>
              <Text size="xs">답글</Text>
            </UnstyledButton>
          )}
        </Group>
        {isOpenReplyForm && <ReplyForm commentId={comment.id} />}
        {comment.reply_count > 0 && (
          <UnstyledButton
            type="button"
            onClick={toggleReply}
            className="text-emerald-500 hover:text-emerald-400"
            mb={8}
          >
            <Group spacing="xs">
              {isOpenReply ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              <Text size="sm">
                {isOpenReply ? `답글 ${comment.reply_count}개 숨기기` : `답글 ${comment.reply_count}개 보기`}
              </Text>
            </Group>
          </UnstyledButton>
        )}
        {isOpenReply && repliesData && <ReplyList replies={repliesData} commentId={comment.id} />}
      </Stack>
    </Group>
  );
};

export default CommentItem;
