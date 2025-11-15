import { describe, it, expect } from 'vitest';
import { csv2array, mergeStringifyCSVs, mergeArrayedCSVs } from './file';

describe('csv2array', () => {
  it('基本的なCSV文字列を2次元配列に変換できる', () => {
    const input = 'a,b,c\nd,e,f\n';
    const expected = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ];
    expect(csv2array(input)).toEqual(expected);
  });

  it('空のCSV文字列を処理できる', () => {
    const input = '';
    const expected: string[][] = [];
    expect(csv2array(input)).toEqual(expected);
  });

  it('改行のみのCSV文字列を処理できる', () => {
    const input = '\n\n';
    expect(csv2array(input)).toEqual([]);
  });

  it('CRLFの改行コードを処理できる', () => {
    const input = 'a,b,c\r\nd,e,f\r\n';
    const expected = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ];
    expect(csv2array(input)).toEqual(expected);
  });

  it('空のセルを含むCSV文字列を処理できる', () => {
    const input = 'a,,c\nd,e,\n';
    const expected = [
      ['a', '', 'c'],
      ['d', 'e', ''],
    ];
    expect(csv2array(input)).toEqual(expected);
  });
});

describe('mergeStringifyCSVs', () => {
  it('複数のCSV文字列を正しくマージできる', () => {
    const csv1 = 'name,amount,date\nAlice,100,2021-01-01\nBob,200,2021-01-02\n';
    const csv2 = 'name,amount,date\nAlice,200,2022-01-01\nBob,300,2024-01-02\n';
    const expected = [
      ['name', 'amount', 'date'],
      ['Alice', '100', '2021-01-01'],
      ['Bob', '200', '2021-01-02'],
      ['Alice', '200', '2022-01-01'],
      ['Bob', '300', '2024-01-02'],
    ];
    expect(mergeStringifyCSVs([csv1, csv2])).toEqual(expected);
  });

  it('空の配列を処理できる', () => {
    expect(mergeStringifyCSVs([])).toEqual([]);
  });

  it('1つのCSV文字列を処理できる', () => {
    const csv = 'name,amount,date\nAlice,100,2021-01-01\n';
    const expected = [
      ['name', 'amount', 'date'],
      ['Alice', '100', '2021-01-01'],
    ];
    expect(mergeStringifyCSVs([csv])).toEqual(expected);
  });
});

describe('mergeArrayedCSVs', () => {
  it('複数のCSV配列を正しくマージできる', () => {
    const csv1 = [
      ['name', 'amount', 'date'],
      ['Alice', '100', '2021-01-01'],
      ['Bob', '200', '2021-01-02'],
    ];
    const csv2 = [
      ['name', 'amount', 'date'],
      ['Alice', '200', '2022-01-01'],
      ['Bob', '300', '2024-01-02'],
    ];
    const expected = [
      ['name', 'amount', 'date'],
      ['Alice', '100', '2021-01-01'],
      ['Bob', '200', '2021-01-02'],
      ['Alice', '200', '2022-01-01'],
      ['Bob', '300', '2024-01-02'],
    ];
    expect(mergeArrayedCSVs([csv1, csv2])).toEqual(expected);
  });

  it('空の配列を処理できる', () => {
    expect(mergeArrayedCSVs([])).toEqual([]);
  });

  it('1つのCSV配列を処理できる', () => {
    const csv = [
      ['name', 'amount', 'date'],
      ['Alice', '100', '2021-01-01'],
    ];
    const expected = [
      ['name', 'amount', 'date'],
      ['Alice', '100', '2021-01-01'],
    ];
    expect(mergeArrayedCSVs([csv])).toEqual(expected);
  });
});
