import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';
import { useCallback, useMemo } from 'react';

import {
  MULTI_TIMEFRAMES,
  type MultiTimeframe,
  type Symbol,
} from '../constants';
import { createTokenDetailService } from '../services/tokenDetailService';
import type { TokenDetailApi } from '../services/types';
import { fetchTradeDataList } from '../shared/CryptoChart/api/crypto';
import type { Trade } from '../shared/CryptoChart/model/CandleStick';
import { TokenDetailStore } from '../stores/tokenDetail';

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

export const useTokenDetail = () => {
  const { queries, actions } = TokenDetailStore.useStore();

  const tokenDetailApi = useMemo<TokenDetailApi>(
    () => ({
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
            data: toCandlestickData(trades),
          };
        });
      },
    }),
    [],
  );

  const service = useMemo(
    () => createTokenDetailService({ api: tokenDetailApi, actions }),
    [actions, tokenDetailApi],
  );

  const initialize = useCallback(
    (token: Symbol) => {
      actions.initialize({ token });
    },
    [actions],
  );

  const fetchAllTimeframes = useCallback(
    (token: Symbol) => service.fetchAllTimeframes(token),
    [service],
  );

  return {
    queries,
    initialize,
    fetchAllTimeframes,
  };
};
