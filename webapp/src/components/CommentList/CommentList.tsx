import React, { FC } from 'react';
import { Comment } from '../../typings/comment';
import CommentItem from '../CommentItem';

type CommentListProps = {
  comments: Comment[];
  isReply?: boolean;
};

const CommentList: FC<CommentListProps> = ({ comments, isReply }) => {
  return (
    <div className={isReply ? 'flex flex-col gap-2' : 'flex flex-col gap-6'}>
      {comments?.map((comment) => (
        <CommentItem comment={comment} key={comment.id} />
      ))}
    </div>
  );
};

export default CommentList;
