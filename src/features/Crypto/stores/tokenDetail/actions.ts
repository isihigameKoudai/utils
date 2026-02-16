import type { ActionsProps } from '@/utils/i-state';

import type { Symbol } from '../../constants';

import { queries } from './queries';
import type {
  TokenDetailChartData,
  TokenDetailErrorState,
  TokenDetailLoadingState,
  TokenDetailState,
} from './type';

export const actions = {
  initialize({ dispatch }, { token }: { token: Symbol }) {
    dispatch('token', token);
    dispatch('chartData', {});
    dispatch('loading', {});
    dispatch('errors', {});
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
