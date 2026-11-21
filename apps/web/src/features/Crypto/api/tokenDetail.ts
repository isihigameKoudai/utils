import { MULTI_TIMEFRAMES, type TokenSymbol } from '../constants';

import { fetchTradeDataList } from './crypto';

export const tokenDetailApi = {
	fetchAllTimeframes: (token: TokenSymbol) => {
		return MULTI_TIMEFRAMES.map(async (timeframe) => {
			const trades = await fetchTradeDataList({
				symbol: token,
				interval: timeframe,
			});

			return {
				timeframe,
				data: trades,
			};
		});
	},
} as const;

export type TokenDetailApi = typeof tokenDetailApi;
