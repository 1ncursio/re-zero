import Link from 'next/link';
import React from 'react';

export type HeaderUserMenuItemProps = {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
};

const HeaderUserMenuItem: React.FC<HeaderUserMenuItemProps> = ({
  children,
  to,
  onClick,
}: HeaderUserMenuItemProps) => {
  const jsx = (
    <div onClick={onClick} className="p-4 bg-white hover:bg-blueGray-100 cursor-pointer text-blueGray-600">
      {children}
    </div>
  );
  return to ? (
    <Link href={to}>
      <a>{jsx}</a>
    </Link>
  ) : (
    jsx
  );
};

export default HeaderUserMenuItem;
