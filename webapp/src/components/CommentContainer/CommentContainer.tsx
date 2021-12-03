import React, { VFC } from 'react';
import CommentForm from '../CommentForm';
import CommentList from '../CommentList';

const CommentContainer: VFC = () => {
  return (
    <>
      <CommentForm />
      <CommentList />
    </>
  );
};

export default CommentContainer;
