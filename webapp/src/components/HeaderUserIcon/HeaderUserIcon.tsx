import React, { FC } from 'react';
import { userThumbnail } from '../../assets/images';
import useUserSWR from '../../hooks/swr/useUserSWR';
import optimizeImage from '../../lib/optimizeImage';

type HeaderUserIconProps = {
  onClick: (e: React.MouseEvent) => void;
};

const HeaderUserIcon: FC<HeaderUserIconProps> = ({ onClick }) => {
  const { data: userData } = useUserSWR();

  return (
    <button
      onClick={onClick}
      className="cursor-pointer rounded-full shadow"
      type="button"
    >
      <img
        src={optimizeImage(userData?.image_url ?? userThumbnail)}
        alt="profile"
        className="rounded-full w-10 h-10 object-cover"
      />
    </button>
  );
};

export default HeaderUserIcon;
