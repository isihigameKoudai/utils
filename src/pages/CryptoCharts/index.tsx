import React, { useState } from 'react';

import { CryptoTheme } from './theme';
import { styled } from '@/packages/ui/styled';
import { ChartBox } from '../../components/ChartBox';

import { SYMBOLS, TIMEFRAMES } from './constants';

const StyledContainer = styled('div')((theme) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

const ChartContainer = styled('div')(() => ({
  display: 'flex',
  flexWrap: 'wrap',
}));

const CryptoCharts = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1d' | '1M'>('1d');
  const [selectedSymbol, setSelectedSymbol] = useState<string>(SYMBOLS[0]);

  return (
    <StyledContainer>
      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        >
          {SYMBOLS.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>

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
      <ChartContainer>
        {
          SYMBOLS.map((symbol) => (
            <ChartBox key={symbol} symbol={symbol} timeframe={selectedTimeframe} />
          ))
        }
      </ChartContainer>
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
