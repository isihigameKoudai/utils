/**
 * npm i react typestyle
 * npm i -D @types/react
 */

import { forwardRef, createElement, ElementType, ComponentRef } from 'react';
import { style as _style, types } from 'typestyle';

type StyledOptions = {
  className?: string;
};


/**
 * スタイル付きコンポーネントを作成するユーティリティ関数
 * @param {T} Component - スタイリング対象のHTML要素またはコンポーネント
 * @returns {Object} スタイル
 * @example
 * const StyledDiv = styled('div')({
 *   color: 'red',
 *   fontSize: '16px',
 *   $nest: {
 *     '&:hover': {
 *       color: 'blue',
 *     }
 *   }
 * })
 */
export function styled<T extends ElementType>(Component: T) {
  return (styleProps: types.NestedCSSProperties) => {
    const css = _style(styleProps);
    
    return forwardRef<ComponentRef<T>, StyledOptions>(
      (props, ref) => {
        const { className: parentClassName, ...rest } = props;
        const classNames = [css, parentClassName].filter(Boolean).join(' ');

        return createElement(Component, {
          ...rest,
          ref,
          className: classNames,
        });
      }
    );
  };
}
