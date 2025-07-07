import React from 'react';
import { styled } from '@/utils/ui/styled';
import { ChartBox } from '@/src/components/ChartBox';
import { SYMBOLS, Timeframe } from '../constants';

const StyledChartGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(300px, 1fr))',
  gap: '16px',
});

interface ChartGridProps {
  timeframe: Timeframe;
}

export const ChartGrid: React.FC<ChartGridProps> = ({ timeframe }) => {
  return (
    <StyledChartGrid>
      {SYMBOLS.map((symbol) => (
        <ChartBox key={symbol} symbol={symbol} timeframe={timeframe} />
      ))}
    </StyledChartGrid>
  );
}; 
