import React, { useEffect, useRef, useState, ComponentProps } from 'react';

import { styled } from '@/packages/ui/styled';
import { CryptoChart } from '../CryptoChart';

const ChartWrapper = styled('div')((theme) => ({
  boxSizing: 'border-box',
  height: 500,
  padding: theme.spacing(1),
  paddingBlockStart: theme.spacing(2),
}));

const StyledTitle = styled('h2')((theme) => ({
  ...theme.typography.h3,
  color: theme.palette.text.primary,
  margin: 0,
}));

interface Props {
  symbol: string;
  timeframe: ComponentProps<typeof CryptoChart>['timeframe'];
}

export const ChartBox: React.FC<Props> = ({ symbol, timeframe }) => {
  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [size, setSize] = useState<{ width: number; height: number; }>({ width: 500, height: 500 });
  
  useEffect(() => {
    if (ref.current && titleRef.current) {
      setSize({
        width: ref.current.clientWidth - 16,
        height: ref.current.clientHeight - titleRef.current.clientHeight - 24,
      });
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        console.log(symbol, width, height);
        setSize((prev) => ({
          ...prev,
          width,
        }));
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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
