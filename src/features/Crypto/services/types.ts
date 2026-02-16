import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';

import type { MultiTimeframe, Symbol } from '../constants';
import type { TokenDetailStore } from '../stores/tokenDetail';

export type TokenDetailApiResult = {
  timeframe: MultiTimeframe;
  data: CandlestickData<UTCTimestamp>[];
};

export type TokenDetailApi = {
  fetchAllTimeframes: (
    token: Symbol,
    timeframes: readonly MultiTimeframe[],
  ) => Promise<TokenDetailApiResult>[];
};

export type TokenDetailActions = ReturnType<
  typeof TokenDetailStore.useStore
>['actions'];

export type TokenDetailServiceDeps = {
  api: TokenDetailApi;
  actions: TokenDetailActions;
};
