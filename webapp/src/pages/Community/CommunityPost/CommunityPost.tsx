import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useSWRConfig } from 'swr';
import { userThumbnail } from '../../../assets/images';
import useCommentsSWR from '../../../hooks/swr/useCommentsSWR';
import usePostSWR from '../../../hooks/swr/usePostSWR';
import useUserSWR from '../../../hooks/swr/useUserSWR';
import createComment from '../../../lib/api/comments/createComment';
import optimizeImage from '../../../lib/optimizeImage';
import { Comment } from '../../../typings/comment';

dayjs.extend(relativeTime);
dayjs.locale('ko');

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const CommunityPost = () => {
  // extract postId from url using react router
  const [content, setContent] = useState('');
  const { postId } = useParams<{ postId: string }>();
  const query = useQuery();
  const { mutate } = useSWRConfig();

  const { data: userData } = useUserSWR();
  const { data: postData } = usePostSWR(postId);
  const { data: commentsData, mutate: mutateComments } = useCommentsSWR({
    postId,
    page: query.get('page') ?? 1,
  });

  const onChangeContent = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setContent(e.target.value);
    },
    [setContent],
  );

  const onSubmitComment = useCallback(
    async (e) => {
      e.preventDefault();
      if (!content || !userData) return;

      // TODO: any에 타입 제대로 설정하기
      mutateComments((data: any) => {
        return [
          ...(data ?? []),
          {
            content,
            created_at: new Date(),
            user: userData,
            user_id: userData.id,
            post_id: postId,
          },
        ];
      }, false);

      try {
        await createComment({ postId, content });
        setContent('');
      } catch (e) {
        console.error(e);
      }

      mutate(`/api/posts/${postId}/comments`);
    },
    [content, postId, userData, mutate, setContent],
  );

  useEffect(() => {
    if (commentsData) {
      console.log('commentsData', commentsData);
    }
  }, [commentsData]);

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
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs text-blueGray-600">
              {postData.user.name}
            </span>
            <span className="text-xs text-blueGray-400">
              <span>· </span>
              {/* Display relative time if it was posted today. If not, display formatted date-time */}
              {dayjs(postData.created_at).isSame(dayjs(), 'day')
                ? dayjs(postData.created_at).fromNow()
                : dayjs(postData.created_at).format('YYYY/MM/DD')}
            </span>
          </div>
        </header>
        <section className="p-4 mb-24">
          <p className="text-sm text-blueGray-600">{postData.content}</p>
        </section>
        <footer className="p-4 border-t border-blueGray-200">
          <form onSubmit={onSubmitComment} className="flex gap-2">
            <img
              src={optimizeImage(userData?.image_url ?? userThumbnail)}
              alt="user"
              className="w-6 h-6 rounded-full"
            />
            <input
              type="text"
              placeholder="댓글을 작성하세요."
              value={content}
              onChange={onChangeContent}
              className="w-full border-b border-blueGray-200 text-sm focus:outline-none focus:border-blueGray-400"
            />
            <button type="submit" hidden></button>
          </form>
          <div>
            {commentsData?.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <img
                  src={optimizeImage(comment.user?.image_url ?? userThumbnail)}
                  alt="user"
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-xs text-blueGray-600">
                    {comment.user.name}
                  </p>
                  <p className="text-sm text-blueGray-400">
                    {dayjs(comment.created_at).fromNow()}
                  </p>
                  <p className="text-sm text-blueGray-600">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CommunityPost;
