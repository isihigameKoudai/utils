/**
 * npm i react typestyle
 * npm i -D @types/react
 * 
 */

import React from 'react';
import { style as _style } from 'typestyle';

import isEmpty from '../is-empty';

type OwnProps<E extends React.ElementType> = {
  as?: E;
};

export type BoxProps<E extends React.ElementType> = OwnProps<E> &
  Omit<React.ComponentProps<E>, keyof OwnProps<E>> &
  React.CSSProperties;

const Box = <E extends React.ElementType = 'div'>({
  as,
  children,
  className: _className,
  ...styleProps
}: BoxProps<E>) => {
  const Tag = as || 'div';
  const style = !isEmpty(styleProps) ? _style(styleProps as React.CSSProperties) : '';
  const className = _className ? ` ${_className}` : '';
  
  return (
    <Tag className={`${style}${className}`}>
      {children}
    </Tag>
  );
};

export default Box;
