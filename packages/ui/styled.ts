import React, { forwardRef, ComponentPropsWithRef } from 'react';
import { style } from '@vanilla-extract/css';
import { useTheme } from './theme';
import type { Theme } from './theme';

type StyledOptions = {
  className?: string;
};

export function styled<T extends keyof JSX.IntrinsicElements>(Component: T) {
  return (themeFunction: (theme: Theme) => React.CSSProperties) => {
    type Props = ComponentPropsWithRef<T> & StyledOptions;
    
    return forwardRef<JSX.IntrinsicElements[T] extends React.DetailedHTMLProps<any, infer E> ? E : never, Props>(
      (props, ref) => {
        const { theme } = useTheme();
        const { className: inputClassName, ...rest } = props;
        
        const generatedClassName = style(themeFunction(theme));
        
        const className = inputClassName
          ? `${generatedClassName} ${inputClassName}`
          : generatedClassName;

        return React.createElement(Component, {
          ...rest,
          ref,
          className
        });
      }
    );
  };
}
