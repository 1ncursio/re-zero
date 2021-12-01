import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { userThumbnail } from '../../assets/images';
import usePostsSWR from '../../hooks/swr/usePostsSWR';
import optimizeImage from '../../lib/optimizeImage';
import relativeCreatedAt from '../../lib/relativeCreatedAt';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const Community = () => {
  const { data: postsData } = usePostsSWR();

  useEffect(() => {
    console.log('postsData', postsData);
  }, [postsData]);

  return (
    <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4">
      <Helmet>
        <title>Community | Lathello</title>
      </Helmet>
      <div className="flex flex-col gap-6 divide-y divide-blueGray-200">
        {postsData?.map((post) => (
          <div key={post.id}>
            <div className="flex justify-between my-4">
              <Link to={`/community/${post.id}`}>
                <h1 className="text-blueGray-700 px-2">{post.title}</h1>
              </Link>
              <span className="text-xs text-blueGray-500">
                {/* Display relative time if it was posted today. If not, display formatted date-time */}
                {relativeCreatedAt(post.created_at)}
              </span>
            </div>
            <p className="m-2 text-sm text-blueGray-600 line-clamp-2">
              {post.content}
            </p>
            <div className="p-2 flex gap-1 items-center">
              <img
                src={optimizeImage(post.user?.image_url ?? userThumbnail)}
                alt="user"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-xs text-blueGray-600">
                {post.user.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;