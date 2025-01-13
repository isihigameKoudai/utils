import React, { useEffect, useRef, useState, ComponentProps } from 'react';

import { styled } from '@/packages/ui/styled';
import { CryptoChart } from '../CryptoChart';

const ChartWrapper = styled('div')((theme) => ({
  boxSizing: 'border-box',
  width: 400,
  height: 500,
  padding: theme.spacing(1),
}));

const StyledTitle = styled('h2')((theme) => ({
  ...theme.typography.h2,
  color: theme.palette.text.primary,
  margin: 0,
}));


export const ChartBox = ({ symbol, timeframe }: { symbol: string; timeframe: ComponentProps<typeof CryptoChart>['timeframe'] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [size, setSize] = useState<{ width: number; height: number; }>({ width: 500, height: 500 });
  
  useEffect(() => {
    if (ref.current && titleRef.current) {
      setSize({
        width: ref.current.clientWidth - 16,
        height: ref.current.clientHeight - titleRef.current.clientHeight - 16,
      });
    }
  }, [symbol, timeframe]);

  return (
    <ChartWrapper ref={ref}>
      <StyledTitle ref={titleRef}>{symbol}</StyledTitle>
      <CryptoChart
        symbol={symbol}
        timeframe={timeframe}
        width={size.width}
        height={size.height}
      />
    </ChartWrapper>
  );
};
