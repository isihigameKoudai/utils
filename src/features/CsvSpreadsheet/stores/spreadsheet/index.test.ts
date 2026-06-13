import { describe, expect, it, vi } from 'vitest';

import type { Dispatch } from '@/utils/i-state';

import {
  actions,
  queries,
  serializeCell,
  type CellPosition,
  type CsvSpreadsheetState,
} from '.';

const makeState = (
  overrides: Partial<CsvSpreadsheetState> = {},
): CsvSpreadsheetState => ({
  rows: [],
  fileName: null,
  selectedCell: null,
  editingCell: null,
  editValue: '',
  ...overrides,
});

const makeCtx = (initial: Partial<CsvSpreadsheetState> = {}) => {
  let state = makeState(initial);
  const dispatch = vi.fn(
    <K extends keyof CsvSpreadsheetState>(
      key: K,
      value: CsvSpreadsheetState[K],
    ) => {
      state = { ...state, [key]: value };
    },
  ) as unknown as Dispatch<CsvSpreadsheetState>;
  return {
    get ctx() {
      return { state, queries: {} as never, dispatch };
    },
    getState: () => state,
    dispatch,
  };
};

const SAMPLE_ROWS = [
  ['名前', '年齢', '職業'],
  ['山田太郎', '28', 'エンジニア'],
  ['佐藤花子', '34', 'デザイナー'],
];

describe('serializeCell', () => {
  it('特殊文字を含まない値はそのまま返す', () => {
    expect(serializeCell('hello')).toBe('hello');
  });

  it('カンマを含む値はダブルクォートで囲む', () => {
    expect(serializeCell('a,b')).toBe('"a,b"');
  });

  it('ダブルクォートを含む値はクォート内でエスケープし囲む', () => {
    expect(serializeCell('say "hello"')).toBe('"say ""hello"""');
  });

  it('改行を含む値はダブルクォートで囲む', () => {
    expect(serializeCell('line1\nline2')).toBe('"line1\nline2"');
  });

  it('空文字列はそのまま返す', () => {
    expect(serializeCell('')).toBe('');
  });
});

describe('queries', () => {
  it('rows: 現在の行配列を返す', () => {
    const state = makeState({ rows: SAMPLE_ROWS });
    expect(queries.rows(state)).toBe(SAMPLE_ROWS);
  });

  it('hasData: rows が空のとき false を返す', () => {
    expect(queries.hasData(makeState())).toBe(false);
  });

  it('hasData: rows が存在するとき true を返す', () => {
    expect(queries.hasData(makeState({ rows: SAMPLE_ROWS }))).toBe(true);
  });

  it('rowCount: 行数を返す', () => {
    expect(queries.rowCount(makeState({ rows: SAMPLE_ROWS }))).toBe(3);
  });

  it('colCount: 列数を返す', () => {
    expect(queries.colCount(makeState({ rows: SAMPLE_ROWS }))).toBe(3);
  });

  it('colCount: rows が空のとき 0 を返す', () => {
    expect(queries.colCount(makeState())).toBe(0);
  });

  it('selectedCell: 選択中のセル位置を返す', () => {
    const pos: CellPosition = { row: 1, col: 2 };
    expect(queries.selectedCell(makeState({ selectedCell: pos }))).toEqual(pos);
  });

  it('editingCell: 編集中のセル位置を返す', () => {
    const pos: CellPosition = { row: 0, col: 0 };
    expect(queries.editingCell(makeState({ editingCell: pos }))).toEqual(pos);
  });

  it('editValue: 編集中の値を返す', () => {
    expect(queries.editValue(makeState({ editValue: 'test' }))).toBe('test');
  });

  it('fileName: ファイル名を返す', () => {
    expect(queries.fileName(makeState({ fileName: 'data.csv' }))).toBe(
      'data.csv',
    );
  });
});

describe('actions', () => {
  describe('selectCell', () => {
    it('selectedCell を更新する', () => {
      const { ctx, getState } = makeCtx();
      const pos: CellPosition = { row: 2, col: 1 };
      actions.selectCell(ctx, pos);
      expect(getState().selectedCell).toEqual(pos);
    });
  });

  describe('startEditing', () => {
    it('editingCell と selectedCell を設定し既存の値を editValue にセットする', () => {
      const { ctx, getState } = makeCtx({ rows: SAMPLE_ROWS });
      actions.startEditing(ctx, { row: 1, col: 0 });
      expect(getState().editingCell).toEqual({ row: 1, col: 0 });
      expect(getState().selectedCell).toEqual({ row: 1, col: 0 });
      expect(getState().editValue).toBe('山田太郎');
    });

    it('存在しないセルの場合は editValue を空文字にする', () => {
      const { ctx, getState } = makeCtx({ rows: SAMPLE_ROWS });
      actions.startEditing(ctx, { row: 99, col: 99 });
      expect(getState().editValue).toBe('');
    });
  });

  describe('setEditValue', () => {
    it('editValue を更新する', () => {
      const { ctx, getState } = makeCtx({ editValue: 'old' });
      actions.setEditValue(ctx, 'new value');
      expect(getState().editValue).toBe('new value');
    });
  });

  describe('commitEdit', () => {
    it('editingCell の位置に editValue を書き込み編集状態をリセットする', () => {
      const { ctx, getState } = makeCtx({
        rows: SAMPLE_ROWS,
        editingCell: { row: 1, col: 0 },
        editValue: '田中一郎',
      });
      actions.commitEdit(ctx);
      expect(getState().rows[1][0]).toBe('田中一郎');
      expect(getState().editingCell).toBeNull();
      expect(getState().editValue).toBe('');
    });

    it('editingCell が null のときは何もしない', () => {
      const { ctx, dispatch } = makeCtx({
        rows: SAMPLE_ROWS,
        editingCell: null,
      });
      actions.commitEdit(ctx);
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('他の行・列の値を変更しない', () => {
      const { ctx, getState } = makeCtx({
        rows: SAMPLE_ROWS,
        editingCell: { row: 1, col: 1 },
        editValue: '30',
      });
      actions.commitEdit(ctx);
      expect(getState().rows[1][0]).toBe('山田太郎');
      expect(getState().rows[1][2]).toBe('エンジニア');
    });
  });

  describe('cancelEdit', () => {
    it('editingCell と editValue をリセットする', () => {
      const { ctx, getState } = makeCtx({
        editingCell: { row: 0, col: 0 },
        editValue: '途中入力',
      });
      actions.cancelEdit(ctx);
      expect(getState().editingCell).toBeNull();
      expect(getState().editValue).toBe('');
    });
  });

  describe('clearCell', () => {
    it('指定セルの値を空文字にする', () => {
      const { ctx, getState } = makeCtx({ rows: SAMPLE_ROWS });
      actions.clearCell(ctx, { row: 1, col: 2 });
      expect(getState().rows[1][2]).toBe('');
    });

    it('他のセルの値を変更しない', () => {
      const { ctx, getState } = makeCtx({ rows: SAMPLE_ROWS });
      actions.clearCell(ctx, { row: 1, col: 0 });
      expect(getState().rows[0][0]).toBe('名前');
      expect(getState().rows[1][1]).toBe('28');
      expect(getState().rows[2][0]).toBe('佐藤花子');
    });
  });

  describe('addRow', () => {
    it('末尾に空の行を追加する', () => {
      const { ctx, getState } = makeCtx({ rows: SAMPLE_ROWS });
      actions.addRow(ctx);
      expect(getState().rows).toHaveLength(4);
      expect(getState().rows[3]).toEqual(['', '', '']);
    });

    it('列数は先頭行に合わせる', () => {
      const rows = [['a', 'b', 'c', 'd']];
      const { ctx, getState } = makeCtx({ rows });
      actions.addRow(ctx);
      expect(getState().rows[1]).toHaveLength(4);
    });
  });

  describe('deleteRow', () => {
    it('指定行を削除する', () => {
      const { ctx, getState } = makeCtx({ rows: SAMPLE_ROWS });
      actions.deleteRow(ctx, { row: 1 });
      expect(getState().rows).toHaveLength(2);
      expect(getState().rows[1][0]).toBe('佐藤花子');
    });

    it('削除後に selectedCell を null にする', () => {
      const { ctx, getState } = makeCtx({
        rows: SAMPLE_ROWS,
        selectedCell: { row: 1, col: 0 },
      });
      actions.deleteRow(ctx, { row: 1 });
      expect(getState().selectedCell).toBeNull();
    });

    it('行が 1 行しかない場合は削除しない', () => {
      const rows = [['a', 'b']];
      const { ctx, dispatch } = makeCtx({ rows });
      actions.deleteRow(ctx, { row: 0 });
      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe('addColumn', () => {
    it('全行に空の列を追加する', () => {
      const { ctx, getState } = makeCtx({ rows: SAMPLE_ROWS });
      actions.addColumn(ctx);
      expect(getState().rows[0]).toHaveLength(4);
      expect(getState().rows[0][3]).toBe('');
      expect(getState().rows[1][3]).toBe('');
    });
  });

  describe('deleteColumn', () => {
    it('指定列を全行から削除する', () => {
      const { ctx, getState } = makeCtx({ rows: SAMPLE_ROWS });
      actions.deleteColumn(ctx, { col: 1 });
      expect(getState().rows[0]).toEqual(['名前', '職業']);
      expect(getState().rows[1]).toEqual(['山田太郎', 'エンジニア']);
    });

    it('削除後に selectedCell を null にする', () => {
      const { ctx, getState } = makeCtx({
        rows: SAMPLE_ROWS,
        selectedCell: { row: 0, col: 1 },
      });
      actions.deleteColumn(ctx, { col: 1 });
      expect(getState().selectedCell).toBeNull();
    });

    it('列が 1 列しかない場合は削除しない', () => {
      const rows = [['a'], ['b']];
      const { ctx, dispatch } = makeCtx({ rows });
      actions.deleteColumn(ctx, { col: 0 });
      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe('moveRow', () => {
    it('from === to のとき何もしない', () => {
      const { ctx, dispatch } = makeCtx({ rows: SAMPLE_ROWS });
      actions.moveRow(ctx, { from: 1, to: 1 });
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('行を下方向に移動する（0 → 2）', () => {
      const { ctx, getState } = makeCtx({ rows: SAMPLE_ROWS });
      actions.moveRow(ctx, { from: 0, to: 2 });
      expect(getState().rows[0][0]).toBe('山田太郎');
      expect(getState().rows[1][0]).toBe('佐藤花子');
      expect(getState().rows[2][0]).toBe('名前');
    });

    it('行を上方向に移動する（2 → 0）', () => {
      const { ctx, getState } = makeCtx({ rows: SAMPLE_ROWS });
      actions.moveRow(ctx, { from: 2, to: 0 });
      expect(getState().rows[0][0]).toBe('佐藤花子');
      expect(getState().rows[1][0]).toBe('名前');
      expect(getState().rows[2][0]).toBe('山田太郎');
    });

    it('移動後に selectedCell を null にする', () => {
      const { ctx, getState } = makeCtx({
        rows: SAMPLE_ROWS,
        selectedCell: { row: 0, col: 0 },
      });
      actions.moveRow(ctx, { from: 0, to: 2 });
      expect(getState().selectedCell).toBeNull();
    });

    it('元のデータを保持する（行全体が正しく移動する）', () => {
      const { ctx, getState } = makeCtx({ rows: SAMPLE_ROWS });
      actions.moveRow(ctx, { from: 1, to: 2 });
      expect(getState().rows[1]).toEqual(['佐藤花子', '34', 'デザイナー']);
      expect(getState().rows[2]).toEqual(['山田太郎', '28', 'エンジニア']);
    });
  });

  describe('moveColumn', () => {
    it('from === to のとき何もしない', () => {
      const { ctx, dispatch } = makeCtx({ rows: SAMPLE_ROWS });
      actions.moveColumn(ctx, { from: 0, to: 0 });
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('列を右方向に移動する（0 → 2）', () => {
      const { ctx, getState } = makeCtx({ rows: SAMPLE_ROWS });
      actions.moveColumn(ctx, { from: 0, to: 2 });
      expect(getState().rows[0]).toEqual(['年齢', '職業', '名前']);
      expect(getState().rows[1]).toEqual(['28', 'エンジニア', '山田太郎']);
    });

    it('列を左方向に移動する（2 → 0）', () => {
      const { ctx, getState } = makeCtx({ rows: SAMPLE_ROWS });
      actions.moveColumn(ctx, { from: 2, to: 0 });
      expect(getState().rows[0]).toEqual(['職業', '名前', '年齢']);
      expect(getState().rows[1]).toEqual(['エンジニア', '山田太郎', '28']);
    });

    it('移動後に selectedCell を null にする', () => {
      const { ctx, getState } = makeCtx({
        rows: SAMPLE_ROWS,
        selectedCell: { row: 0, col: 0 },
      });
      actions.moveColumn(ctx, { from: 0, to: 2 });
      expect(getState().selectedCell).toBeNull();
    });

    it('全行に一様に列移動が適用される', () => {
      const { ctx, getState } = makeCtx({ rows: SAMPLE_ROWS });
      actions.moveColumn(ctx, { from: 1, to: 2 });
      expect(getState().rows[0]).toEqual(['名前', '職業', '年齢']);
      expect(getState().rows[1]).toEqual(['山田太郎', 'エンジニア', '28']);
      expect(getState().rows[2]).toEqual(['佐藤花子', 'デザイナー', '34']);
    });
  });

  describe('exportCSV', () => {
    it('rows が空のときは何も実行しない', () => {
      const { ctx, dispatch } = makeCtx();
      actions.exportCSV(ctx);
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
