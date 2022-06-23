import useUserSWR from '@hooks/swr/useUserSWR';
import optimizeImage from '@lib/optimizeImage';
import Image from 'next/image';
import { FC } from 'react';

type HeaderUserIconProps = {
  onClick: (e: React.MouseEvent) => void;
};

const HeaderUserIcon: FC<HeaderUserIconProps> = ({ onClick }) => {
  const { data: userData } = useUserSWR();

  return (
    <button onClick={onClick} className="cursor-pointer rounded-full" type="button">
      <div className="w-10 h-10 relative">
        <Image
          src={optimizeImage(userData?.image_url ?? '/assets/images/user-thumbnail.png')}
          alt="profile"
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      </div>
    </button>
  );
};

export default HeaderUserIcon;
