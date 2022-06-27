import optimizeImage from '@lib/optimizeImage';
import relativeCreatedAt from '@lib/relativeCreatedAt';
import { Avatar, Group, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { Post } from '@typings/post';
import Link from 'next/link';
import { FC } from 'react';
import { FiImage } from 'react-icons/fi';

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
              {hasImage(post.content) && <FiImage size={16} />}
              <Link href={`/community/${post.id}`}>
                <UnstyledButton component="a">
                  <Title order={4}>{post.title}</Title>
                </UnstyledButton>
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
          <Group p={8} spacing="xs">
            <Avatar src={optimizeImage(post.user?.image_url)} radius="xl" size="sm" />
            <Text size="sm">{post.user.name}</Text>
          </Group>
        </div>
      ))}
    </Stack>
  );
};

export default PostList;
