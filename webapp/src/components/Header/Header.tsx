import React, { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import tw from 'twin.macro';
import useUserSWR from '../../hooks/swr/useUserSWR';
import useToggle from '../../hooks/useToggle';
import HeaderUserIcon from '../HeaderUserIcon';
import HeaderUserMenu from '../HeaderUserMenu';
import Icon from '../Icon';
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
          <Link to="/">
            <h1 className="text-xl font-bold text-blueGray-600">Lathello</h1>
          </Link>
        </div>
        <div className="flex gap-8">
          <Link
            to="/othello"
            className="text-blueGray-400 hover:text-blueGray-600 transition link-underline"
          >
            오셀로 게임
          </Link>
          <Link
            to="/community"
            className="text-blueGray-400 hover:text-blueGray-600 transition link-underline"
          >
            커뮤니티
          </Link>
        </div>
      </div>
      <div className="flex items-center">
        <Link to="/search" className="mr-6">
          <Icon
            name="outlinedSearch"
            className="w-5 h-5 text-blueGray-600"
            fill="none"
            stroke="currentColor"
          />
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
