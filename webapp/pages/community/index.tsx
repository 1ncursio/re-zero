// import Pagination from '@components/Pagination';
import PostList from '@components/PostList/PostList';
import RequireLogIn from '@components/RequireLogin/RequireLogin';
import StyledModal from '@components/StyledModal';
import TinyEditor from '@components/TinyEditor';
import usePostsSWR from '@hooks/swr/usePostsSWR';
import useUserSWR from '@hooks/swr/useUserSWR';
import useBoolean from '@hooks/useBoolean';
import useInput from '@hooks/useInput';
import client from '@lib/api/client';
import uploadImage from '@lib/api/comments/uploadImage';
import createPost from '@lib/api/posts/createPost';
import fetchPosts from '@lib/api/posts/fetchPosts';
import { Pagination } from '@mantine/core';
import { Editor } from '@tinymce/tinymce-react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

const Community = () => {
  const [title, onChangeTitle] = useInput('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isOpen, openModal, closeModal] = useBoolean(false);
  const router = useRouter();
  const { page } = router.query;
  const editorRef = useRef<Editor>(null);

  const { isLoading, isError, data, error } = useQuery('todos', fetchPosts, {
    refetchOnWindowFocus: false,
    retry: false,
  });

  const mutation = useMutation((newPost) => {
    return client.post('/api/posts', newPost);
  });

  useEffect(() => {
    mutation.mutate({ content: 'test content', title: ' test title' });
  }, []);

  // export default async function createPost({
  //   content,
  //   title,
  // }: {
  //   content: string;
  //   title: string;
  // }): Promise<Post> {
  //   const response = await client.post('/api/posts', {
  //     content,
  //     title,
  //   });
  //   return response.data.payload;
  // }

  const { data: userData, isLoading: isLoadingUserData } = useUserSWR();

  const {
    data: postsData,
    links: linksData,
    last_page,
  } = usePostsSWR({
    page: page ? Number(page) : 1,
  });

  useEffect(() => {
    if (last_page) {
      console.log({ last_page });
    }
  }, [last_page]);

  // for ux purpose only (pagination)
  usePostsSWR({ page: (page ? Number(page) : 1) + 1 });

  const onUploadImage = useCallback(async (blobInfo, success, failure) => {
    try {
      const formData = new FormData();
      formData.append('image', blobInfo.blob());
      const imageName = await uploadImage(formData);
      success(`http://localhost:8000/storage/images/${imageName}`);
      // console.log(data);
    } catch (error) {
      console.error(error);
      failure();
    }
  }, []);

  const onCreatePost = useCallback(async () => {
    if (!editorRef.current || !title) return;
    // @ts-ignore
    const content = editorRef.current.getContent();

    try {
      const data = await createPost({
        content,
        title,
      });
      router.push(`/community/${data.id}`);
    } catch (error) {
      console.error(error);
    }
  }, [router, title, editorRef]);

  useEffect(() => {
    setCurrentUrl(new URL(window.location.href));
  }, []);

  if (!userData && !isLoadingUserData) {
    return <RequireLogIn />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Head>
        <title>커뮤니티 - Re:zero</title>
      </Head>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openModal}
          className="bg-white border border-blueGray-500 hover:border-emerald-500 text-blueGray-500 hover:text-emerald-500 py-1 px-4 capitalize"
        >
          포스트 작성
        </button>
        <StyledModal
          isOpen={isOpen}
          onRequestClose={closeModal}
          onRequestOk={onCreatePost}
          title="포스트 작성"
          showCloseButton
          showOkButton
          width="1024px"
          okText="작성"
        >
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={title}
              onChange={onChangeTitle}
              placeholder="제목"
              className="focus:outline-none focus:shadow-outline border border-gray-300 py-2 px-4"
            />
            <TinyEditor onUploadImage={onUploadImage} ref={editorRef} />
          </div>
        </StyledModal>
      </div>
      {postsData && <PostList posts={postsData} />}
      {/* <Pagination links={linksData} referrerUrl={currentUrl} /> */}
      <Pagination total={last_page} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const initialLocale = locale || 'ko';

  return {
    props: {
      ...(await serverSideTranslations(initialLocale, ['common', 'navbar'])),
    },
  };
};

export default Community;
