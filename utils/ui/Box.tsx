/**
 * npm i react typestyle
 * npm i -D @types/react
 *
 */

import React, { createElement, forwardRef } from 'react';
import { style as _style, types } from 'typestyle';

import { isEmpty } from '../is';

// HTMLタグ名から各HTMLElementの型を取得
// type HTMLElementMap<E extends React.ElementType> = E extends keyof HTMLElementTagNameMap
//   ? HTMLElementTagNameMap[E]
//   : HTMLElement;

type OwnProps<E extends React.ElementType> = {
  as?: E;
};

export type BoxProps<E extends React.ElementType> = OwnProps<E> &
  Omit<React.ComponentProps<E>, keyof OwnProps<E>> &
  types.NestedCSSProperties;

const Box = forwardRef(
  <E extends React.ElementType = 'div'>(
    { as, children, className: _className, ...styleProps }: BoxProps<E>,
    ref: React.Ref<Element>,
  ) => {
    const Tag = as || 'div';
    const classNames = [_style(styleProps), _className]
      .filter(Boolean)
      .join(' ');

    return createElement(
      Tag,
      {
        ref,
        className: classNames,
      },
      children,
    );
  },
);

Box.displayName = 'Box';

export default Box;
