import { css } from '@emotion/react';
import React, { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import Icon from '../../components/Icon';
import Pagination from '../../components/Pagination';
import PostList from '../../components/PostList/PostList';
import SearchPostList from '../../components/SearchPostList';
import useSearchPostsSWR from '../../hooks/swr/useSearchPostsSWR';
import useBoolean from '../../hooks/useBoolean';
import useQuery from '../../hooks/useQuery';

const Search = () => {
  const query = useQuery();
  const page = Number(query.get('page')) || 1;
  const history = useHistory();
  const q = query.get('q');
  const [isFocus, focus, blur] = useBoolean(false);
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm();
  const { data: postsData, links: linksData } = useSearchPostsSWR({ page, q });

  useEffect(() => {
    setFocus('q');
    if (q) {
      reset({ q });
    }
  }, []);

  const onSearch = useCallback(
    ({ q }: { q: string }) => {
      if (q) history.push(`/search?q=${q}`);
      else history.push('/search');
    },
    [q, history],
  );

  return (
    <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4">
      <Helmet>
        <title>{`"${q}" 검색결과 | Lathello`}</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearch)}
        className={
          isFocus
            ? 'text-blueGray-600 flex items-center border-b border-blueGray-400 bg-white p-2 w-full justify-center'
            : 'text-blueGray-600 flex items-center border-b border-blueGray-200 bg-white p-2 w-full justify-center'
        }
      >
        <Icon name="outlinedSearch" className="w-6 h-6 mr-2" />
        <input
          type="search"
          {...register('q', { required: true })}
          placeholder="검색어를 입력하세요"
          // eslint-disable-next-line no-use-before-define
          css={searchStyle}
          onFocus={focus}
          onBlur={blur}
          className="focus:outline-none flex-1"
        />
        <button type="submit" hidden />
      </form>
      {postsData && <SearchPostList posts={postsData} />}
      <Pagination links={linksData} />
    </div>
  );
};

const searchStyle = css`
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }
`;

export default Search;

// hide input search x button