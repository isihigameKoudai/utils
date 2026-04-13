import { MULTI_TIMEFRAMES, type Symbol } from '../constants';

import { fetchTradeDataList } from './crypto';

export const tokenDetailApi = {
  fetchAllTimeframes: (token: Symbol) => {
    return MULTI_TIMEFRAMES.map(async (timeframe) => {
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
