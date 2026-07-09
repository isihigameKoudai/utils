import { MULTI_TIMEFRAMES, type TokenSymbol } from '../../constants';
import type {
	TokenDetailErrorState,
	TokenDetailLoadingState,
} from '../../stores/tokenDetail';

import type { TokenDetailServiceDeps } from './types';

const createLoadingState = (value: boolean): TokenDetailLoadingState => {
	return MULTI_TIMEFRAMES.reduce<TokenDetailLoadingState>((acc, timeframe) => {
		return {
			// biome-ignore lint/performance/noAccumulatingSpread: intentional
			...acc,
			[timeframe]: value,
		};
	}, {});
};

const createFallbackErrors = (message: string): TokenDetailErrorState => {
	return MULTI_TIMEFRAMES.reduce<TokenDetailErrorState>((acc, timeframe) => {
		return {
			...acc,
			[timeframe]: message,
		};
	}, {});
};

export const createTokenDetailService = ({
	api,
	actions,
}: TokenDetailServiceDeps) => {
	return {
		/**
		 * @description 全タイムフレームのデータを取得（try/catch + loading/error管理）
		 */
		async fetchAllTimeframes(token: TokenSymbol): Promise<void> {
			actions.setLoading(createLoadingState(true));
			actions.setErrors({});

			try {
				await actions.fetchAllTimeframes(api, token);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : 'データ取得に失敗しました';

				actions.setErrors(createFallbackErrors(message));
			} finally {
				actions.setLoading(createLoadingState(false));
			}
		},
		initialize(token: TokenSymbol): void {
			actions.initialize({ token });
		},
	};
};
