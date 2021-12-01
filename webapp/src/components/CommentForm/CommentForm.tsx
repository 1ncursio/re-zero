import React, {
  ChangeEvent,
  FC,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { useParams } from 'react-router';
import { userThumbnail } from '../../assets/images';
import useUserSWR from '../../hooks/swr/useUserSWR';
import useComment from '../../hooks/useComment';
import optimizeImage from '../../lib/optimizeImage';

type CommentFormProps = {
  isReply?: boolean;
};

// eslint-disable-next-line no-undef
const CommentForm = forwardRef<HTMLInputElement, CommentFormProps>(
  ({ isReply }, ref) => {
    const [content, setContent] = useState('');
    const { postId } = useParams<{ postId: string }>();

    const { data: userData } = useUserSWR();

    const { submitComment } = useComment({ postId });

    const onChangeContent = useCallback(
      // eslint-disable-next-line no-undef
      (e: ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
      },
      [setContent],
    );

    return (
      <form
        onSubmit={submitComment({ content, setContent })}
        className="flex gap-2 mb-6"
      >
        <img
          src={optimizeImage(userData?.image_url ?? userThumbnail)}
          alt="user"
          className={
            isReply ? 'w-6 h-6 rounded-full' : 'w-8 h-8 rounded-full mr-1'
          }
        />
        <input
          type="text"
          placeholder="댓글 추가"
          value={content}
          onChange={onChangeContent}
          className="w-full border-b border-blueGray-200 text-sm focus:outline-none focus:border-blueGray-400"
          ref={ref}
        />
        <button type="submit" hidden />
      </form>
    );
  },
);

export default CommentForm;
