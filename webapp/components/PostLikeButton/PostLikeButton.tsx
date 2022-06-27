import usePostSWR from '@hooks/swr/usePostSWR';
import useBoolean from '@hooks/useBoolean';
import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

type PostLikeButtonProps = {
  toggleLikePost: () => void;
};

const PostLikeButton: FC<PostLikeButtonProps> = ({ toggleLikePost }) => {
  const router = useRouter();
  const { postId } = router.query;
  const { data: postData } = usePostSWR(postId as string);
  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();
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
        {postData.isLiked ? <HiHeart size={16} /> : <HiOutlineHeart size={16} />}
        {visible && (
          <div ref={setTooltipRef} {...getTooltipProps({ className: 'tooltip-container' })}>
            <div {...getArrowProps({ className: 'tooltip-arrow' })} />
            <span className="text-xs">{postData.isLiked ? '좋아요 취소' : '이 게시물이 마음에 들어요!'}</span>
          </div>
        )}
      </button>
      {isClickedLike && (
        <span className="animate-ping-once absolute -z-10 inline-flex h-6 w-6 rounded-full bg-blueGray-400 opacity-75" />
      )}
      <span className="text-xs text-blueGray-600">{postData.likes.length}</span>
    </div>
  );
};

export default PostLikeButton;
