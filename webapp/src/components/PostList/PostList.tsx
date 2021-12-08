import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { userThumbnail } from '../../assets/images';
import optimizeImage from '../../lib/optimizeImage';
import relativeCreatedAt from '../../lib/relativeCreatedAt';
import { Post } from '../../typings/post';
import Icon from '../Icon';

type PostListProps = {
  posts: Post[];
};

const PostList: FC<PostListProps> = ({ posts }) => {
  // delete all the html tags from the post content
  const cleanContent = (content: string) => {
    return content.replace(/<[^>]*>?/gm, '');
  };

  // return true if posts content has img tag
  const hasImage = (content: string) => {
    return content.includes('<img');
  };

  return (
    <div className="flex flex-col gap-6 divide-y divide-blueGray-200">
      {posts?.map((post) => (
        <div key={post.id}>
          <div className="flex justify-between my-4">
            {/* eslint-disable-next-line prefer-template */}
            <span className="flex items-center ml-2 gap-2">
              {hasImage(post.content) && (
                <Icon name="outlinedImage" className="w-4 h-4" />
              )}
              <Link to={'/community/' + post.id}>
                <h1 className="text-blueGray-700">{post.title}</h1>
              </Link>
            </span>
            <span className="text-xs text-blueGray-500">
              {relativeCreatedAt(post.created_at)}
            </span>
          </div>
          <p
            className="m-2 text-sm text-blueGray-600 line-clamp-2"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: cleanContent(post.content) }}
          />
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

export default PostList;
