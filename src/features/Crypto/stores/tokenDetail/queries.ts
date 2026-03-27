import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';

import type { QueriesProps } from '@/utils/i-state';

import { MULTI_TIMEFRAMES, type MultiTimeframe } from '../../constants';
import type { Trade } from '../../shared/CryptoChart/model/CandleStick';

import type { TokenDetailState } from './type';

/** @description Trade[] → CandlestickData[] に変換 */
const toCandlestickData = (
  trades: Trade[],
): CandlestickData<UTCTimestamp>[] => {
  return trades.map((trade) => ({
    time: (trade[0] / 1000) as UTCTimestamp,
    open: Number(trade[1]),
    high: Number(trade[2]),
    low: Number(trade[3]),
    close: Number(trade[4]),
  }));
};

export const queries = {
  token: (state) => state.token,

  chartDataFor: (state) => {
    return (
      timeframe: MultiTimeframe,
    ): CandlestickData<UTCTimestamp>[] | undefined => {
      const trades = state.chartData[timeframe];
      return trades ? toCandlestickData(trades) : undefined;
    };
  },

  isLoadingFor: (state) => {
    return (timeframe: MultiTimeframe): boolean =>
      state.loading[timeframe] ?? false;
  },

  errorFor: (state) => {
    return (timeframe: MultiTimeframe): string | undefined =>
      state.errors[timeframe];
  },

  chartPanels: (state) =>
    MULTI_TIMEFRAMES.map((timeframe) => {
      const trades = state.chartData[timeframe];
      return {
        timeframe,
        data: trades ? toCandlestickData(trades) : undefined,
        isLoading: state.loading[timeframe] ?? false,
        error: state.errors[timeframe],
      };
    }),
} satisfies QueriesProps<TokenDetailState>;
