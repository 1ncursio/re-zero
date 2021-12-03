import React, { FC } from 'react';
import { Comment } from '../../typings/comment';
import ReplyItem from '../ReplyItem';

type ReplyListProps = {
  replies: Comment[];
  commentId: number;
};

const ReplyList: FC<ReplyListProps> = ({ replies, commentId }) => {
  return (
    <div className="flex flex-col gap-2">
      {replies?.map((reply) => (
        <ReplyItem reply={reply} key={reply.id} commentId={commentId} />
      ))}
    </div>
  );
};

export default ReplyList;
