import type { CsvSpreadsheetState } from './type';

export const initialState: CsvSpreadsheetState = {
  rows: [],
  fileName: null,
  selectedCell: null,
  editingCell: null,
  editValue: '',
};
