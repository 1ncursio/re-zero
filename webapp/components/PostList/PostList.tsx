import optimizeImage from '@lib/optimizeImage';
import relativeCreatedAt from '@lib/relativeCreatedAt';
import { Avatar, Stack, Text, Title } from '@mantine/core';
import { Post } from '@typings/post';
import Link from 'next/link';
import { FC } from 'react';

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
    <Stack>
      {posts?.map((post) => (
        <div key={post.id}>
          <div className="flex justify-between my-4">
            <span className="flex items-center ml-2 gap-2">
              {hasImage(post.content) &&
                // <Icon name="outlinedImage" className="w-4 h-4" />
                'outlinedImage'}
              <Link href={`/community/${post.id}`}>
                <a>
                  <Title order={4}>{post.title}</Title>
                </a>
              </Link>
            </span>
            <Text size="xs" color="dimmed">
              {relativeCreatedAt(post.created_at)}
            </Text>
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
    </Stack>
  );
};

export default PostList;
