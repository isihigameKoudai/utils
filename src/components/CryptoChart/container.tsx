import React, { useEffect } from 'react';

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
  width = 600,
  height = 400,
}) => {
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
    />
  );
};
