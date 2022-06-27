// import Pagination from '@components/Pagination';
import PostList from '@components/PostList/PostList';
import RequireLogIn from '@components/RequireLogin/RequireLogin';
import RichTextEditor from '@components/RichText';
import usePostsSWR from '@hooks/swr/usePostsSWR';
import useUserSWR from '@hooks/swr/useUserSWR';
import useBoolean from '@hooks/useBoolean';
import client from '@lib/api/client';
import uploadImage from '@lib/api/comments/uploadImage';
import createPost from '@lib/api/posts/createPost';
import fetchPosts from '@lib/api/posts/fetchPosts';
import { ActionIcon, Button, Group, Modal, Pagination, Stack, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Search } from 'tabler-icons-react';
import { z } from 'zod';

interface FormValues {
  title: string;
  content: string;
}

const schema = z.object({
  title: z.string().max(50, { message: '제목은 최대 200자입니다.' }),
  content: z.string(),
});

const Community = () => {
  // form 관련
  const form = useForm<FormValues>({
    schema: zodResolver(schema),
    initialValues: {
      title: '',
      content: '',
    },
  });

  const [opened, handlers] = useDisclosure(false);
  const [loading, onLoading, offLoading] = useBoolean(false);

  const router = useRouter();
  const { page } = router.query;
  const [activePage, setPage] = useState(1);

  const { isLoading, isError, data, error } = useQuery('todos', fetchPosts, {
    refetchOnWindowFocus: false,
    retry: false,
  });

  const mutation = useMutation((newPost) => {
    return client.post('/api/posts', newPost);
  });

  // useEffect(() => {
  //   mutation.mutate({ content: 'test content', title: ' test title' });
  // }, []);

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
    page: activePage,
  });

  useEffect(() => {
    if (page) {
      setPage(Number(page));
      router.push('/community', {
        query: {
          page,
        },
      });
    }
  }, [page]);

  // for ux purpose only (pagination)
  usePostsSWR({ page: activePage + 1 });

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

  const onCreatePost = useCallback(
    async ({ title, content }: FormValues) => {
      if (!title || !content || !userData) return;

      try {
        onLoading();
        const data = await createPost({
          content,
          title,
        });
        router.push('/community', {
          pathname: data.id.toString(),
        });
      } catch (error) {
        console.error(error);
      } finally {
        offLoading();
      }
    },
    [router, onLoading, offLoading, userData],
  );

  // useEffect(() => {
  //   setCurrentUrl(new URL(window.location.href));
  // }, []);

  if (!userData && !isLoadingUserData) {
    return <RequireLogIn />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Head>
        <title>커뮤니티 - Re:zero</title>
      </Head>
      <div className="flex justify-end">
        <Group>
          <Link href="/search">
            <ActionIcon component="a">
              <Search size={18} />
            </ActionIcon>
          </Link>
          <Button type="button" onClick={() => handlers.open()} variant="filled">
            포스트 작성
          </Button>
        </Group>
        <Modal opened={opened} onClose={() => handlers.close()} title="포스트 작성" size="60%">
          <form onSubmit={form.onSubmit(onCreatePost)}>
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
                <Button type="submit" loading={loading}>
                  작성
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </div>
      {postsData && <PostList posts={postsData} />}
      <Pagination
        position="center"
        page={activePage}
        onChange={(p) => {
          setPage(p);
          router.push('/community', {
            query: {
              page: p,
            },
          });
        }}
        total={last_page}
      />
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
