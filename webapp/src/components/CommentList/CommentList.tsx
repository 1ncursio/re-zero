import React, { VFC } from 'react';
import { useParams } from 'react-router-dom';
import useCommentsSWR from '../../hooks/swr/useCommentsSWR';
import useQuery from '../../hooks/useQuery';
import CommentItem from '../CommentItem';

const CommentList: VFC = () => {
  const { postId } = useParams<{ postId: string }>();

  const { data: commentsData } = useCommentsSWR({
    postId,
  });

  if (!commentsData) {
    return null;
  }

  if (commentsData.length === 0) {
    return (
      <div className="text-blueGray-600 flex justify-center items-center h-32">
        아직 댓글이 없네요!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {commentsData.map((comment) => (
        <CommentItem comment={comment} key={comment.id} />
      ))}
    </div>
  );
};

export default CommentList;
