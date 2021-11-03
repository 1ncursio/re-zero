import { css } from '@emotion/react';
import React, { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useUserSWR from '../../hooks/swr/useUserSWR';
import useToggle from '../../hooks/useToggle';
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
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center gap-16">
        <div>
          <Link to="/">
            <h1 className="text-xl font-bold text-blueGray-600">Lathello</h1>
          </Link>
        </div>
        <div className="text-blueGray-500 position-relative">
          <Link
            to="/othello"
            className="
              relative
              before:content-['']
              before:absolute
              before:block
              before:w-full
              before:h-[1px]
              before:bottom-0
              before:left-0
              before:origin-top-left
            before:bg-blueGray-500
              before:transform
              before:transition
              before:duration-200
              before:scale-0
              hover:before:scale-100  
            "
          >
            Othello
          </Link>
        </div>
      </div>
      {userData && !isLoadingUserData ? (
        <div>
          <div ref={headerUserIconRef} className="flex items-center">
            <HeaderUserIcon onClick={toggleUserMenu} />
          </div>
          <HeaderUserMenu visible={userMenu} onClose={onOutsideClick} />
        </div>
      ) : (
        <LogInButton />
      )}
    </div>
  );
};

const linkStyle = css`
  position: relative;

  /* a::before {
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #000;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  a:hover::before {
    transform: scaleX(1);
  } */
`;

export default Header;
