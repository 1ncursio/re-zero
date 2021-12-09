import React, { VFC } from 'react';
import { undrawLogin } from '../../assets/images';

const RequireLogIn: VFC = () => {
  return (
    <div className="flex flex-col items-center gap-4 mt-24 md:mt-16">
      <img src={undrawLogin} alt="" className="w-[36rem] md:w-96" />
      <p className="text-blueGray-600 text-lg md:text-base">
        로그인 후 이용해주세요.
      </p>
    </div>
  );
};

export default RequireLogIn;
