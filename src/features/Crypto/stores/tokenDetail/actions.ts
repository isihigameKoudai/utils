import type { ActionsProps } from '@/utils/i-state';

import {
  MULTI_TIMEFRAMES,
  type MultiTimeframe,
  type Symbol,
} from '../../constants';
import type { TokenDetailApi } from '../../services/tokenDetail/types';

import { queries } from './queries';
import type {
  TokenDetailChartData,
  TokenDetailErrorState,
  TokenDetailLoadingState,
  TokenDetailState,
} from './type';

export const actions = {
  /**
   * @description トークンを初期化する
   * @command Initialize
   */
  initialize({ dispatch }, { token }: { token: Symbol }) {
    dispatch('token', token);
    dispatch('chartData', {});
    dispatch('loading', {});
    dispatch('errors', {});
  },

  /**
   * @description APIから全タイムフレームのデータを取得してstateに反映
   * @command FetchAllTimeframes
   */
  async fetchAllTimeframes({ dispatch }, api: TokenDetailApi, token: Symbol) {
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

    dispatch('chartData', nextChartData);
    dispatch('errors', nextErrors);
    dispatch('loading', nextLoading);
  },

  setLoading({ dispatch }, loading: TokenDetailLoadingState) {
    dispatch('loading', loading);
  },

  setErrors({ dispatch }, errors: TokenDetailErrorState) {
    dispatch('errors', errors);
  },

  setChartData({ dispatch }, chartData: TokenDetailChartData) {
    dispatch('chartData', chartData);
  },
} satisfies ActionsProps<TokenDetailState, typeof queries>;
