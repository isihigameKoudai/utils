import type { Option, FetchFiles } from './type';
import { deferred } from '../promise/promise';
import { isTruthy } from '../guards';

type DecoderCandidate = {
  label: string;
  options?: TextDecoderOptions;
};

const TEXT_DECODER_CANDIDATES: DecoderCandidate[] = [
  { label: 'utf-8', options: { fatal: true } },
  { label: 'shift_jis' },
  { label: 'windows-31j' },
];

const isDecodingFailure = (error: unknown): boolean => {
  if (error instanceof TypeError) {
    return true;
  }
  if (typeof DOMException !== 'undefined' && error instanceof DOMException) {
    return true;
  }
  return false;
};

/**
 * ArrayBufferをデコードして文字列に変換する
 * UTF-8, Shift_JIS, Windows-31J の順でデコードを試みる
 *
 * @param buffer - デコード対象のバッファ
 * @returns デコードされた文字列
 */
export const decodeCsvBuffer = (
  buffer: ArrayBuffer | ArrayBufferView,
): string => {
  for (const { label, options } of TEXT_DECODER_CANDIDATES) {
    try {
      return new TextDecoder(label, options).decode(buffer);
    } catch (error) {
      if (isDecodingFailure(error)) {
        continue;
      }
      throw error;
    }
  }
  return new TextDecoder('utf-8').decode(buffer);
};

/**
 * CSVファイルを読み込んでテキストとして返す
 * エンコーディングは自動判別される
 *
 * @param file - 読み込むFileオブジェクト
 * @returns ファイルの内容（文字列）
 */
export const readCsvFileAsText = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  return decodeCsvBuffer(buffer);
};

/**
 * CSV形式のテキストを2次元配列に変換する
 * ex: csv2array('a,b,c\nd,e,f\n') => [['a','b','c'],['d','e','f']]
 * ex: csv2array('"a","b","c"\nd,e,f\n') => [['a','b','c'],['d','e','f']]
 *
 * @param csv
 * @returns
 */
export const csv2array = (csv: string): string[][] =>
  csv
    .replaceAll('\r', '')
    .split('\n')
    .filter(isTruthy)
    .map((row) => row.split(',').map((cell) => cell.replace(/^"|"$/g, '')));

/**
 * 2次元配列をCSV形式のテキストに変換する
 *
 * @example
 * array2csv([
 *  ['header1','header2','header3'],
 *  ['ddddddd','eeeeeee','fffffff']
 *  ['ggggggg','hhhhhhh','iiiiiii']
 * ]);
 * => 'header1,header2,header3\nddddddd,eeeeeee,fffffff\nggggggg,hhhhhhh,iiiiiii'
 */
export const array2csv = (array: string[][]): string =>
  array.map((row) => row.join(',')).join('\n');

/**
 * CSV形式のテキストをjsonに変換する
 * ex: csv2json('name,amount,date\nAlice,100,2021-01-01\nBob,200,2021-01-02\n')
 * => [
 * {name: 'Alice', amount: '100', date: '2021-01-01'},
 * {name: 'Bob', amount: '200', date: '2021-01-02'}
 * ]
 */
export const csv2json = <T = Record<string, string>>(csv: string): T[] => {
  const [header, ...rows] = csv2array(csv);
  return rows.map((row) =>
    row.reduce((acc, cur, i) => {
      return {
        ...acc,
        [header[i]]: cur,
      };
    }, {}),
  ) as T[];
};

/**
 * @example
 * ex1:
 * const csv1 = 'name,amount,date\nAlice,100,2021-01-01\nBob,200,2021-01-02\n';
 * const csv2 = 'name,amount,date\nAlice,200,2022-01-01\nBob,300,2024-01-02\n';
 * const mergedCsv = mergeCsvs([csv1, csv2]);
 * => [
 *  ['name', 'amount', 'date'],
 *  ['Alice', '100', '2021-01-01'],
 *  ['Bob', '200', '2021-01-02'],
 *  ['Alice', '200', '2022-01-01'],
 *  ['Bob', '300', '2024-01-02'],
 * ];
 */
/**
 * 複数のCSV文字列をマージする
 * 最初のCSVのヘッダーを使用し、2つ目以降のCSVのヘッダーは無視してデータ行のみを結合する
 *
 * @param _csvs - CSV文字列の配列
 * @returns マージされた2次元配列
 * @example
 * ex1:
 * const csv1 = 'name,amount,date\nAlice,100,2021-01-01\nBob,200,2021-01-02\n';
 * const csv2 = 'name,amount,date\nAlice,200,2022-01-01\nBob,300,2024-01-02\n';
 * const mergedCsv = mergeCsvs([csv1, csv2]);
 * => [
 *  ['name', 'amount', 'date'],
 *  ['Alice', '100', '2021-01-01'],
 *  ['Bob', '200', '2021-01-02'],
 *  ['Alice', '200', '2022-01-01'],
 *  ['Bob', '300', '2024-01-02'],
 * ];
 */
export const mergeStringifyCSVs = (_csvs: string[]): string[][] => {
  if (_csvs.length === 0) return [];
  const csvs = _csvs.map((csv) => csv2array(csv));
  const header = csvs[0][0];
  const rows = csvs.map((csv) => csv.slice(1));
  return [header, ...rows.flat()];
};

/**
 * @example
 * ex1:
 * const csv1 = 'name,amount,date\nAlice,100,2021-01-01\nBob,200,2021-01-02\n';
 * const csv2 = 'name,amount,date\nAlice,200,2022-01-01\nBob,300,2024-01-02\n';
 * const mergedCsv = mergeCsvs([csv1, csv2]);
 * => 'name,amount,date\nAlice,100,2021-01-01\nBob,200,2021-01-02\nAlice,200,2022-01-01\nBob,300,2024-01-02\n'
 */
/**
 * 複数の2次元配列形式のCSVをマージする
 * 最初のCSVのヘッダーを使用し、2つ目以降のCSVのヘッダーは無視してデータ行のみを結合する
 *
 * @param _csvs - CSVデータの配列（2次元配列の配列）
 * @returns マージされた2次元配列
 * @example
 * ex1:
 * const csv1 = 'name,amount,date\nAlice,100,2021-01-01\nBob,200,2021-01-02\n';
 * const csv2 = 'name,amount,date\nAlice,200,2022-01-01\nBob,300,2024-01-02\n';
 * const mergedCsv = mergeCsvs([csv1, csv2]);
 * => 'name,amount,date\nAlice,100,2021-01-01\nBob,200,2021-01-02\nAlice,200,2022-01-01\nBob,300,2024-01-02\n'
 */
export const mergeArrayedCSVs = (_csvs: string[][][]): string[][] => {
  if (_csvs.length === 0) return [];
  const header = _csvs[0][0];
  const rows = _csvs.map((csv) => csv.slice(1));
  return [header, ...rows.flat()];
};

/**
 * CSV文字列または2次元配列の配列を受け取り、それらをマージして返す
 * 入力が文字列の配列か、2次元配列の配列かを自動判定して適切な処理を行う
 *
 * @param csvs - CSV文字列の配列 または CSVデータの配列
 * @returns マージされた2次元配列
 */
export const mergeCSVs = (csvs: string[] | string[][][]): string[][] => {
  if (Array.isArray(csvs[0])) {
    return mergeArrayedCSVs(csvs as string[][][]);
  }
  return mergeStringifyCSVs(csvs as string[]);
};

const initialOption: Option = {
  isMultiple: false,
  accept: '*',
};

/**
 * ファイルを選択する
 * @param option
 * @returns
 * @example
 *
 * const files = await fetchFiles();
 *
 */
export const fetchFiles: FetchFiles = ({
  isMultiple = false,
  accept = '*',
} = initialOption) => {
  const { promise, resolve, reject } = deferred<{
    status: 'success' | 'error';
    files: File[];
  }>();

  const isAvailable: boolean = !!(
    window.File &&
    window.FileReader &&
    window.FileList &&
    window.Blob
  );

  if (!isAvailable) {
    reject({
      status: 'The File APIs are not fully supported in this browser.',
      files: [],
    });
    return promise;
  }

  const $input: HTMLInputElement = document.createElement('input');
  $input.type = 'file';
  $input.multiple = isMultiple;
  $input.accept = accept;
  $input.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target || !target.files) {
      reject({
        status: 'error',
        files: [],
      });
      return;
    }

    const files = [...target.files];
    resolve({
      status: 'success',
      files,
    });
  };
  $input.click();

  return promise;
};
