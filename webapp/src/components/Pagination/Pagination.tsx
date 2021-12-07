import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { ILink } from '../../hooks/swr/usePostsSWR';

type PaginationProps = {
  links: ILink[];
};

const Pagination: FC<PaginationProps> = ({ links }) => {
  const currentPage = (url: string) => new URL(url).searchParams.get('page');

  if (links.length < 3) {
    return null;
  }

  return (
    <div className="flex justify-center gap-1">
      {links.map((link, i) => (
        <div key={i} className="flex">
          {!link.url ? (
            <div
              className="px-3 py-2 text-xs text-gray-400"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ) : (
            <Link
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: link.label }}
              to={`/community?page=${currentPage(link.url)}`}
              className={
                link.active
                  ? 'px-3 py-2 text-xs border border-white bg-emerald-400 text-white'
                  : 'px-3 py-2 text-xs hover:border-emerald-400 border border-white hover:text-emerald-400'
              }
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Pagination;
