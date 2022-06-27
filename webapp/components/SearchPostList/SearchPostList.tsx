import optimizeImage from '@lib/optimizeImage';
import relativeCreatedAt from '@lib/relativeCreatedAt';
import { Avatar, Text, UnstyledButton } from '@mantine/core';
import { Post } from '@typings/post';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { FiImage } from 'react-icons/fi';

type SearchPostListProps = {
  posts: Post[];
};

const SearchPostList: FC<SearchPostListProps> = ({ posts }) => {
  const router = useRouter();
  const { q } = router.query;

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
              {hasImage(post.content) && <FiImage size={16} />}
              <Link href={`/community/${post.id}`}>
                <UnstyledButton component="a">
                  <h1 className="text-blueGray-700">{getHighlightedText(post.title, q as string)}</h1>
                </UnstyledButton>
              </Link>
            </span>
            <span className="text-xs text-blueGray-500">{relativeCreatedAt(post.created_at)}</span>
          </div>
          <p
            className="m-2 text-sm text-blueGray-600 line-clamp-2"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: cleanContent(post.content) }}
          />
          <div className="p-2 flex gap-1 items-center">
            <Avatar src={optimizeImage(post.user?.image_url)} radius="xl" size="sm" />
            <Text size="sm">{post.user.name}</Text>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchPostList;
