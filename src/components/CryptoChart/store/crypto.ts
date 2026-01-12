import { defineStore } from '../../../../utils/i-state';
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
    candleSticks: (state) =>
      state.trades.map((trade) => new CandleStick(trade)),
  },
  actions: {
    async fetchTrades({ dispatch }, payload: CryptoListParams) {
      try {
        const trades = await fetchTradeDataList(payload);
        dispatch('trades', trades);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
