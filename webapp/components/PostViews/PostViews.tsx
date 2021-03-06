import { Group, Text, Tooltip } from '@mantine/core';
import { FC } from 'react';
import { Eye } from 'tabler-icons-react';

type PostViewsProps = {
  views: number;
};

const PostViews: FC<PostViewsProps> = ({ views }) => {
  return (
    <Tooltip label="์กฐํ์">
      <Group spacing="xs">
        <Eye size={16} />
        <Text size="xs">{views}</Text>
      </Group>
    </Tooltip>
  );
};

export default PostViews;
