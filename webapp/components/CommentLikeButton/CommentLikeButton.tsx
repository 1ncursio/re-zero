import useBoolean from '@hooks/useBoolean';
import { Comment } from '@typings/comment';
import { FC, useCallback } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';

type CommentLikeButtonProps = {
  toggleLikeComment: () => void;
  comment: Comment;
};

const CommentLikeButton: FC<CommentLikeButtonProps> = ({ toggleLikeComment, comment }) => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();
  const [isClickedLike, onClickedLike, offClickedLike] = useBoolean(false);

  const handleClickLike = useCallback(() => {
    toggleLikeComment();

    if (isClickedLike) {
      offClickedLike();
    }

    onClickedLike();

    setTimeout(() => {
      offClickedLike();
    }, 300);
  }, [onClickedLike, offClickedLike, isClickedLike, toggleLikeComment]);

  return (
    <div className="flex gap-1 items-center">
      <button type="button" ref={setTriggerRef} onClick={handleClickLike}>
        {comment.isLiked ? <HiHeart size={16} /> : <HiOutlineHeart size={16} />}
        {visible && (
          <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container' })}>
            <div {...getArrowProps({ className: 'tooltip-arrow' })} />
            <span className="text-xs">{comment.isLiked ? '좋아요 취소' : '좋아요'}</span>
          </div>
        )}
      </button>
      {isClickedLike && (
        <span className="animate-ping-once absolute -z-10 inline-flex h-4 w-4 rounded-full bg-blueGray-400 opacity-75" />
      )}
      <span className="text-xs text-blueGray-600">{comment.likes.length}</span>
    </div>
  );
};

export default CommentLikeButton;
