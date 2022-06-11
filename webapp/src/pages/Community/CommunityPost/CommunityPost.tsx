import { css } from '@emotion/react';
import { Editor } from '@tinymce/tinymce-react';
import produce from 'immer';
import React, { useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory, useParams } from 'react-router-dom';
import { userThumbnail } from '../../../assets/images';
import CommentContainer from '../../../components/CommentContainer';
import EditPostForm from '../../../components/EditPostForm';
import PostLikeButton from '../../../components/PostLikeButton';
import PostViews from '../../../components/PostViews';
import RequireLogIn from '../../../components/RequireLogin/RequireLogin';
import StyledModal from '../../../components/StyledModal';
import usePostSWR from '../../../hooks/swr/usePostSWR';
import useUserSWR from '../../../hooks/swr/useUserSWR';
import useBoolean from '../../../hooks/useBoolean';
import useInput from '../../../hooks/useInput';
import deletePost from '../../../lib/api/posts/deletePost';
import toggleLikePost from '../../../lib/api/posts/toggleLikePost';
import updatePost from '../../../lib/api/posts/updatePost';
import optimizeImage from '../../../lib/optimizeImage';
import relativeCreatedAt from '../../../lib/relativeCreatedAt';
import { Post } from '../../../typings/post';

const CommunityPost = () => {
  const [title, onChangeTitle, setTitle] = useInput('');
  const [isOpenEditModal, openEditModal, closeEditModal] = useBoolean(false);
  const [isOpenDeleteModal, openDeleteModal, closeDeleteModal] = useBoolean(false);
  // extract postId from url using react router
  const { postId } = useParams<{ postId: string }>();
  const history = useHistory();
  const editorRef = useRef<Editor>(null);

  const { data: postData, mutate: mutatePost } = usePostSWR(postId);
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
    await deletePost({ postId });
    closeDeleteModal();
    history.push('/community');
  }, [closeDeleteModal, postId, history]);

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
    <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4">
      <Helmet>
        <title>{postData.title} - Re:zero </title>
      </Helmet>
      <div className="min-h-[24rem]">
        <header className="p-4 border-b border-blueGray-200">
          <h1 className="text-lg text-blueGray-700 mb-2">{postData.title}</h1>
          <div className="flex justify-between">
            <div className="flex gap-1 items-center">
              <img
                src={optimizeImage(postData.user?.image_url ?? userThumbnail)}
                alt="user"
                className="w-8 h-8 rounded-full mr-1"
              />
              <span className="text-xs text-blueGray-600">{postData.user.name}</span>
              <span className="text-xs text-blueGray-400">
                <span>· </span>
                {relativeCreatedAt(postData.created_at)}
              </span>
            </div>
            {postData.isMine && (
              <div className="flex gap-2">
                <button type="button" className="text-xs text-blueGray-600" onClick={openEditModal}>
                  수정
                </button>
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
                <button type="button" className="text-xs text-red-400" onClick={openDeleteModal}>
                  삭제
                </button>
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
              </div>
            )}
          </div>
        </header>
        <section className="p-4 mb-24">
          <p dangerouslySetInnerHTML={{ __html: postData.content }} css={contentStyle} />
          <div className="flex gap-2 my-6 py-4">
            <PostLikeButton toggleLikePost={onToggleLikePost} />
            <PostViews views={postData.views} />
          </div>
        </section>
        <footer className="p-4">
          <CommentContainer />
        </footer>
      </div>
    </div>
  );
};

const contentStyle = css`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ul,
  ol {
    all: unset;
  }

  h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  h2 {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  h3 {
    display: block;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  h4 {
    display: block;
    margin-block-start: 1.33em;
    margin-block-end: 1.33em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
`;

export default CommunityPost;
