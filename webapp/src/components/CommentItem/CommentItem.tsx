import React, { FC, useCallback, useRef } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { useParams } from 'react-router';
import { userThumbnail } from '../../assets/images';
import useBoolean from '../../hooks/useBoolean';
import useComment from '../../hooks/useComment';
import optimizeImage from '../../lib/optimizeImage';
import relativeCreatedAt from '../../lib/relativeCreatedAt';
import { Comment } from '../../typings/comment';
import CommentForm from '../CommentForm';
import Icon from '../Icon';

type CommentItemProps = {
  comment: Comment;
};

const CommentItem: FC<CommentItemProps> = ({ comment }) => {
  const [isOpenReply, openReply, closeReply] = useBoolean(false);
  const { postId } = useParams<{ postId: string }>();
  // eslint-disable-next-line no-undef
  const replyInputRef = useRef<HTMLInputElement>(null);

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

  const openAndFocusReply = useCallback(() => {
    openReply();

    setTimeout(() => {
      replyInputRef.current?.focus();
    }, 100);
  }, [openReply, replyInputRef]);

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
            <button
              type="button"
              ref={setTriggerRef}
              onClick={toggleLikeComment}
            >
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
            <span className="text-xs text-blueGray-600">
              {comment.likes.length}
            </span>
          </div>
          <button
            type="button"
            className="text-xs text-blueGray-600"
            onClick={openAndFocusReply}
          >
            답글
          </button>
        </div>
        {isOpenReply && <CommentForm isReply ref={replyInputRef} />}
      </div>
    </div>
  );
};

export default CommentItem;
