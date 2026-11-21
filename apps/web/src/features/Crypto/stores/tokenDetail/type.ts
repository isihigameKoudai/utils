import type { MultiTimeframe, TokenSymbol } from '../../constants';
import type { Trade } from '../../shared/CryptoChart/model/CandleStick';

export type TokenDetailChartData = Partial<Record<MultiTimeframe, Trade[]>>;

export type TokenDetailLoadingState = Partial<Record<MultiTimeframe, boolean>>;

export type TokenDetailErrorState = Partial<Record<MultiTimeframe, string>>;

export type TokenDetailState = {
	token: TokenSymbol | null;
	chartData: TokenDetailChartData;
	loading: TokenDetailLoadingState;
	errors: TokenDetailErrorState;
};
