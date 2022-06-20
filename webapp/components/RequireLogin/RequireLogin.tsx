import Image from 'next/image';
import React, { FC } from 'react';
// import { undrawLogin } from '../../assets/images';

const RequireLogIn: FC = () => {
  return (
    <div className="flex flex-col items-center gap-4 mt-24 md:mt-16">
      {/* <img src={undrawLogin} alt="" className="w-[36rem] md:w-96" /> */}
      <Image src="/assets/images/undraw_login.svg" width="100%" height="100%" alt="require-login" />
      <p className="text-blueGray-600 text-lg md:text-base">로그인 후 이용해주세요.</p>
    </div>
  );
};

export default RequireLogIn;
