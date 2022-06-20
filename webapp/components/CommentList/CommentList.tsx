import { useRouter } from 'next/router';
import React, { FC } from 'react';
import useCommentsSWR from '@hooks/swr/useCommentsSWR';
import CommentItem from '../CommentItem';

const CommentList: FC = () => {
  const router = useRouter();
  const { postId } = router.query;

  const { data: commentsData } = useCommentsSWR({
    postId: postId as string,
  });

  if (!commentsData) {
    return null;
  }

  if (commentsData.length === 0) {
    return <div className="text-blueGray-600 flex justify-center items-center h-32">아직 댓글이 없네요!</div>;
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
