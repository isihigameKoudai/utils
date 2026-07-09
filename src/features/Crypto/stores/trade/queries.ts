import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';

import type { QueriesProps } from '@/utils/i-state';

import type { MultiTimeframe, TokenSymbol } from '../../constants';

import type { ChartDataKey, TradeState } from './type';

export const toChartDataKey = (
	symbol: TokenSymbol,
	timeframe: MultiTimeframe,
): ChartDataKey => `${symbol}_${timeframe}`;

export const queries = {
	selectedSymbols: (state) => state.selectedSymbols,
	selectedTimeframe: (state) => state.selectedTimeframe,

	chartDataFor: (state) => {
		return (
			symbol: TokenSymbol,
			timeframe: MultiTimeframe,
		): CandlestickData<UTCTimestamp>[] | undefined => {
			const key = toChartDataKey(symbol, timeframe);
			return state.chartData[key];
		};
	},

	isLoadingFor: (state) => {
		return (symbol: TokenSymbol, timeframe: MultiTimeframe): boolean => {
			const key = toChartDataKey(symbol, timeframe);
			return state.loading[key] ?? false;
		};
	},

	errorFor: (state) => {
		return (
			symbol: TokenSymbol,
			timeframe: MultiTimeframe,
		): string | undefined => {
			const key = toChartDataKey(symbol, timeframe);
			return state.errors[key];
		};
	},

	isAnyLoading: (state) => Object.values(state.loading).some((v) => v === true),
} satisfies QueriesProps<TradeState>;
