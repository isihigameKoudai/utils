/**
 * npm i react typestyle
 * npm i -D @types/react
 * 
 */

import React, { createElement, forwardRef } from 'react';
import { style as _style } from 'typestyle';

import isEmpty from '../is-empty';

// HTMLタグ名から各HTMLElementの型を取得
// type HTMLElementMap<E extends React.ElementType> = E extends keyof HTMLElementTagNameMap
//   ? HTMLElementTagNameMap[E]
//   : HTMLElement;

type OwnProps<E extends React.ElementType> = {
  as?: E;
};

export type BoxProps<E extends React.ElementType>
  = OwnProps<E> 
  & Omit<React.ComponentProps<E>, keyof OwnProps<E>>
  & React.CSSProperties;

const Box = forwardRef(<E extends React.ElementType = 'div'>(
  {
    as,
    children,
    className: _className,
    ...styleProps
  }: BoxProps<E>,
  ref: React.Ref<Element>
) => {
  const Tag = as || 'div';
  const style = !isEmpty(styleProps) ? _style(styleProps as React.CSSProperties) : '';
  const className = _className ? ` ${_className}` : '';
  
  return createElement(
    Tag,
    {
      ref,
      className: `${style}${className}`
    },
    children
  );
});

Box.displayName = 'Box';

export default Box;
