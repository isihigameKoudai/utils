import { defineStore } from '@/utils/i-state';

import { actions } from './actions';
import { queries } from './queries';
import { initialState } from './state';

export const DatabaseStore = defineStore({
  state: initialState,
  queries,
  actions,
});

export type { DatabaseState, ChromaStatus } from './type';
