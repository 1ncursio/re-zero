import React, { FC } from 'react';
import { useParams } from 'react-router';
import { userThumbnail } from '../../assets/images';
import useBoolean from '../../hooks/useBoolean';
import useReply from '../../hooks/useReply';
import optimizeImage from '../../lib/optimizeImage';
import relativeCreatedAt from '../../lib/relativeCreatedAt';
import { Comment } from '../../typings/comment';
import ReplyForm from '../ReplyForm';
import ReplyLikeButton from '../ReplyLikeButton';

type ReplyItemProps = {
  reply: Comment;
  commentId: number;
};

const ReplyItem: FC<ReplyItemProps> = ({ reply, commentId }) => {
  const [isOpenReplyForm, openReplyForm] = useBoolean(false);
  const { postId } = useParams<{ postId: string }>();

  const { isAlreadyLikedReply, toggleLikeReply } = useReply({
    postId,
    commentId,
    replyId: reply.id,
  });

  return (
    <div key={reply.id} className="flex gap-2">
      <img
        src={optimizeImage(reply.user?.image_url ?? userThumbnail)}
        alt="user"
        className="w-8 h-8 rounded-full mr-1"
      />
      <div className="flex-1">
        <div className="flex gap-2 items-center mb-1">
          <span className="text-xs text-blueGray-600">{reply.user.name}</span>
          <span className="text-xs text-blueGray-400">
            {relativeCreatedAt(reply.created_at)}
          </span>
        </div>
        <p className="text-sm text-blueGray-600 mb-2">{reply.content}</p>
        <div className="flex gap-4 items-center mb-2">
          <ReplyLikeButton
            isAlreadyLiked={isAlreadyLikedReply(reply.id)}
            toggleLikeReply={toggleLikeReply(reply.id)}
            reply={reply}
          />
          {!reply.reply_id && (
            <button
              type="button"
              className="text-xs text-blueGray-600"
              onClick={openReplyForm}
            >
              답글
            </button>
          )}
        </div>
        {isOpenReplyForm && <ReplyForm replyId={reply.id} />}
      </div>
    </div>
  );
};

export default ReplyItem;
