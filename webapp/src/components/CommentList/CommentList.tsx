import React, { FC } from 'react';
import { Comment } from '../../typings/comment';
import CommentItem from '../CommentItem';

type CommentListProps = {
  comments: Comment[];
};

const CommentList: FC<CommentListProps> = ({ comments }) => {
  return (
    <div className="flex flex-col gap-6">
      {comments?.map((comment) => (
        <CommentItem comment={comment} key={comment.id} />
      ))}
    </div>
  );
};

export default CommentList;
