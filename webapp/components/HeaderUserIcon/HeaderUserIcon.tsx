import Image from 'next/image';
import React, { FC } from 'react';
import useUserSWR from '../../hooks/swr/useUserSWR';
// import { userThumbnail } from '../../public/assets/images';
import optimizeImage from '../../lib/optimizeImage';

type HeaderUserIconProps = {
  onClick: (e: React.MouseEvent) => void;
};

const HeaderUserIcon: FC<HeaderUserIconProps> = ({ onClick }) => {
  const { data: userData } = useUserSWR();

  return (
    <button onClick={onClick} className="cursor-pointer rounded-full" type="button">
      {/* <img
        src={optimizeImage(userData?.image_url ?? userThumbnail)}
        alt="profile"
        className="rounded-full w-10 h-10 object-cover"
      /> */}
      <Image
        src={optimizeImage(userData?.image_url ?? '/assets/images/user-thumbnail.png')}
        alt="profile"
        className="rounded-full w-10 h-10"
        objectFit="cover"
      />
    </button>
  );
};

export default HeaderUserIcon;
