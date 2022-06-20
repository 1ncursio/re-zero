import React from 'react';
import useBoolean from '@hooks/useBoolean';
import Link from 'next/link';
import Button from '@components/Button';
// import StyledModal from '@components/StyledModal';

const OthelloMain = () => {
  const [isOpen, openModal, closeModal] = useBoolean(false);

  return (
    <>
      <div className="lg:w-[calc(768px-2rem)] w-md mx-auto md:w-full md:px-4">
        <div className="mt-10 text-center">
          <h1 className="text-4xl font-bold text-blueGray-600 mb-4">리버시 게임</h1>
          <p className="text-lg text-blueGray-500">실시간으로 리버시 게임을 즐겨보세요!</p>
        </div>
        <div className="my-28 flex gap-16 justify-center text-lg">
          <Link href="/reversi/alphazero">
            <a>
              <div className="flex flex-col justify-center items-center gap-2">
                <Button icon="ai" onClick={() => {}} className="w-32 h-32" iconClassName="w-2/3 h-2/3" />
                <span>AI 대전</span>
              </div>
            </a>
          </Link>

          {/* <Link to="/reversi/pvp"> */}
          <button type="button" onClick={openModal} className="opacity-30 cursor-not-allowed">
            <div className="flex flex-col justify-center items-center gap-2">
              <Button
                icon="pvp"
                onClick={() => {}}
                className="w-32 h-32 cursor-not-allowed"
                iconClassName="w-full h-full"
              />
              <span>PVP</span>
            </div>
          </button>
        </div>
      </div>
      {/* <StyledModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        onRequestOk={closeModal}
        title="준비 중"
        showOkButton
        okText="닫기"
        width="480px"
      >
        준비 중입니다.
      </StyledModal> */}
    </>
  );
};

export default OthelloMain;
