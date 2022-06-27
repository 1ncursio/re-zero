import { Comment } from '@typings/comment';
import { FC } from 'react';
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
