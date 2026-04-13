import {
  MULTI_TIMEFRAMES,
  type MultiTimeframe,
  type Symbol,
} from '../constants';

import { fetchTradeDataList } from './crypto';

export const tokenDetailApi = {
  fetchAllTimeframes: (
    token: Symbol,
    timeframes: readonly MultiTimeframe[] = MULTI_TIMEFRAMES,
  ) => {
    return timeframes.map(async (timeframe) => {
      const trades = await fetchTradeDataList({
        symbol: token,
        interval: timeframe,
      });

      return {
        timeframe,
        data: trades,
      };
    });
  },
} as const;

export type TokenDetailApi = typeof tokenDetailApi;
