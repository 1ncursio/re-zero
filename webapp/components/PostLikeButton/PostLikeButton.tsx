import usePostSWR from '@hooks/swr/usePostSWR';
import { ActionIcon, Group, Text, Tooltip } from '@mantine/core';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';

type PostLikeButtonProps = {
  toggleLikePost: () => void;
};

const PostLikeButton: FC<PostLikeButtonProps> = ({ toggleLikePost }) => {
  const router = useRouter();
  const { postId } = router.query;
  const { data: postData } = usePostSWR(postId as string);

  if (!postData) {
    return null;
  }

  return (
    <Group spacing={4}>
      <Tooltip label={postData.isLiked ? '좋아요 취소' : '이 게시물이 마음에 들어요!'}>
        <ActionIcon type="button" onClick={toggleLikePost}>
          {postData.isLiked ? <HiHeart size={16} /> : <HiOutlineHeart size={16} />}
        </ActionIcon>
      </Tooltip>
      <Text size="xs">{postData.likes.length}</Text>
    </Group>
  );
};

export default PostLikeButton;
