import { css } from '@emotion/react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import 'react-popper-tooltip/dist/styles.css';
import { useParams } from 'react-router-dom';
import { userThumbnail } from '../../../assets/images';
import CommentContainer from '../../../components/CommentContainer';
import Icon from '../../../components/Icon';
import PostLikeButton from '../../../components/PostLikeButton';
import usePostSWR from '../../../hooks/swr/usePostSWR';
import optimizeImage from '../../../lib/optimizeImage';
import relativeCreatedAt from '../../../lib/relativeCreatedAt';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const CommunityPost = () => {
  // extract postId from url using react router
  const { postId } = useParams<{ postId: string }>();

  const { data: postData } = usePostSWR(postId);

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
          <p
            dangerouslySetInnerHTML={{ __html: postData.content }}
            css={contentStyle}
          />
          <div className="flex gap-2 my-6 py-4">
            <PostLikeButton toggleLikePost={() => {}} />
            <div className="flex gap-1 items-center">
              <Icon name="eye" className="w-4 h-4" />
              <span className="text-xs text-blueGray-600">
                {postData.views}
              </span>
            </div>
          </div>
        </section>
        <footer className="p-4">
          <CommentContainer />
        </footer>
      </div>
    </div>
  );
};

const contentStyle = css`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    all: unset;
  }

  h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  h2 {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  h3 {
    display: block;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  h4 {
    display: block;
    margin-block-start: 1.33em;
    margin-block-end: 1.33em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
`;

export default CommunityPost;
