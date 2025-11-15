import React from 'react';
import { styled } from '@/utils/ui/styled';
import { CryptoChart } from '@/src/components/CryptoChart';
import { MULTI_TIMEFRAMES, type Symbol } from '../constants';
import { getTimeframeLabel } from '../modules/utils';

const StyledChartGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '20px',
});

const ChartContainer = styled('div')({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '8px',
  padding: '16px',
  height: '360px',
});

const ChartTitle = styled('h3')({
  margin: '0 0 16px 0',
  textAlign: 'center',
  color: '#ccc',
});

interface MultiChartGridProps {
  token: Symbol;
}

export const MultiChartGrid: React.FC<MultiChartGridProps> = ({ token }) => {
  return (
    <StyledChartGrid>
      {MULTI_TIMEFRAMES.map((timeframe) => (
        <ChartContainer key={timeframe}>
          <ChartTitle>{getTimeframeLabel(timeframe)}</ChartTitle>
          <CryptoChart
            key={`${token}-${timeframe}`}
            symbol={token}
            timeframe={timeframe}
            height={300}
          />
        </ChartContainer>
      ))}
    </StyledChartGrid>
  );
};
