import { describe, it, expect } from 'vitest';
import { splitMap, unique, sortByKey, sumByKey } from './array';

describe('Array functions', () => {
  describe('splitMap', () => {
    it('配列を指定した数で分割する', () => {
      expect(splitMap([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('配列の要素数が分割数と同じ場合', () => {
      expect(splitMap([1, 2, 3, 4, 5], 5)).toEqual([[1, 2, 3, 4, 5]]);
    });

    it('分割数が1の場合', () => {
      expect(splitMap([1, 10, 100], 1)).toEqual([[1], [10], [100]]);
    });

    it('空の配列の場合', () => {
      expect(splitMap([], 2)).toEqual([]);
    });

    it('分割数が配列の長さより大きい場合', () => {
      expect(splitMap([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
    });
  });

  describe('unique', () => {
    it('重複と異なる型を含む配列から一意の数値を取得する', () => {
      expect(unique([9, 2, 3, 5, 2, 1, 5, '1', '10'])).toEqual([9, 2, 3, 5, 1, 10]);
    });

    it('undefinedと数値に変換できない文字列を含む配列を処理する', () => {
      expect(unique([1, 2, undefined, '3', 'abc', 4])).toEqual([1, 2, 3, 4]);
    });

    it('空の配列を処理する', () => {
      expect(unique([])).toEqual([]);
    });

    it('すべての要素が一意の場合', () => {
      expect(unique([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('sortByKey', () => {
    const testArray = [
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
      { key: 'a', value: 3, foo: 'bar' }
    ];

    it('デフォルトの降順でkeyによってソートする', () => {
      expect(sortByKey(testArray, 'key', 'desc')).toEqual([
        { key: 'b', value: 2 },
        { key: 'a', value: 1 },

        { key: 'a', value: 3, foo: 'bar' }
      ]);
    });

    it('昇順でkeyによってソートする', () => {
      expect(sortByKey(testArray, 'key', 'asc')).toEqual([
        { key: 'a', value: 1 },
        { key: 'a', value: 3, foo: 'bar' },
        { key: 'b', value: 2 }
      ]);
    });

    it('valueでソートする', () => {
      expect(sortByKey(testArray, 'value', 'asc')).toEqual([
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'a', value: 3, foo: 'bar' }
      ]);
    });

    it('空の配列をソートする', () => {
      expect(sortByKey([], 'key', 'desc')).toEqual([]);
    });
  });

  describe('sumByKey', () => {
    it('同じkeyを持つ要素のvalueを合計する', () => {
      const input = [
        { text: 'a', amount: 1, num: 10 },
        { text: 'b', amount: 2 },
        { text: 'a', amount: 3, num: 11 }
      ];
      expect(sumByKey(input, { orderKey: 'text', numKey: 'amount' })).toEqual([
        { text: 'a', amount: 4 },
        { text: 'b', amount: 2 }
      ]);
    });

    it('追加のプロパティを保持する', () => {
      const input = [
        { key: 'a', value: 1, extra: 'x' },
        { key: 'b', value: 2, extra: 'y' },
        { key: 'a', value: 3, extra: 'z' }
      ];
      expect(sumByKey(input, { orderKey: 'key', numKey: 'value' })).toEqual([
        { key: 'a', value: 4, extra: 'z' },
        { key: 'b', value: 2, extra: 'y' }
      ]);
    });

    it('空の配列を処理する', () => {
      expect(sumByKey([], { orderKey: 'key', numKey: 'value' })).toEqual([]);
    });

    it('すべての要素が一意のkeyを持つ場合', () => {
      const input = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 }
      ];
      expect(sumByKey(input, { orderKey: 'key', numKey: 'value' })).toEqual(input);
    });
  });
});
