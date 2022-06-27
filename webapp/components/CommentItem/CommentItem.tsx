import useCommentsSWR from '@hooks/swr/useCommentsSWR';
import useRepliesSWR from '@hooks/swr/useRepliesSWR';
import useBoolean from '@hooks/useBoolean';
import useComment from '@hooks/useComment';
import useToggle from '@hooks/useToggle';
import deleteComment from '@lib/api/comments/deleteComment';
import optimizeImage from '@lib/optimizeImage';
import relativeCreatedAt from '@lib/relativeCreatedAt';
import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';
import { Comment } from '@typings/comment';
import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'tabler-icons-react';
import CommentLikeButton from '../CommentLikeButton';
import EditCommentForm from '../EditCommentForm';
import ReplyForm from '../ReplyForm';
import ReplyList from '../ReplyList';
import StyledModal from '../StyledModal';

type CommentItemProps = {
  comment: Comment;
};

const CommentItem: FC<CommentItemProps> = ({ comment }) => {
  const [isOpenReply, toggleReply] = useToggle(false);
  const [isOpen, openModal, closeModal] = useBoolean(false);
  const [isOpenReplyForm, openReplyForm] = useBoolean(false);
  // const [isOpenEditCommentForm, openEditCommentForm] = useBoolean(false);
  const [isOpenEditCommentForm, openEditCommentForm, closeEditCommentForm] = useBoolean(false);
  // const { postId } = useParams<{ postId: string }>();
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
    closeModal();
  }, [closeModal, comment.id, mutateComments, postId]);

  return (
    <div key={comment.id} className="flex gap-2">
      <Avatar src={optimizeImage(comment.user?.image_url)} alt="user" radius="xl" size="sm" />
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <div className="flex gap-2">
            <Text size="xs">{comment.user.name}</Text>
            <Text size="xs" color="dimmed">
              {relativeCreatedAt(comment.created_at)}
            </Text>
          </div>
          {comment.isMine && (
            <Group spacing="xs">
              <UnstyledButton onClick={openEditCommentForm}>
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
                onRequestOk={onDeleteComment}
                title="댓글 삭제"
                showCloseButton
                showOkButton
                width="480px"
              >
                댓글을 정말로 삭제하시겠습니까?
              </StyledModal>
            </Group>
          )}
        </div>
        {isOpenEditCommentForm ? (
          <EditCommentForm comment={comment} closeEditCommentForm={closeEditCommentForm} />
        ) : (
          <Text size="sm" mb={8}>
            {comment.content}
          </Text>
        )}
        <div className="flex gap-4 items-center mb-2">
          <CommentLikeButton toggleLikeComment={toggleLikeComment} comment={comment} />
          {!comment.reply_id && (
            <button type="button" className="text-xs text-blueGray-600" onClick={openReplyForm}>
              답글
            </button>
          )}
        </div>
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
        {/* {isOpenReply && (
          <button
            type="button"
            className="inline-flex gap-1 items-center text-emerald-500 hover:text-emerald-400 mb-2"
          >
            <Icon
              name="subdirectoryArrowRight"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
            />
            <span className="text-sm">답글 더보기</span>
          </button>
        )} */}
      </div>
    </div>
  );
};

export default CommentItem;
