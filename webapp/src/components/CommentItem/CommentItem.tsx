import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { userThumbnail } from '../../assets/images';
import useCommentsSWR from '../../hooks/swr/useCommentsSWR';
import useRepliesSWR from '../../hooks/swr/useRepliesSWR';
import useBoolean from '../../hooks/useBoolean';
import useComment from '../../hooks/useComment';
import useToggle from '../../hooks/useToggle';
import deleteComment from '../../lib/api/comments/deleteComment';
import optimizeImage from '../../lib/optimizeImage';
import relativeCreatedAt from '../../lib/relativeCreatedAt';
import { Comment } from '../../typings/comment';
import CommentLikeButton from '../CommentLikeButton';
import EditCommentForm from '../EditCommentForm';
import Icon from '../Icon';
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
  const [isOpenEditCommentForm, openEditCommentForm, closeEditCommentForm] =
    useBoolean(false);
  const { postId } = useParams<{ postId: string }>();

  const { mutate: mutateComments } = useCommentsSWR({
    postId,
  });

  const { toggleLikeComment } = useComment({
    postId,
    commentId: comment.id,
  });

  const { data: repliesData } = useRepliesSWR({
    postId,
    commentId: comment.id,
    shouldFetch: isOpenReply,
  });

  const onDeleteComment = useCallback(() => {
    deleteComment({
      postId,
      commentId: comment.id,
      mutateComments,
    });
    closeModal();
  }, [closeModal, comment.id, mutateComments, postId]);

  return (
    <div key={comment.id} className="flex gap-2">
      <img
        src={optimizeImage(comment.user?.image_url ?? userThumbnail)}
        alt="user"
        className="w-8 h-8 rounded-full mr-1"
      />
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <div className="flex gap-2">
            <span className="text-xs text-blueGray-600">
              {comment.user.name}
            </span>
            <span className="text-xs text-blueGray-400">
              {relativeCreatedAt(comment.created_at)}
            </span>
          </div>
          {comment.isMine && (
            <div className="flex gap-2">
              <button
                type="button"
                className="text-xs text-blueGray-600"
                onClick={openEditCommentForm}
              >
                수정
              </button>
              <button
                type="button"
                className="text-xs text-red-400"
                onClick={openModal}
              >
                삭제
              </button>
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
            </div>
          )}
        </div>
        {isOpenEditCommentForm ? (
          <EditCommentForm
            comment={comment}
            closeEditCommentForm={closeEditCommentForm}
          />
        ) : (
          <p className="text-sm text-blueGray-600 mb-2">{comment.content}</p>
        )}
        <div className="flex gap-4 items-center mb-2">
          <CommentLikeButton
            toggleLikeComment={toggleLikeComment}
            comment={comment}
          />
          {!comment.reply_id && (
            <button
              type="button"
              className="text-xs text-blueGray-600"
              onClick={openReplyForm}
            >
              답글
            </button>
          )}
        </div>
        {isOpenReplyForm && <ReplyForm commentId={comment.id} />}
        {comment.reply_count > 0 && (
          <button
            type="button"
            onClick={toggleReply}
            className="inline-flex gap-1 items-center text-emerald-500 hover:text-emerald-400 mb-2"
          >
            {isOpenReply ? (
              <Icon
                name="outlinedUpArrow"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
              />
            ) : (
              <Icon
                name="outlinedDownArrow"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
              />
            )}
            <span className="text-sm">
              {isOpenReply
                ? `답글 ${comment.reply_count}개 숨기기`
                : `답글 ${comment.reply_count}개 보기`}
            </span>
          </button>
        )}
        {isOpenReply && repliesData && (
          <ReplyList replies={repliesData} commentId={comment.id} />
        )}
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
