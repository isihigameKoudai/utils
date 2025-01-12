import { forwardRef, ComponentPropsWithRef, createElement, DetailedHTMLProps } from 'react';
import { style as _style } from 'typestyle';

import { Theme, useTheme } from './theme';

type StyledOptions = {
  className?: string;
};

export function styled<T extends keyof JSX.IntrinsicElements>(Component: T) {
  return (themeFunction: (theme: Theme) => React.CSSProperties) => {
    type Props = ComponentPropsWithRef<T> & StyledOptions;
    
    return forwardRef<JSX.IntrinsicElements[T] extends DetailedHTMLProps<any, infer E> ? E : never, Props>(
      (props, ref) => {
        const { theme } = useTheme();
        const { className: parentClassName, ...rest } = props;
        const localClassName = _style(themeFunction(theme));
        
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
