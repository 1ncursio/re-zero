import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { userThumbnail } from '../../assets/images';
import Pagination from '../../components/Pagination';
import PostList from '../../components/PostList/PostList';
import usePostsSWR from '../../hooks/swr/usePostsSWR';
import useQuery from '../../hooks/useQuery';
import optimizeImage from '../../lib/optimizeImage';
import relativeCreatedAt from '../../lib/relativeCreatedAt';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const Community = () => {
  const query = useQuery();
  const page = Number(query.get('page')) || 1;

  const { data: postsData, links: linksData } = usePostsSWR({
    page,
  });

  // for ux purpose only (pagination)
  usePostsSWR({
    page: page + 1,
  });

  return (
    <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4">
      <Helmet>
        <title>Community | Lathello</title>
      </Helmet>
      {postsData && <PostList posts={postsData} />}
      <Pagination links={linksData} />
    </div>
  );
};

export default Community;
