import { defineStore, type Context, type QueriesProps } from '@/utils/i-state';

import { fetchTradeDataList, type CryptoListParams } from '../api/crypto';
import type { Trade } from '../model/CandleStick';
import { CandleStick } from '../model/CandleStick';

interface CryptoState {
  trades: Trade[];
}

const initialState: CryptoState = {
  trades: [],
};

export const CryptoStore = defineStore({
  state: initialState,
  queries: {
    candleSticks: (state: CryptoState): CandleStick[] =>
      state.trades.map((trade: Trade) => new CandleStick(trade)),
  } as QueriesProps<CryptoState>,
  actions: {
    async fetchTrades(
      { dispatch }: Context<CryptoState, QueriesProps<CryptoState>>,
      payload: CryptoListParams,
    ) {
      try {
        const trades = await fetchTradeDataList(payload);
        dispatch('trades', trades);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
