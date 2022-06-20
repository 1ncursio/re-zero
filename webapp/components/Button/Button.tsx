import React from 'react';
// import Icon, { IconType } from '../Icon/Icon';

export type ButtonProps = {
  icon: string;
  text?: string;
  onClick(): void;
  className?: string;
  iconClassName?: string;
};

const Button = ({ icon, text, onClick, className = '', iconClassName = '' }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`rounded-full border-2 border-gray-200 shadow-md ${className} flex justify-center items-center`}
    >
      {/* {icon && <Icon name={icon} className={iconClassName} />} */}
      {text}
    </button>
  );
};

export default Button;
