import { defineStore } from '@/utils/i-state';

import { actions } from './actions';
import { queries } from './queries';
import { initialState } from './state';

export { toChartDataKey } from './queries';
export type { ChartDataKey, TradeState } from './type';

export const TradeStore = defineStore({
  state: initialState,
  queries,
  actions,
});
