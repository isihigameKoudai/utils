import React from 'react';

type OwnProps<E extends React.ElementType> = {
  as?: E;
};

export type BoxProps<E extends React.ElementType> = OwnProps<E> &
  Omit<React.ComponentProps<E>, keyof OwnProps<E>> &
  React.CSSProperties;

const Box = <E extends React.ElementType = 'div'>({
  as,
  children,
  className,
  ...styleProps
}: BoxProps<E>) => {
  const Tag = as || 'div';

  return (
    <Tag className={className} style={styleProps}>
      {children}
    </Tag>
  );
};

export default Box;
