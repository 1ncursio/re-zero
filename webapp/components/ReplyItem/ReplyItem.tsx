import { useRouter } from 'next/router';
import React, { FC, useCallback } from 'react';
import useCommentsSWR from '../../hooks/swr/useCommentsSWR';
import useRepliesSWR from '../../hooks/swr/useRepliesSWR';
import useBoolean from '../../hooks/useBoolean';
import useReply from '../../hooks/useReply';
import deleteReply from '../../lib/api/replies/deleteReply';
import optimizeImage from '../../lib/optimizeImage';
import relativeCreatedAt from '../../lib/relativeCreatedAt';
import { Comment } from '../../typings/comment';
import EditReplyForm from '../EditReplyForm';
import ReplyLikeButton from '../ReplyLikeButton';
import StyledModal from '../StyledModal';

type ReplyItemProps = {
  reply: Comment;
  commentId: number;
};

const ReplyItem: FC<ReplyItemProps> = ({ reply, commentId }) => {
  const [isOpen, openModal, closeModal] = useBoolean(false);
  const [isOpenEditReplyForm, openEditReplyForm, closeEditReplyForm] = useBoolean(false);
  useBoolean(false);
  const router = useRouter();
  const { postId } = router.query;

  const { toggleLikeReply } = useReply({
    postId: postId as string,
    commentId,
    replyId: reply.id,
  });
  const { mutate: mutateComments } = useCommentsSWR({ postId: postId as string });
  const { mutate: mutateReplies } = useRepliesSWR({
    postId: postId as string,
    commentId,
    shouldFetch: true,
  });

  const onDeleteReply = useCallback(() => {
    deleteReply({
      postId: postId as string,
      commentId: reply.id,
      mutateReplies,
      mutateComments,
    });
    closeModal();
  }, [closeModal, reply.id, postId, mutateReplies]);

  return (
    <div key={reply.id} className="flex gap-2">
      <img
        src={optimizeImage(reply.user?.image_url ?? '/assets/images/user_thumbnail.png')}
        alt="user"
        className="w-8 h-8 rounded-full mr-1"
      />
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <div className="flex gap-2">
            <span className="text-xs text-blueGray-600">{reply.user.name}</span>
            <span className="text-xs text-blueGray-400">{relativeCreatedAt(reply.created_at)}</span>
          </div>
          {reply.isMine && (
            <div className="flex gap-1">
              <button type="button" className="text-xs text-blueGray-600" onClick={openEditReplyForm}>
                수정
              </button>
              <button type="button" className="text-xs text-red-400" onClick={openModal}>
                삭제
              </button>
              <StyledModal
                isOpen={isOpen}
                onRequestClose={closeModal}
                onRequestOk={onDeleteReply}
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
        {isOpenEditReplyForm ? (
          <EditReplyForm reply={reply} closeEditReplyForm={closeEditReplyForm} commentId={commentId} />
        ) : (
          <p className="text-sm text-blueGray-600 mb-2">{reply.content}</p>
        )}
        <div className="flex gap-4 items-center mb-2">
          <ReplyLikeButton toggleLikeReply={toggleLikeReply} reply={reply} />
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;
