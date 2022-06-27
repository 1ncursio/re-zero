import CommentContainer from '@components/CommentContainer';
import PostLikeButton from '@components/PostLikeButton';
import PostViews from '@components/PostViews';
import RequireLogIn from '@components/RequireLogin/RequireLogin';
import RichTextEditor from '@components/RichText';
import usePostSWR from '@hooks/swr/usePostSWR';
import useUserSWR from '@hooks/swr/useUserSWR';
import useBoolean from '@hooks/useBoolean';
import uploadImage from '@lib/api/comments/uploadImage';
import deletePost from '@lib/api/posts/deletePost';
import toggleLikePost from '@lib/api/posts/toggleLikePost';
import updatePost from '@lib/api/posts/updatePost';
import optimizeImage from '@lib/optimizeImage';
import relativeCreatedAt from '@lib/relativeCreatedAt';
import {
  Avatar,
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  TypographyStylesProvider,
  UnstyledButton,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { z } from 'zod';

interface FormValues {
  title: string;
  content: string;
}

const schema = z.object({
  title: z.string().max(50, { message: '제목은 최대 200자입니다.' }),
  content: z.string(),
});

const CommunityPost = () => {
  // form 관련
  const form = useForm<FormValues>({
    schema: zodResolver(schema),
    initialValues: {
      title: '',
      content: '',
    },
  });

  const [opened, handlers] = useDisclosure(false);
  const [loadingEditPost, onLoadingEditPost, offLoadingEditPost] = useBoolean(false);
  const [loadingDeletePost, onLoadingDeletePost, offLoadingDeletePost] = useBoolean(false);
  const modals = useModals();

  const router = useRouter();
  const { postId } = router.query;

  const { data: postData, mutate: mutatePost } = usePostSWR(postId as string);
  const { data: userData, isLoading: isLoadingUserData } = useUserSWR();

  const onUpdatePost = useCallback(
    async ({ title, content }: FormValues) => {
      if (!title || !content || !userData || !postData) return;

      try {
        onLoadingEditPost();
        await updatePost({
          content,
          postId: postData.id,
          title,
          mutatePost,
        });
        handlers.close();
      } catch (error) {
        console.error(error);
      } finally {
        offLoadingEditPost();
      }
    },
    [postData, userData, mutatePost, handlers, onLoadingEditPost, offLoadingEditPost],
  );

  const onDeletePost = useCallback(async () => {
    try {
      onLoadingDeletePost();
      await deletePost({ postId: postId as string });
    } catch (error) {
      console.error(error);
    } finally {
      offLoadingDeletePost();
      router.push('/community');
    }
  }, [postId, router, onLoadingDeletePost, offLoadingDeletePost]);

  const onToggleLikePost = useCallback(async () => {
    if (!postData || !userData) return;

    try {
      // TODO: 좋아요 optimistic update 처리 필요
      // mutatePost(
      //   produce((post?: Post) => {
      //     if (!post || !userData) return;

      //     if (post.isLiked) {
      //       post.isLiked = false;
      //       post.likes = post.likes.filter(
      //         (likedUser) => likedUser.id !== userData.id,
      //       );
      //     } else {
      //       post.isLiked = true;
      //       post.likes.push(userData);
      //     }
      //   }),
      //   false,
      // );
      await toggleLikePost({ postId: postData.id, mutatePost });
    } catch (error) {
      console.error(error);
    } finally {
      mutatePost();
    }
  }, [postData, userData, mutatePost]);

  const handleImageUpload = useCallback(
    (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('image', file);

        uploadImage(formData)
          .then((imageName) =>
            resolve(`${process.env.NEXT_PUBLIC_DEV_BACKEND_URL}/storage/images/${imageName}`),
          )
          .catch(() => reject(new Error('Image upload failed')));
      }),
    [],
  );

  const openDeletePostModal = useCallback(() => {
    modals.openConfirmModal({
      title: '포스트 삭제',
      children: <Text size="sm">게시글을 정말로 삭제하시겠습니까?</Text>,
      labels: {
        cancel: '취소',
        confirm: '삭제',
      },
      confirmProps: {
        color: 'red',
        loading: loadingDeletePost,
      },
      onConfirm: onDeletePost,
    });
  }, [modals, onDeletePost, loadingDeletePost]);

  if (!postData) {
    return null;
  }

  if (!userData && !isLoadingUserData) {
    return <RequireLogIn />;
  }

  return (
    <div className="">
      <Head>
        <title>{postData.title} - Re:zero </title>
      </Head>
      <Stack className="min-h-[24rem]" spacing="sm">
        <Stack p="sm" spacing="sm">
          <Text size="lg">{postData.title}</Text>
          <div className="flex justify-between">
            <div className="flex gap-1 items-center">
              <Avatar src={optimizeImage(postData.user?.image_url)} radius="xl" size="sm" />
              <Text size="xs">{postData.user.name}</Text>
              <Text size="xs" color="dimmed">
                <span>· </span>
                {relativeCreatedAt(postData.created_at)}
              </Text>
            </div>
            {postData.isMine && (
              <Group spacing="xs">
                <UnstyledButton
                  onClick={() => {
                    form.setValues({
                      title: postData.title,
                      content: postData.content,
                    });
                    handlers.open();
                  }}
                >
                  <Text size="xs">수정</Text>
                </UnstyledButton>
                <Modal opened={opened} onClose={() => handlers.close()} title="포스트 수정" size="60%">
                  <form onSubmit={form.onSubmit(onUpdatePost)}>
                    <Stack spacing="sm">
                      <TextInput required type="text" {...form.getInputProps('title')} placeholder="제목" />
                      <RichTextEditor
                        controls={[
                          ['bold', 'italic', 'underline', 'image'],
                          ['unorderedList', 'h1', 'h2', 'h3'],
                        ]}
                        {...form.getInputProps('content')}
                        onImageUpload={handleImageUpload}
                      />
                      <Group position="right">
                        <Button type="button" variant="default" onClick={() => handlers.close()}>
                          취소
                        </Button>
                        <Button type="submit" loading={loadingEditPost}>
                          수정
                        </Button>
                      </Group>
                    </Stack>
                  </form>
                </Modal>
                <UnstyledButton onClick={openDeletePostModal}>
                  <Text size="xs" color="red">
                    삭제
                  </Text>
                </UnstyledButton>
              </Group>
            )}
          </div>
        </Stack>
        <Divider size="xs" />
        <Stack p="sm">
          <TypographyStylesProvider>
            <div dangerouslySetInnerHTML={{ __html: postData.content }} />
          </TypographyStylesProvider>
          <Group spacing="xs" py={16} my={24}>
            <PostLikeButton toggleLikePost={onToggleLikePost} />
            <PostViews views={postData.views} />
          </Group>
        </Stack>
        <footer className="p-4">
          <CommentContainer />
        </footer>
      </Stack>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const initialLocale = locale || 'ko';

  return {
    props: {
      ...(await serverSideTranslations(initialLocale, ['common', 'navbar'])),
    },
  };
};

export default CommunityPost;
