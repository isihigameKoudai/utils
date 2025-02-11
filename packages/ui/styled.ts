import React, { forwardRef, ComponentPropsWithRef, createElement, DetailedHTMLProps } from 'react';
import { style as _style } from 'typestyle';

type StyledOptions = {
  className?: string;
};

/**
 * @todo themeが設定されていないくても使えるようにする
 */
export function styled<T extends keyof JSX.IntrinsicElements>(Component: T) {
  return (style: React.CSSProperties) => {
    type Props = ComponentPropsWithRef<T> & StyledOptions;
    
    return forwardRef<JSX.IntrinsicElements[T] extends DetailedHTMLProps<any, infer E> ? E : never, Props>(
      (props, ref) => {
        const { className: parentClassName, ...rest } = props;

        const localClassName = _style(style);
        const className = parentClassName
          ? `${localClassName} ${parentClassName}`
          : localClassName;

        return createElement(Component, {
          ...rest,
          ref,
          className
        });
      }
    );
  };
}
