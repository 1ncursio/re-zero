import { ActionIcon, Group, Text, Tooltip } from '@mantine/core';
import { Comment } from '@typings/comment';
import { FC } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';

type CommentLikeButtonProps = {
  toggleLikeComment: () => void;
  comment: Comment;
};

const CommentLikeButton: FC<CommentLikeButtonProps> = ({ toggleLikeComment, comment }) => {
  return (
    <Group spacing={4}>
      <Tooltip label={comment.isLiked ? '좋아요 취소' : '좋아요'}>
        <ActionIcon onClick={toggleLikeComment}>
          {comment.isLiked ? <HiHeart size={16} /> : <HiOutlineHeart size={16} />}
        </ActionIcon>
      </Tooltip>
      <Text size="xs">{comment.likes.length}</Text>
    </Group>
  );
};

export default CommentLikeButton;
