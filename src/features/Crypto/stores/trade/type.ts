import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';

import type { MultiTimeframe, Symbol } from '../../constants';

export type ChartDataKey = `${Symbol}_${MultiTimeframe}`;

export type ChartDataCache = Partial<
  Record<ChartDataKey, CandlestickData<UTCTimestamp>[]>
>;

export type LoadingState = Partial<Record<ChartDataKey, boolean>>;

export type ErrorState = Partial<Record<ChartDataKey, string>>;

export type TradeState = {
  selectedSymbols: Symbol[];
  selectedTimeframe: MultiTimeframe;
  chartData: ChartDataCache;
  loading: LoadingState;
  errors: ErrorState;
};
