import { defineStore } from '../../../../../utils/i-state';

// 1. シンプルなカウンター
export const counterStore = defineStore({
  state: {
    count: 0,
  },
  queries: {
    isPositive: (state) => state.count > 0,
    isNegative: (state) => state.count < 0,
  },
  actions: {
    increment: ({ state, dispatch }) => {
      dispatch('count', state.count + 1);
    },
    decrement: ({ state, dispatch }) => {
      dispatch('count', state.count - 1);
    },
    reset: ({ dispatch }) => {
      dispatch('count', 0);
    },
  },
});
