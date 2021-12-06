import React, { FC, useCallback } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { useParams } from 'react-router';
import usePostSWR from '../../hooks/swr/usePostSWR';
import useBoolean from '../../hooks/useBoolean';
import useQuery from '../../hooks/useQuery';
import Icon from '../Icon';

type PostLikeButtonProps = {
  toggleLikePost: () => void;
};

const PostLikeButton: FC<PostLikeButtonProps> = ({ toggleLikePost }) => {
  const { postId } = useParams<{ postId: string }>();
  const { data: postData } = usePostSWR(postId);
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip();
  const [isClickedLike, onClickedLike, offClickedLike] = useBoolean(false);

  const handleClickLike = useCallback(() => {
    toggleLikePost();

    if (isClickedLike) {
      offClickedLike();
    }

    onClickedLike();

    setTimeout(() => {
      offClickedLike();
    }, 300);
  }, [onClickedLike, offClickedLike, isClickedLike, toggleLikePost]);

  if (!postData) {
    return null;
  }

  return (
    <div className="flex gap-1 items-center">
      <button type="button" ref={setTriggerRef} onClick={handleClickLike}>
        {postData.isLiked ? (
          <Icon name="filledLike" className="w-6 h-6" />
        ) : (
          <Icon name="outlinedLike" className="w-6 h-6" />
        )}
        {visible && (
          <div
            ref={setTooltipRef}
            {...getTooltipProps({ className: 'tooltip-container' })}
          >
            <div {...getArrowProps({ className: 'tooltip-arrow' })} />
            <span className="text-xs">
              {postData.isLiked ? '좋아요 취소' : '좋아요'}
            </span>
          </div>
        )}
      </button>
      {isClickedLike && (
        <span className="animate-ping-once absolute -z-10 inline-flex h-6 w-6 rounded-full bg-blueGray-400 opacity-75" />
      )}
      <span className="text-blueGray-600">{postData.likes.length}</span>
    </div>
  );
};

export default PostLikeButton;