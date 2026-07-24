import { defineStore } from '@/utils/i-state';

import { actions } from './actions';
import { queries } from './queries';
import { initialState } from './state';

export const TradeStore = defineStore({
	state: initialState,
	queries,
	actions,
});
