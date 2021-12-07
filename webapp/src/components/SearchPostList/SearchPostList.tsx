import { css } from '@emotion/react';
import React, { FC, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { userThumbnail } from '../../assets/images';
import useQuery from '../../hooks/useQuery';
import optimizeImage from '../../lib/optimizeImage';
import relativeCreatedAt from '../../lib/relativeCreatedAt';
import { Post } from '../../typings/post';

type SearchPostListProps = {
  posts: Post[];
};

const SearchPostList: FC<SearchPostListProps> = ({ posts }) => {
  const query = useQuery();
  const q = query.get('q');

  const getHighlightedText = (text: string, highlight: string | null) => {
    // Split on highlight term and include term into parts, ignore case
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-emerald-400 text-white">
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </>
    );
  };

  // delete all the html tags from the post content
  const cleanContent = (content: string) => {
    return content.replace(/<[^>]*>?/gm, '');
  };

  return (
    <div className="flex flex-col gap-6 divide-y divide-blueGray-200">
      {posts?.map((post) => (
        <div key={post.id}>
          <div className="flex justify-between my-4">
            {/* eslint-disable-next-line prefer-template */}
            <Link to={'/community/' + post.id}>
              <h1 className="text-blueGray-700 px-2">
                {getHighlightedText(post.title, q)}
              </h1>
            </Link>
            <span className="text-xs text-blueGray-500">
              {relativeCreatedAt(post.created_at)}
            </span>
          </div>
          <p className="m-2 text-sm text-blueGray-600 line-clamp-2">
            {getHighlightedText(cleanContent(post.content), q)}
          </p>
          <div className="p-2 flex gap-1 items-center">
            <img
              src={optimizeImage(post.user?.image_url ?? userThumbnail)}
              alt="user"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-xs text-blueGray-600">{post.user.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchPostList;
