import { defineStore } from '@/utils/i-state';

import { actions } from './actions';
import { queries } from './queries';
import { initialState } from './state';

export type {
  TokenDetailChartData,
  TokenDetailErrorState,
  TokenDetailLoadingState,
  TokenDetailState,
} from './type';

export const TokenDetailStore = defineStore({
  state: initialState,
  queries,
  actions,
});
