import { describe, it, expect } from 'vitest';

import { CSV } from './csv';

describe('CSV', () => {
  const validCsvData = [
    ['header1', 'header2', 'header3'],
    ['value1-1', 'value1-2', 'value1-3'],
    ['value2-1', 'value2-2', 'value2-3'],
  ];

  describe('constructor', () => {
    it('型推論を使用してインスタンスを作成できる', () => {
      const csv = new CSV(validCsvData);
      expect(csv.value).toEqual(validCsvData);
    });

    it('明示的な型指定でインスタンスを作成できる', () => {
      const csv = new CSV<'header1' | 'header2' | 'header3'>(validCsvData);
      expect(csv.value).toEqual(validCsvData);
    });

    it('カラム数が一致しないCSVデータでエラーをスローする', () => {
      const invalidCsvData = [
        ['header1', 'header2', 'header3'],
        ['value1-1', 'value1-2'], // カラム数が少ない
      ];
      expect(() => new CSV(invalidCsvData)).toThrow(
        'The number of columns does not match',
      );
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
      expect(() => csv.getRecords('header1', 'non-existent')).toThrow(
        'Record not found',
      );
    });
  });

  describe('getColumns', () => {
    it('指定した複数のカラムの値を取得できる', () => {
      const csv = new CSV<'header1' | 'header2' | 'header3'>(validCsvData);
      const columns = csv.getColumns(['header2', 'header3']);
      expect(columns).toEqual([
        ['value1-2', 'value1-3'],
        ['value2-2', 'value2-3'],
      ]);
    });
  });
});
