export type CellPosition = { row: number; col: number };

export type CsvSpreadsheetState = {
  rows: string[][];
  fileName: string | null;
  selectedCell: CellPosition | null;
  editingCell: CellPosition | null;
  editValue: string;
};
