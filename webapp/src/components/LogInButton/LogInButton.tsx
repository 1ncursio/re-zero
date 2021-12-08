import React, { useCallback } from 'react';
import { undrawWelcome } from '../../assets/images';
import useBoolean from '../../hooks/useBoolean';
import IconButton from '../Button';
import Icon from '../Icon';
import StyledModal from '../StyledModal';

const LogInButton = () => {
  const [isOpen, openModal, closeModal] = useBoolean(false);
  const { REACT_APP_AUTH_URL } = process.env;

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
            <img src={undrawWelcome} alt="login" />
          </div>
          <div className="flex-[3] flex flex-col gap-4 items-center relative z-10">
            <h2 className="text-xl text-gray-600 font-medium">간편 로그인</h2>
            <div className="w-1/2 flex justify-around items-center">
              <a
                href={REACT_APP_AUTH_URL}
                className="rounded-full border-2 border-blueGray-200 flex justify-center items-center"
              >
                <Icon name="google" className="w-12 h-12" />
              </a>
            </div>
          </div>
        </div>
      </StyledModal>
    </>
  );
};

export default LogInButton;
