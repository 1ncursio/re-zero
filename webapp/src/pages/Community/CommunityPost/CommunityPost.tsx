import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import 'react-popper-tooltip/dist/styles.css';
import { useLocation, useParams } from 'react-router';
import { useSWRConfig } from 'swr';
import { userThumbnail } from '../../../assets/images';
import CommentForm from '../../../components/CommentForm';
import CommentItem from '../../../components/CommentItem';
import useCommentsSWR from '../../../hooks/swr/useCommentsSWR';
import usePostSWR from '../../../hooks/swr/usePostSWR';
import useUserSWR from '../../../hooks/swr/useUserSWR';
import useQuery from '../../../hooks/useQuery';
import createComment from '../../../lib/api/comments/createComment';
import optimizeImage from '../../../lib/optimizeImage';
import relativeCreatedAt from '../../../lib/relativeCreatedAt';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const CommunityPost = () => {
  // extract postId from url using react router
  const { postId } = useParams<{ postId: string }>();
  const query = useQuery();

  const { data: postData } = usePostSWR(postId);
  const { data: commentsData } = useCommentsSWR({
    postId,
    page: query.get('page') ?? 1,
  });

  if (!postData) {
    return null;
  }

  return (
    <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4">
      <Helmet>
        <title>{postData.title}| Lathello </title>
      </Helmet>
      <div className="min-h-[24rem]">
        <header className="p-4 border-b border-blueGray-200">
          <h1 className="text-lg text-blueGray-700 mb-2">{postData.title}</h1>
          <div className="flex gap-1 items-center">
            <img
              src={optimizeImage(postData.user?.image_url ?? userThumbnail)}
              alt="user"
              className="w-8 h-8 rounded-full mr-1"
            />
            <span className="text-xs text-blueGray-600">
              {postData.user.name}
            </span>
            <span className="text-xs text-blueGray-400">
              <span>· </span>
              {relativeCreatedAt(postData.created_at)}
            </span>
          </div>
        </header>
        <section className="p-4 mb-24">
          <p className="text-sm text-blueGray-600">{postData.content}</p>
        </section>
        <footer className="p-4">
          <CommentForm />
          <div className="flex flex-col gap-6">
            {commentsData?.map((comment) => (
              <CommentItem comment={comment} key={comment.id} />
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CommunityPost;
