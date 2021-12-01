import React, { FC, useCallback } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { useParams } from 'react-router';
import { userThumbnail } from '../../assets/images';
import useBoolean from '../../hooks/useBoolean';
import useComment from '../../hooks/useComment';
import useReply from '../../hooks/useReply';
import optimizeImage from '../../lib/optimizeImage';
import relativeCreatedAt from '../../lib/relativeCreatedAt';
import { Comment } from '../../typings/comment';
import CommentForm from '../CommentForm';
import CommentList from '../CommentList';
import Icon from '../Icon';

type CommentItemProps = {
  comment: Comment;
};

const CommentItem: FC<CommentItemProps> = ({ comment }) => {
  const [isOpenReplyForm, openReplyForm] = useBoolean(false);
  const [isClickedLike, onClickedLike, offClickedLike] = useBoolean(false);
  const { postId } = useParams<{ postId: string }>();

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip();

  const { isAlreadyLikedComment, toggleLikeComment } = useComment({
    postId,
    commentId: comment.id,
  });
  const { repliesData, fetchReplies, toggleReply, shouldFetch } = useReply({
    postId,
    commentId: comment.id,
  });

  // const onClickViewReplies = useCallback(() => {
  //   fetchReplies();
  // }, [fetchReplies]);

  const handleClickLike = useCallback(() => {
    toggleLikeComment();

    if (isClickedLike) {
      offClickedLike();
    }

    onClickedLike();

    setTimeout(() => {
      offClickedLike();
    }, 300);
  }, [toggleLikeComment, onClickedLike, offClickedLike, isClickedLike]);

  return (
    <div key={comment.id} className="flex gap-2">
      <img
        src={optimizeImage(comment.user?.image_url ?? userThumbnail)}
        alt="user"
        className="w-8 h-8 rounded-full mr-1"
      />
      <div className="flex-1">
        <div className="flex gap-2 items-center mb-1">
          <span className="text-xs text-blueGray-600">{comment.user.name}</span>
          <span className="text-xs text-blueGray-400">
            {relativeCreatedAt(comment.created_at)}
          </span>
        </div>
        <p className="text-sm text-blueGray-600 mb-2">{comment.content}</p>
        <div className="flex gap-4 items-center mb-2">
          <div className="flex gap-1 items-center">
            <button type="button" ref={setTriggerRef} onClick={handleClickLike}>
              {isAlreadyLikedComment ? (
                <Icon name="filledLike" className="w-4 h-4" />
              ) : (
                <Icon name="outlinedLike" className="w-4 h-4" />
              )}
              {visible && (
                <div
                  ref={setTooltipRef}
                  {...getTooltipProps({ className: 'tooltip-container' })}
                >
                  <div {...getArrowProps({ className: 'tooltip-arrow' })} />
                  <span className="text-xs">
                    {isAlreadyLikedComment ? '좋아요 취소' : '좋아요'}
                  </span>
                </div>
              )}
            </button>
            {isClickedLike && (
              <span className="animate-ping-once absolute -z-10 inline-flex h-4 w-4 rounded-full bg-blueGray-400 opacity-75" />
            )}
            <span className="text-xs text-blueGray-600">
              {comment.likes.length}
            </span>
          </div>
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
        {isOpenReplyForm && <CommentForm isReply commentId={comment.id} />}
        {comment.reply_count > 0 && (
          <button
            type="button"
            onClick={toggleReply}
            className="inline-flex gap-1 items-center text-emerald-500 hover:text-emerald-400 mb-2"
          >
            {shouldFetch ? (
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
              {shouldFetch
                ? `답글 ${comment.reply_count}개 숨기기`
                : `답글 ${comment.reply_count}개 보기`}
            </span>
          </button>
        )}
        {shouldFetch && repliesData && (
          <CommentList comments={repliesData} isReply />
        )}
        {shouldFetch && (
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
        )}
      </div>
    </div>
  );
};

export default CommentItem;
