import { TradeStore } from '../stores/trade';

export const useTrade = () => {
  const { queries, actions } = TradeStore.useStore();

  return { queries, actions };
};
