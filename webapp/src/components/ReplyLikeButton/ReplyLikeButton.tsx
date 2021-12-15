import React, { FC, useCallback, useEffect } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import useUserSWR from '../../hooks/swr/useUserSWR';
import useBoolean from '../../hooks/useBoolean';
import { Comment } from '../../typings/comment';
import Icon from '../Icon';

type ReplyLikeButtonProps = {
  toggleLikeReply: () => void;
  reply: Comment;
};

const ReplyLikeButton: FC<ReplyLikeButtonProps> = ({ toggleLikeReply, reply }) => {
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();
  const { data: userData } = useUserSWR();
  const [isClickedLike, onClickedLike, offClickedLike] = useBoolean(false);

  const handleClickLike = useCallback(() => {
    toggleLikeReply();

    if (isClickedLike) {
      offClickedLike();
    }

    onClickedLike();

    setTimeout(() => {
      offClickedLike();
    }, 300);
  }, [onClickedLike, offClickedLike, isClickedLike, toggleLikeReply]);

  useEffect(() => {
    console.log({ reply });
  }, []);

  return (
    <div className="flex gap-1 items-center">
      <button type="button" ref={setTriggerRef} onClick={handleClickLike}>
        {reply.isLiked ? (
          <Icon name="filledLike" className="w-4 h-4" />
        ) : (
          <Icon name="outlinedLike" className="w-4 h-4" />
        )}
        {visible && (
          <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container' })}>
            <div {...getArrowProps({ className: 'tooltip-arrow' })} />
            <span className="text-xs">{reply.isLiked ? '좋아요 취소' : '좋아요'}</span>
          </div>
        )}
      </button>
      {isClickedLike && (
        <span className="animate-ping-once absolute -z-10 inline-flex h-4 w-4 rounded-full bg-blueGray-400 opacity-75" />
      )}
      <span className="text-xs text-blueGray-600">{reply.likes.length}</span>
    </div>
  );
};

export default ReplyLikeButton;
