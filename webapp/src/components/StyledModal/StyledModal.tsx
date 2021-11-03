import { css, Global } from '@emotion/react';
import React, { FC } from 'react';
import Modal from 'react-modal';
import tw from 'twin.macro';

Modal.setAppElement('#root');

export type StyledModalProps = {
  children: React.ReactNode;
  title?: string;
  isOpen: boolean;
  showOkButton?: boolean;
  showCloseButton?: boolean;
  okText?: string;
  closeText?: string;
  width?: string;
  height?: string;
  onRequestClose: () => void;
  onRequestOk: () => void;
};

const StyledModal: FC<StyledModalProps> = ({
  children,
  title,
  isOpen,
  showOkButton = false,
  showCloseButton = false,
  okText = '확인',
  closeText = '취소',
  width,
  height,
  onRequestClose,
  onRequestOk,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        overlayClassName={{
          afterOpen: 'overlay-after',
          base: 'overlay-base',
          beforeClose: 'overlay-before',
        }}
        className={{
          afterOpen: 'content-after',
          base: 'content-base',
          beforeClose: 'content-before',
        }}
        contentLabel="Modal"
      >
        <div>
          {title && <h3 className="text-2xl font-bold">{title}</h3>}
          <div className="py-4">{children}</div>
        </div>
        {(showOkButton || showCloseButton) && (
          <div className="flex justify-end gap-2">
            {showCloseButton && (
              <button
                type="button"
                onClick={onRequestClose}
                className="btn-white bg-gray-200 hover:bg-gray-100 text-gray-600"
              >
                {closeText}
              </button>
            )}
            {showOkButton && (
              <button
                type="button"
                onClick={onRequestOk}
                className="btn-cyan bg-emerald-500 hover:bg-emerald-400"
              >
                {okText}
              </button>
            )}
          </div>
        )}
      </Modal>
      <Global styles={modalStyle({ width, height })} />
    </>
  );
};

const modalStyle = ({
  width,
  height,
}: {
  width?: string;
  height?: string;
}) => css`
  .overlay-base {
    ${tw`fixed inset-0 transition duration-300 flex justify-center items-center backdrop-filter backdrop-blur-sm`}
  }

  .overlay-after {
    ${tw`bg-gray-700 bg-opacity-60 transform`}
  }

  .overlay-before {
  }

  .content-base {
    ${tw`flex flex-col justify-between md:w-[calc(100% - 2rem)] rounded-lg p-6 shadow transition ease-out-back duration-300 transform translate-y-full scale-50`}
    ${width &&
    css`
      width: ${width};
    `}
    ${height &&
    css`
      height: ${height};
    `}
  }

  .content-after {
    ${tw`bg-white  min-width[24rem] min-height[12rem] transform translate-y-0 scale-100`}
  }

  .content-before {
  }
`;

export default StyledModal;
