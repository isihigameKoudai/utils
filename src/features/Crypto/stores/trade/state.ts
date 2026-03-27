import type { TradeState } from './type';

export const initialState: TradeState = {
  selectedSymbols: ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA'],
  selectedTimeframe: '1d',
  chartData: {},
  loading: {},
  errors: {},
};
