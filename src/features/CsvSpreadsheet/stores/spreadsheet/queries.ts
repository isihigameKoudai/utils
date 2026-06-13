import type { QueriesProps } from '@/utils/i-state';

import type { CsvSpreadsheetState } from './type';

export const queries = {
  rows: (state: CsvSpreadsheetState) => state.rows,
  hasData: (state: CsvSpreadsheetState) => state.rows.length > 0,
  rowCount: (state: CsvSpreadsheetState) => state.rows.length,
  colCount: (state: CsvSpreadsheetState) => state.rows[0]?.length ?? 0,
  selectedCell: (state: CsvSpreadsheetState) => state.selectedCell,
  editingCell: (state: CsvSpreadsheetState) => state.editingCell,
  editValue: (state: CsvSpreadsheetState) => state.editValue,
  fileName: (state: CsvSpreadsheetState) => state.fileName,
} satisfies QueriesProps<CsvSpreadsheetState>;
