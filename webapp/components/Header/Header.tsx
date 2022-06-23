import useUserSWR from '@hooks/swr/useUserSWR';
import useToggle from '@hooks/useToggle';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import { Search } from 'tabler-icons-react';
import { AiOutlineSearch } from 'react-icons/ai';
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
              <Image src="/assets/svg/rezero_logo.svg" alt="rezero-logo" width="100%" height="100%" />
            </a>
          </Link>
        </div>
        <div className="flex gap-8">
          <Link href="/play">
            <a className="text-blueGray-400 hover:text-blueGray-600 transition link-underline">리버시 게임</a>
          </Link>
          <Link href="/community">
            <a className="text-blueGray-400 hover:text-blueGray-600 transition link-underline">커뮤니티</a>
          </Link>
        </div>
      </div>
      <div className="flex items-center">
        <Link href="/search">
          <a className="mr-6">
            <Search size={24} className="text-blueGray-600" />
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
