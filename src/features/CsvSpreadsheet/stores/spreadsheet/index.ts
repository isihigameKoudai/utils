import { defineStore } from '@/utils/i-state';

import { actions } from './actions';
import { queries } from './queries';
import { initialState } from './state';

export { actions, serializeCell } from './actions';
export { queries } from './queries';
export type { CellPosition, CsvSpreadsheetState } from './type';

export const CsvSpreadsheetStore = defineStore({
  state: initialState,
  queries,
  actions,
});
