import React, { VFC } from 'react';
import { useParams } from 'react-router-dom';
import useCommentsSWR from '../../hooks/swr/useCommentsSWR';
import useQuery from '../../hooks/useQuery';
import CommentItem from '../CommentItem';

const CommentList: VFC = () => {
  const { postId } = useParams<{ postId: string }>();
  const query = useQuery();
  const { data: commentsData } = useCommentsSWR({
    postId,
    page: query.get('page') ?? 1,
  });

  return (
    <div className="flex flex-col gap-6">
      {commentsData?.map((comment) => (
        <CommentItem comment={comment} key={comment.id} />
      ))}
    </div>
  );
};

export default CommentList;