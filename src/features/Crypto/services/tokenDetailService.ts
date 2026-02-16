import {
  MULTI_TIMEFRAMES,
  type MultiTimeframe,
  type Symbol,
} from '../constants';
import type {
  TokenDetailChartData,
  TokenDetailErrorState,
  TokenDetailLoadingState,
} from '../stores/tokenDetail';

import type { TokenDetailServiceDeps } from './types';

const createLoadingState = (value: boolean): TokenDetailLoadingState => {
  return MULTI_TIMEFRAMES.reduce<TokenDetailLoadingState>((acc, timeframe) => {
    acc[timeframe] = value;
    return acc;
  }, {});
};

const createFallbackErrors = (message: string): TokenDetailErrorState => {
  return MULTI_TIMEFRAMES.reduce<TokenDetailErrorState>((acc, timeframe) => {
    acc[timeframe] = message;
    return acc;
  }, {});
};

export const createTokenDetailService = ({
  api,
  actions,
}: TokenDetailServiceDeps) => {
  return {
    async fetchAllTimeframes(token: Symbol): Promise<void> {
      actions.setLoading(createLoadingState(true));
      actions.setErrors({});

      try {
        const settled = await Promise.allSettled(
          api.fetchAllTimeframes(token, MULTI_TIMEFRAMES),
        );

        const nextChartData: TokenDetailChartData = {};
        const nextErrors: TokenDetailErrorState = {};
        const nextLoading: TokenDetailLoadingState = {};

        settled.forEach((result, index) => {
          const timeframe: MultiTimeframe = MULTI_TIMEFRAMES[index];
          nextLoading[timeframe] = false;

          if (result.status === 'fulfilled') {
            nextChartData[timeframe] = result.value.data;
            return;
          }

          nextErrors[timeframe] =
            result.reason instanceof Error
              ? result.reason.message
              : 'データ取得に失敗しました';
        });

        actions.setChartData(nextChartData);
        actions.setErrors(nextErrors);
        actions.setLoading(nextLoading);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'データ取得に失敗しました';

        actions.setErrors(createFallbackErrors(message));
        actions.setLoading(createLoadingState(false));
      }
    },
  };
};
