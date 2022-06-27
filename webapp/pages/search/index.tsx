import Pagination from '@components/Pagination';
import SearchPostList from '@components/SearchPostList';
import useSearchPostsSWR from '@hooks/swr/useSearchPostsSWR';
import useBoolean from '@hooks/useBoolean';
import { useForm, zodResolver } from '@mantine/form';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
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
  // const page = Number(query.get('page')) || 1;
  // const history = useHistory();
  // const q = query.get('q') !== null ? query.get('q') : '';
  const [isFocus, focus, blur] = useBoolean(false);
  const form = useForm<FormValues>({
    schema: zodResolver(schema),
    initialValues: {
      q: '',
    },
  });

  const searchRef = useRef<HTMLInputElement>(null);
  const { data: postsData, links: linksData, total } = useSearchPostsSWR({ page, q });

  // for ux purpose only (pagination)
  useSearchPostsSWR({ page: (page ? Number(page) : 1) + 1, q: (q as string) ?? '' });

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
        router.push('/search', {
          query: {
            q: encodedQ,
          },
        });
      else router.push('/search');
    },
    [router],
  );

  const currentUrl = new URL((window as Window).location.href);

  return (
    <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4">
      <Head>
        <title>{q ? `"${q}" 검색결과 - Re:zero` : 'Re:zero'}</title>
      </Head>
      <form
        onSubmit={form.onSubmit(onSearch)}
        className={
          isFocus
            ? 'text-blueGray-600 flex items-center border-b border-blueGray-400 bg-white p-2 w-full justify-center'
            : 'text-blueGray-600 flex items-center border-b border-blueGray-200 bg-white p-2 w-full justify-center'
        }
      >
        <Search />
        <input
          type="search"
          placeholder="검색어를 입력하세요"
          // eslint-disable-next-line no-use-before-define
          // css={searchStyle}
          onFocus={focus}
          onBlur={blur}
          className="focus:outline-none flex-1"
          {...form.getInputProps('q')}
          ref={searchRef}
        />
        <button type="submit" hidden />
      </form>
      {postsData && q && (
        <div className="text-blueGray-600 my-4">
          <span>총 </span>
          <b className="font-bold text-emerald-500">{total}</b>
          <span>개의 포스트를 찾았습니다.</span>
        </div>
      )}
      {postsData && <SearchPostList posts={postsData} />}
      <Pagination links={linksData} referrerUrl={currentUrl} />
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
