import { csv2array, fetchFiles, readCsvFileAsText } from '@/utils/file';
import type { ActionsProps } from '@/utils/i-state';

import { queries } from './queries';
import type { CellPosition, CsvSpreadsheetState } from './type';

export const serializeCell = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const actions = {
  async loadCSV({ dispatch }) {
    try {
      const { files } = await fetchFiles({ accept: '.csv' });
      if (files.length === 0) return;
      const text = await readCsvFileAsText(files[0]);
      const rows = csv2array(text);
      if (rows.length === 0) return;
      dispatch('rows', rows);
      dispatch('fileName', files[0].name);
      dispatch('selectedCell', null);
      dispatch('editingCell', null);
      dispatch('editValue', '');
    } catch (error) {
      console.error('CSV読み込みに失敗しました:', error);
    }
  },
  selectCell({ dispatch }, pos: CellPosition) {
    dispatch('selectedCell', pos);
  },
  startEditing({ state, dispatch }, pos: CellPosition) {
    const value = state.rows[pos.row]?.[pos.col] ?? '';
    dispatch('editingCell', pos);
    dispatch('selectedCell', pos);
    dispatch('editValue', value);
  },
  setEditValue({ dispatch }, value: string) {
    dispatch('editValue', value);
  },
  commitEdit({ state, dispatch }) {
    const { editingCell, editValue } = state;
    if (!editingCell) return;
    const { row, col } = editingCell;
    const newRows = state.rows.map((r, ri) =>
      ri === row ? r.map((cell, ci) => (ci === col ? editValue : cell)) : r,
    );
    dispatch('rows', newRows);
    dispatch('editingCell', null);
    dispatch('editValue', '');
  },
  cancelEdit({ dispatch }) {
    dispatch('editingCell', null);
    dispatch('editValue', '');
  },
  clearCell({ state, dispatch }, pos: CellPosition) {
    const newRows = state.rows.map((row, ri) =>
      ri === pos.row
        ? row.map((cell, ci) => (ci === pos.col ? '' : cell))
        : row,
    );
    dispatch('rows', newRows);
  },
  addRow({ state, dispatch }) {
    const colCount = state.rows[0]?.length ?? 1;
    dispatch('rows', [...state.rows, new Array<string>(colCount).fill('')]);
  },
  deleteRow({ state, dispatch }, { row }: { row: number }) {
    if (state.rows.length <= 1) return;
    dispatch(
      'rows',
      state.rows.filter((_, i) => i !== row),
    );
    dispatch('selectedCell', null);
  },
  addColumn({ state, dispatch }) {
    dispatch(
      'rows',
      state.rows.map((row) => [...row, '']),
    );
  },
  deleteColumn({ state, dispatch }, { col }: { col: number }) {
    if ((state.rows[0]?.length ?? 0) <= 1) return;
    dispatch(
      'rows',
      state.rows.map((row) => row.filter((_, i) => i !== col)),
    );
    dispatch('selectedCell', null);
  },
  moveRow({ state, dispatch }, { from, to }: { from: number; to: number }) {
    if (from === to) return;
    const newRows = [...state.rows];
    const [moved] = newRows.splice(from, 1);
    newRows.splice(to, 0, moved);
    dispatch('rows', newRows);
    dispatch('selectedCell', null);
  },
  moveColumn({ state, dispatch }, { from, to }: { from: number; to: number }) {
    if (from === to) return;
    const newRows = state.rows.map((row) => {
      const newRow = [...row];
      const [cell] = newRow.splice(from, 1);
      newRow.splice(to, 0, cell);
      return newRow;
    });
    dispatch('rows', newRows);
    dispatch('selectedCell', null);
  },
  exportCSV({ state }) {
    if (state.rows.length === 0) return;
    const csvContent = state.rows
      .map((row) => row.map(serializeCell).join(','))
      .join('\n');
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      state.fileName
        ? state.fileName.replace(/\.csv$/i, '_edited.csv')
        : 'exported.csv',
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
} satisfies ActionsProps<CsvSpreadsheetState, typeof queries>;
