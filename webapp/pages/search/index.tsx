import SearchPostList from '@components/SearchPostList';
import useSearchPostsSWR from '@hooks/swr/useSearchPostsSWR';
import { Pagination, Text, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Search } from 'tabler-icons-react';
import { z } from 'zod';

interface FormValues {
  q: string;
}

const schema = z.object({
  q: z.string().max(50, { message: '검색어는 최대 50자입니다.' }),
});

const SearchPostsPage = () => {
  const router = useRouter();
  const { page, q } = router.query;
  const [activePage, setPage] = useState(1);

  const form = useForm<FormValues>({
    schema: zodResolver(schema),
    initialValues: {
      q: '',
    },
  });

  const searchRef = useRef<HTMLInputElement>(null);
  const {
    data: postsData,
    links: linksData,
    total,
    last_page,
  } = useSearchPostsSWR({ page: activePage, q: q as string });

  // for ux purpose only (pagination)
  useSearchPostsSWR({ page: activePage + 1, q: (q as string) ?? '' });

  useEffect(() => {
    searchRef.current?.focus();
    if (q && typeof q === 'string') {
      form.setValues({ q });
    }
  }, [q]);

  const onSearch = useCallback(
    ({ q }: FormValues) => {
      const encodedQ = encodeURIComponent(q);
      if (q)
        router.push(
          '/search',
          {
            query: {
              q: encodedQ,
              page: 1,
            },
          },
          { shallow: true },
        );
      else router.push('/search', undefined, { shallow: true });
    },
    [router],
  );

  useEffect(() => {
    console.log({ q });
  }, [q]);

  // useEffect(() => {
  //   if (q) {
  //     // setPage(Number(page));
  //     router.push('/search', {
  //       query: {
  //         // page,
  //         q,
  //       },
  //     });
  //   }
  // }, [q]);

  return (
    <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4">
      <Head>
        <title>{q ? `"${q}" 검색결과 - Re:zero` : 'Re:zero'}</title>
      </Head>
      <form onSubmit={form.onSubmit(onSearch)}>
        <TextInput
          type="search"
          placeholder="검색어를 입력하세요"
          {...form.getInputProps('q')}
          ref={searchRef}
          icon={<Search size={16} />}
        />
        <button type="submit" hidden />
      </form>
      {postsData && q && (
        <Text my={16}>
          <Text component="span">총 </Text>
          <Text weight={500} color="green" component="span">
            {total}
          </Text>
          <Text component="span">개의 포스트를 찾았습니다.</Text>
        </Text>
      )}
      {postsData && <SearchPostList posts={postsData} />}
      <Pagination
        position="center"
        page={activePage}
        onChange={(p) => {
          setPage(p);
          router.push(
            '/search',
            {
              query: {
                q: q as string,
                page: p,
              },
            },
            { shallow: true },
          );
        }}
        total={last_page}
      />
    </div>
  );
};

// const searchStyle = css`
//   &::-webkit-search-decoration,
//   &::-webkit-search-cancel-button,
//   &::-webkit-search-results-button,
//   &::-webkit-search-results-decoration {
//     -webkit-appearance: none;
//   }
// `;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const initialLocale = locale || 'ko';

  return {
    props: {
      ...(await serverSideTranslations(initialLocale, ['common', 'navbar'])),
    },
  };
};

export default SearchPostsPage;
