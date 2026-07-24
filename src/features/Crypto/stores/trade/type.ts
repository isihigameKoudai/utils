import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';

import type { MultiTimeframe, TokenSymbol } from '../../constants';

export type ChartDataKey = `${TokenSymbol}_${MultiTimeframe}`;

type ChartDataCache = Partial<
	Record<ChartDataKey, CandlestickData<UTCTimestamp>[]>
>;

export type LoadingState = Partial<Record<ChartDataKey, boolean>>;

type ErrorState = Partial<Record<ChartDataKey, string>>;

export type TradeState = {
	selectedSymbols: TokenSymbol[];
	selectedTimeframe: MultiTimeframe;
	chartData: ChartDataCache;
	loading: LoadingState;
	errors: ErrorState;
};
