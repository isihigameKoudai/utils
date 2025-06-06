import React, { useEffect, useRef, useState, ComponentProps } from 'react';

import { styled } from '@/utils/ui/styled';
import { CryptoChart } from '../CryptoChart';

const ChartWrapper = styled('div')({
  boxSizing: 'border-box',
  height: 500,
  padding: 8,
  paddingBlockStart: 16,
});

const StyledTitle = styled('h2')({
  margin: 0,
});

interface Props {
  symbol: string;
  timeframe: ComponentProps<typeof CryptoChart>['timeframe'];
}

export const ChartBox: React.FC<Props> = ({ symbol, timeframe }) => {
  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [size, setSize] = useState<{ width: number; height: number; }>({ width: 500, height: 500 });
  
  useEffect(() => {
    if(!ref.current || !titleRef.current) {
      return () => {};
    }
    
    setSize(() => ({
      width: ref.current!.clientWidth - 16,
      height: ref.current!.clientHeight - titleRef.current!.clientHeight - 24,
    }));
  }, [symbol, timeframe]);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current && titleRef.current) {
        setSize(() => ({
          width: ref.current!.clientWidth - 16,
          height: ref.current!.clientHeight - titleRef.current!.clientHeight - 24,
        }));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ChartWrapper ref={ref}>
      <StyledTitle ref={titleRef}>{symbol}</StyledTitle>
      <CryptoChart
        symbol={symbol}
        timeframe={timeframe}
        height={size.height}
      />
    </ChartWrapper>
  );
};
