import { describe, it, expect } from 'vitest';
import { csv2array } from './file';

describe('csv2array', () => {
  it('基本的なCSV文字列を2次元配列に変換できる', () => {
    const input = 'a,b,c\nd,e,f\n';
    const expected = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f']
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
    const expected = [];
    expect(csv2array(input)).toEqual(expected);
  });

  it('CRLFの改行コードを処理できる', () => {
    const input = 'a,b,c\r\nd,e,f\r\n';
    const expected = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f']
    ];
    expect(csv2array(input)).toEqual(expected);
  });

  it('空のセルを含むCSV文字列を処理できる', () => {
    const input = 'a,,c\nd,e,\n';
    const expected = [
      ['a', '', 'c'],
      ['d', 'e', '']
    ];
    expect(csv2array(input)).toEqual(expected);
  });
}); 
