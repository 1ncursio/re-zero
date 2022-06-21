import useUserSWR from '@hooks/swr/useUserSWR';
import useToggle from '@hooks/useToggle';
import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import HeaderUserIcon from '../HeaderUserIcon';
import HeaderUserMenu from '../HeaderUserMenu';
import LogInButton from '../LogInButton';

const Header = () => {
  const [userMenu, toggleUserMenu] = useToggle(false);
  const headerUserIconRef = useRef<HTMLDivElement>(null);

  const { data: userData, isLoading: isLoadingUserData } = useUserSWR();

  useEffect(() => {
    console.log({ userData });
  }, [userData]);

  const onOutsideClick = useCallback(
    (e: React.MouseEvent) => {
      if (!headerUserIconRef.current) return;
      if (headerUserIconRef.current.contains(e.target as any)) return;
      toggleUserMenu();
    },
    [toggleUserMenu],
  );

  return (
    <div className="w-lg mx-auto flex justify-between items-center">
      <div className="flex items-center gap-16">
        <div>
          <Link href="/">
            <a>
              {/* <Icon name="rezero" /> */}
              리제로 아이콘
            </a>
          </Link>
        </div>
        <div className="flex gap-8">
          <Link
            href="/reversi"
            className="text-blueGray-400 hover:text-blueGray-600 transition link-underline"
          >
            <a>리버시 게임</a>
          </Link>
          <Link
            href="/community"
            className="text-blueGray-400 hover:text-blueGray-600 transition link-underline"
          >
            <a>커뮤니티</a>
          </Link>
        </div>
      </div>
      <div className="flex items-center">
        <Link href="/search" className="mr-6">
          <a>
            {/* <Icon
              name="outlinedSearch"
              className="w-5 h-5 text-blueGray-600"
              fill="none"
              stroke="currentColor"
            /> */}
            검색 아이콘
          </a>
        </Link>
        {userData && !isLoadingUserData ? (
          <>
            <div ref={headerUserIconRef} className="flex items-center">
              <HeaderUserIcon onClick={toggleUserMenu} />
            </div>
            <HeaderUserMenu visible={userMenu} onClose={onOutsideClick} />
          </>
        ) : (
          <LogInButton />
        )}
      </div>
    </div>
  );
};

export default Header;
