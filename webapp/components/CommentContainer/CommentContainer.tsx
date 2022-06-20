import React, { FC } from 'react';
import CommentForm from '../CommentForm';
import CommentList from '../CommentList';

const CommentContainer: FC = () => {
  return (
    <>
      <CommentForm />
      <CommentList />
    </>
  );
};

export default CommentContainer;
