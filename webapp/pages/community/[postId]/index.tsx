import CommentContainer from '@components/CommentContainer';
import EditPostForm from '@components/EditPostForm';
import PostLikeButton from '@components/PostLikeButton';
import PostViews from '@components/PostViews';
import RequireLogIn from '@components/RequireLogin/RequireLogin';
import usePostSWR from '@hooks/swr/usePostSWR';
import useUserSWR from '@hooks/swr/useUserSWR';
import useInput from '@hooks/useInput';
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
  TypographyStylesProvider,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { Editor } from '@tinymce/tinymce-react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useRef } from 'react';

const CommunityPost = () => {
  const [opened, handlers] = useDisclosure(false);
  const modals = useModals();
  const [title, onChangeTitle, setTitle] = useInput('');

  const router = useRouter();
  const { postId } = router.query;
  const editorRef = useRef<Editor>(null);

  const { data: postData, mutate: mutatePost } = usePostSWR(postId as string);
  const { data: userData, isLoading: isLoadingUserData } = useUserSWR();

  const onUpdatePost = useCallback(async () => {
    if (!editorRef.current || !title || !postData) return;
    // @ts-ignore
    const content = editorRef.current.getContent();

    try {
      await updatePost({
        content,
        postId: postData.id,
        title,
        mutatePost,
      });
    } catch (error) {
      console.error(error);
    }
  }, [title, editorRef, postData, mutatePost]);

  const onDeletePost = useCallback(async () => {
    await deletePost({ postId: postId as string });
    router.push('/community');
  }, [postId, router]);

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
      },
      onConfirm: onDeletePost,
    });
  }, [modals, onDeletePost]);

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
                <UnstyledButton onClick={() => handlers.open()}>
                  <Text size="xs">수정</Text>
                </UnstyledButton>
                <Modal opened={opened} onClose={() => handlers.close()} title="포스트 수정" size="60%">
                  <Stack spacing="sm">
                    <EditPostForm
                      ref={editorRef}
                      title={title}
                      onChangeTitle={onChangeTitle}
                      setTitle={setTitle}
                    />
                    <Group position="right">
                      <Button type="button" variant="default" onClick={() => handlers.close()}>
                        취소
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          onUpdatePost();
                          handlers.close();
                        }}
                      >
                        수정
                      </Button>
                    </Group>
                  </Stack>
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
