import produce from 'immer';
import { KeyedMutator } from 'swr';
import { Comment } from '../../../typings/comment';
import { User } from '../../../typings/user';
import client from '../client';

type CreateReplyParams = {
  postId: string;
  commentId: number;
  user: User;
  content: string;
  mutateReplies: KeyedMutator<Comment[]>;
};

export default async function createReply({
  postId,
  commentId,
  user,
  content,
  mutateReplies,
}: CreateReplyParams): Promise<Comment> {
  mutateReplies(
    produce((replies?: Comment[]) => {
      console.log({ replies });
      replies?.push({
        id: Math.floor(Math.random() * 100000),
        content,
        user,
        likes: [],
        created_at: new Date(),
        updated_at: new Date(),
        reply_id: commentId,
        isLiked: false,
        isMine: true,
        post_id: +postId,
        reply_count: 0,
        user_id: user.id,
      });
    }),
    false,
  );

  const response = await client.post(
    `/api/posts/${postId}/comments/${commentId}/replies`,
    {
      content,
    },
  );

  return response.data.payload;
}

// const submitReply = useCallback(
//   async (content: string) => {
//     if (!content || !userData) return;

//     await mutateReplies(
//       produce((replies?: Comment[]) => {
//         console.log({ replies });
//         replies?.push({
//           id: Math.floor(Math.random() * 100000),
//           content,
//           user: userData,
//           likes: [],
//           created_at: new Date(),
//           updated_at: new Date(),
//           reply_id: commentId,
//           isLiked: false,
//           isMine: true,
//           post_id: +postId,
//           reply_count: 0,
//           user_id: userData.id,
//         });
//       }),
//       false,
//     );

//     console.log('mutate invoked');

//     try {
//       await createReply({
//         postId,
//         content,
//         commentId,
//         mutateReplies,
//       });
//     } catch (e) {
//       console.error(e);
//     }

//     mutateReplies();
//   },
//   [postId, userData, mutateReplies, commentId],
// );
