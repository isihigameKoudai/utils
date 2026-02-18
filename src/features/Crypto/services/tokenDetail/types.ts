import type { MultiTimeframe, Symbol } from '../../constants';
import type { Trade } from '../../shared/CryptoChart/model/CandleStick';
import type { TokenDetailStore } from '../../stores/tokenDetail';

export type TokenDetailApiResult = {
  timeframe: MultiTimeframe;
  data: Trade[];
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
