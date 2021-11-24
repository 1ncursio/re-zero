import React, { useCallback } from 'react';
import useBoolean from '../../hooks/useBoolean';
import IconButton from '../Button';
import StyledModal from '../StyledModal';

const LogInButton = () => {
  const [isOpen, openModal, closeModal] = useBoolean(false);

  const auth = useCallback(
    (name: string) => () => {
      window.location.href = `http://localhost:8000/auth/redirect`;
    },
    [],
  );

  return (
    <>
      <button
        onClick={openModal}
        className="font-medium text-blueGray-500"
        type="button"
      >
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
            {/* <img src={undrawWelcome} alt="login" /> */}
          </div>
          <div className="flex-[3] flex flex-col gap-4 items-center relative z-10">
            <h2 className="text-xl text-gray-600 font-medium">간편 로그인</h2>
            <div className="w-1/2 flex justify-around items-center">
              <IconButton
                icon="google"
                onClick={auth('google')}
                className="bg-white"
              />
            </div>
          </div>
        </div>
      </StyledModal>
    </>
  );
};

export default LogInButton;
