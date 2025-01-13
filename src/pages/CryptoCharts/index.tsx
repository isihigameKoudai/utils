import React, { useState } from 'react';

import { styled } from '@/packages/ui/styled';
import { ChartBox } from '../../components/ChartBox';
import { CryptoTheme } from './theme';
import { SYMBOLS, TIMEFRAMES } from './constants';

const StyledContainer = styled('div')((theme) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#222',
  padding: theme.spacing(2),
}));

const ChartGridContainer = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(300px, 1fr))',
}));

const CryptoCharts = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1d' | '1M'>('1d');

  return (
    <StyledContainer>
      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value as '1d' | '1M')}
          style={{ padding: '5px' }}
        >
          {TIMEFRAMES.map((timeframe) => (
            <option key={timeframe} value={timeframe}>
              {timeframe === '1d' ? '日足' : '月足'}
            </option>
          ))}
        </select>
      </div>
      <ChartGridContainer>
        {
          SYMBOLS.map((symbol) => (
            <ChartBox key={symbol} symbol={symbol} timeframe={selectedTimeframe} />
          ))
        }
      </ChartGridContainer>
    </StyledContainer>
  );
};

export default () => {
  return (
    <CryptoTheme.Provider>
      <CryptoCharts />
    </CryptoTheme.Provider>
  );
};
