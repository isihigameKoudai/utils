import { describe, it, expect } from 'vitest';
import { CSV } from './csv';

describe('CSV', () => {
  const validCsvData = [
    ['header1', 'header2', 'header3'],
    ['value1-1', 'value1-2', 'value1-3'],
    ['value2-1', 'value2-2', 'value2-3'],
  ];

  describe('constructor', () => {
    it('正常なCSVデータでインスタンスを作成できる', () => {
      const csv = new CSV<'header1' | 'header2' | 'header3'>(validCsvData);
      expect(csv.value).toEqual(validCsvData);
    });

    it('空のCSVデータでエラーをスローする', () => {
      expect(() => new CSV([])).toThrow('CSV is empty');
    });

    it('カラム数が一致しないCSVデータでエラーをスローする', () => {
      const invalidCsvData = [
        ['header1', 'header2', 'header3'],
        ['value1-1', 'value1-2'], // カラム数が少ない
      ];
      expect(() => new CSV(invalidCsvData)).toThrow('The number of columns does not match');
    });
  });

  describe('headers', () => {
    it('ヘッダー行を取得できる', () => {
      const csv = new CSV<'header1' | 'header2' | 'header3'>(validCsvData);
      expect(csv.headers).toEqual(['header1', 'header2', 'header3']);
    });
  });

  describe('getRecords', () => {
    it('指定したキーと値に一致するレコードを取得できる', () => {
      const csv = new CSV<'header1' | 'header2' | 'header3'>(validCsvData);
      const records = csv.getRecords('header1', 'value1-1');
      expect(records).toEqual(['value1-1']);
    });

    it('存在しないレコードでエラーをスローする', () => {
      const csv = new CSV<'header1' | 'header2' | 'header3'>(validCsvData);
      expect(() => csv.getRecords('header1', 'non-existent')).toThrow('Record not found');
    });
  });

  describe('getColumn', () => {
    it('指定したカラムの値を取得できる', () => {
      const csv = new CSV<'header1' | 'header2' | 'header3'>(validCsvData);
      const column = csv.getColumn('header1');
      expect(column).toEqual(['value1-1', 'value2-1']);
    });

    it('存在しないカラムでエラーをスローする', () => {
      const csv = new CSV<'header1' | 'header2' | 'header3'>(validCsvData);
      expect(() => csv.getColumn('non-existent' as any)).toThrow('Column not found');
    });
  });

  describe('getColumns', () => {
    it('指定した複数のカラムの値を取得できる', () => {
      const csv = new CSV<'header1' | 'header2' | 'header3'>(validCsvData);
      const columns = csv.getColumns(['header2', 'header3']);
      expect(columns).toEqual([
        ['value1-2', 'value2-2'],
        ['value1-3', 'value2-3'],
      ]);
    });
  });
});
