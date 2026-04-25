import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';

import type { QueriesProps } from '@/utils/i-state';

import { TIMEFRAME, type MultiTimeframe } from '../../constants';
import { toCandlestickData } from '../../shared/CryptoChart/model/CandleStick';

import type { TokenDetailState } from './type';

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
    Object.values(TIMEFRAME).map(({ value: timeframe, label }) => {
      const trades = state.chartData[timeframe];
      return {
        timeframe,
        label,
        data: trades ? toCandlestickData(trades) : undefined,
        isLoading: state.loading[timeframe] ?? false,
        error: state.errors[timeframe],
      };
    }),
} satisfies QueriesProps<TokenDetailState>;
