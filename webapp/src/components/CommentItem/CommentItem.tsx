import React, { FC } from 'react';
import { useParams } from 'react-router';
import { userThumbnail } from '../../assets/images';
import useBoolean from '../../hooks/useBoolean';
import useComment from '../../hooks/useComment';
import useReply from '../../hooks/useReply';
import useToggle from '../../hooks/useToggle';
import optimizeImage from '../../lib/optimizeImage';
import relativeCreatedAt from '../../lib/relativeCreatedAt';
import { Comment } from '../../typings/comment';
import CommentLikeButton from '../CommentLikeButton';
import Icon from '../Icon';
import ReplyForm from '../ReplyForm';
import ReplyList from '../ReplyList';

type CommentItemProps = {
  comment: Comment;
};

const CommentItem: FC<CommentItemProps> = ({ comment }) => {
  const [isOpenReply, toggleReply] = useToggle(false);
  const [isOpenReplyForm, openReplyForm] = useBoolean(false);
  const { postId } = useParams<{ postId: string }>();

  const { toggleLikeComment } = useComment({
    postId,
    commentId: comment.id,
  });
  const { shouldFetch, repliesData } = useReply({
    postId,
    commentId: comment.id,
    isOpenReply,
  });

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
        {isOpenReplyForm && <ReplyForm replyId={comment.id} />}
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
          <ReplyList replies={repliesData} commentId={comment.id} />
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
