import CommentContainer from '@components/CommentContainer';
import EditPostForm from '@components/EditPostForm';
import PostLikeButton from '@components/PostLikeButton';
import PostViews from '@components/PostViews';
import RequireLogIn from '@components/RequireLogin/RequireLogin';
import StyledModal from '@components/StyledModal';
import usePostSWR from '@hooks/swr/usePostSWR';
import useUserSWR from '@hooks/swr/useUserSWR';
import useBoolean from '@hooks/useBoolean';
import useInput from '@hooks/useInput';
import deletePost from '@lib/api/posts/deletePost';
import toggleLikePost from '@lib/api/posts/toggleLikePost';
import updatePost from '@lib/api/posts/updatePost';
import optimizeImage from '@lib/optimizeImage';
import relativeCreatedAt from '@lib/relativeCreatedAt';
import { Avatar, Divider, Group, Stack, Text, TypographyStylesProvider, UnstyledButton } from '@mantine/core';
import { Editor } from '@tinymce/tinymce-react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useRef } from 'react';

const CommunityPost = () => {
  const [title, onChangeTitle, setTitle] = useInput('');
  const [isOpenEditModal, openEditModal, closeEditModal] = useBoolean(false);
  const [isOpenDeleteModal, openDeleteModal, closeDeleteModal] = useBoolean(false);

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
      closeEditModal();
    } catch (error) {
      console.error(error);
    }
  }, [title, editorRef, postData, closeEditModal, mutatePost]);

  const onDeletePost = useCallback(async () => {
    await deletePost({ postId: postId as string });
    closeDeleteModal();
    router.push('/community');
  }, [closeDeleteModal, postId, router]);

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
                <UnstyledButton onClick={openEditModal}>
                  <Text size="xs">수정</Text>
                </UnstyledButton>
                <StyledModal
                  isOpen={isOpenEditModal}
                  onRequestClose={closeEditModal}
                  onRequestOk={onUpdatePost}
                  title="포스트 수정"
                  showCloseButton
                  showOkButton
                  width="1024px"
                  okText="수정"
                >
                  <EditPostForm
                    ref={editorRef}
                    title={title}
                    onChangeTitle={onChangeTitle}
                    setTitle={setTitle}
                  />
                </StyledModal>
                <UnstyledButton onClick={openDeleteModal}>
                  <Text size="xs" color="red">
                    삭제
                  </Text>
                </UnstyledButton>
                <StyledModal
                  isOpen={isOpenDeleteModal}
                  onRequestClose={closeDeleteModal}
                  onRequestOk={onDeletePost}
                  title="게시글 삭제"
                  showCloseButton
                  showOkButton
                  width="480px"
                >
                  게시글을 정말로 삭제하시겠습니까?
                </StyledModal>
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
