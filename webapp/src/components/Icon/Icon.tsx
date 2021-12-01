import React from 'react';
import * as svg from './svg';

export type IconType = keyof typeof svg;
export type IconProps = {
  name: IconType;
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
  stroke?: string;
};

const Icon = ({ name, className, style, fill, stroke }: IconProps) => {
  return React.createElement(svg[name], {
    className,
    style,
    fill,
    stroke,
  });
};

export default Icon;
