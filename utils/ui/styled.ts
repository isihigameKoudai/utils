import { forwardRef, ComponentPropsWithRef, createElement, DetailedHTMLProps, ElementType, Ref, RefObject } from 'react';
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
 *   fontSize: '16px'
 * })
 */
export function styled<T extends ElementType>(Component: T) {
  return (style: types.NestedCSSProperties) => {
    type Props = ComponentPropsWithRef<T> & StyledOptions;
    type ElementRef = T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : never;
    
    return forwardRef<ElementRef, Props>(
      (props, ref) => {
        const { className: parentClassName, ...rest } = props;
        const classNames = [_style(style), parentClassName].filter(Boolean).join(' ');

        return createElement(Component, {
          ...rest,
          ref,
          className: classNames,
        });
      }
    );
  };
}
