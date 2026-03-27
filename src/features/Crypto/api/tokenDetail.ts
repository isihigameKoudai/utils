import {
  MULTI_TIMEFRAMES,
  type MultiTimeframe,
  type Symbol,
} from '../constants';
import type { TokenDetailApi } from '../services/tokenDetail/types';

import { fetchTradeDataList } from './crypto';

/** @description TokenDetail APIクライアント（TokenDetailApiを実装） */
export const tokenDetailApi: TokenDetailApi = {
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
};
