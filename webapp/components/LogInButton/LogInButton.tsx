import useBoolean from '@hooks/useBoolean';
import Image from 'next/image';

import { AiFillGoogleCircle } from 'react-icons/ai';
import StyledModal from '../StyledModal';

const LogInButton = () => {
  const [isOpen, openModal, closeModal] = useBoolean(false);

  return (
    <>
      <button onClick={openModal} className="font-medium text-blueGray-500" type="button">
        로그인
      </button>
      <StyledModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        onRequestOk={closeModal}
        width="480px"
        height="360px"
      >
        <div className="relative">
          <div className="absolute top-16 left-0 w-full z-0 md:hidden opacity-80">
            <Image src="/assets/images/undraw_welcome.svg" width="100%" height="100%" alt="login" />
          </div>
          <div className="flex-[3] flex flex-col gap-4 items-center relative z-10">
            <h2 className="text-xl text-gray-600 font-medium">간편 로그인</h2>
            <div className="w-1/2 flex justify-around items-center">
              <a
                href={process.env.NEXT_PUBLIC_AUTH_URL}
                className="rounded-full border-2 border-blueGray-200 flex justify-center items-center"
              >
                {/* <Icon name="google" className="w-12 h-12" /> */}
                <AiFillGoogleCircle />
              </a>
            </div>
          </div>
        </div>
      </StyledModal>
    </>
  );
};

export default LogInButton;
