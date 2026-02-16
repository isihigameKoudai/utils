import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';

import type { MultiTimeframe, Symbol } from '../../constants';

export type TokenDetailChartData = Partial<
  Record<MultiTimeframe, CandlestickData<UTCTimestamp>[]>
>;

export type TokenDetailLoadingState = Partial<Record<MultiTimeframe, boolean>>;

export type TokenDetailErrorState = Partial<Record<MultiTimeframe, string>>;

export type TokenDetailState = {
  token: Symbol | null;
  chartData: TokenDetailChartData;
  loading: TokenDetailLoadingState;
  errors: TokenDetailErrorState;
};
