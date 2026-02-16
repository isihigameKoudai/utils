import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';

import type { QueriesProps } from '@/utils/i-state';

import { MULTI_TIMEFRAMES, type MultiTimeframe } from '../../constants';

import type { TokenDetailState } from './type';

export const queries = {
  token: (state) => state.token,

  chartDataFor: (state) => {
    return (
      timeframe: MultiTimeframe,
    ): CandlestickData<UTCTimestamp>[] | undefined =>
      state.chartData[timeframe];
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
    MULTI_TIMEFRAMES.map((timeframe) => ({
      timeframe,
      data: state.chartData[timeframe],
      isLoading: state.loading[timeframe] ?? false,
      error: state.errors[timeframe],
    })),
} satisfies QueriesProps<TokenDetailState>;
