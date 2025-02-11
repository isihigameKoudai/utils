import React, { useEffect } from 'react';

import { useTheme } from '@/packages/ui/theme';

import CryptoChartPresentational from './presentational';
import { CryptoStore } from './store/crypto';
import { CryptoListParams } from './api/crypto';

interface CryptoChartContainerProps {
  symbol: string;
  timeframe: CryptoListParams['interval'];
  width?: number;
  height?: number;
}

export const CryptoChart: React.FC<CryptoChartContainerProps> = ({
  symbol,
  timeframe,
  width,
  height,
}) => {
  const theme = useTheme();
  const { queries, actions } = CryptoStore.useStore();

  useEffect(() => {
    const fetchData = async () => {
      await actions.fetchTrades({
        symbol,
        interval: timeframe,
      });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [symbol, timeframe]);

  return (
    <CryptoChartPresentational
      candleData={queries.candleSticks}
      symbol={symbol}
      width={width}
      height={height}
      colorTheme={theme?.theme.palette.mode }
    />
  );
};
