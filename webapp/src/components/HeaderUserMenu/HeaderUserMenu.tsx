import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import useLogout from '../../hooks/useLogout';
import HeaderUserMenuItem from '../HeaderUserMenuItem';

type HeaderUserMenuProps = {
  onClose: (e: React.MouseEvent) => void;
  visible: boolean;
};

const HeaderUserMenu = ({ onClose, visible }: HeaderUserMenuProps) => {
  const logout = useLogout();

  if (!visible) return null;

  return (
    <OutsideClickHandler onOutsideClick={onClose}>
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute text-sm w-32 shadow-10 right-0 top-3 text-blueGray-600 z-10"
          tabIndex={0}
        >
          <HeaderUserMenuItem to="/account/profile">
            내 프로필
          </HeaderUserMenuItem>
          <HeaderUserMenuItem onClick={logout}>로그아웃</HeaderUserMenuItem>
        </button>
      </div>
    </OutsideClickHandler>
  );
};

export default HeaderUserMenu;
