import { Option, FetchFiles } from './type';
import { deferred } from '../promise/promise';

/**
 * CSV形式のテキストを2次元配列に変換する
 * ex: csv2array('a,b,c\nd,e,f\n') => [['a','b','c'],['d','e','f']]
 * 
 * @param csv 
 * @returns 
 */
export const csv2array = (csv: string) =>
  csv
    .replaceAll("\r", "")
    .split("\n")
    .map((row) => row.split(","));

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
        [header[i]]: cur
      };
    }, {})
  ) as T[];
}

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
  return new Promise((resolve, reject) => {
    const isAvailable: boolean = !!(
      window.File &&
      window.FileReader &&
      window.FileList &&
      window.Blob
    );
    if (!isAvailable) {
      reject({
        status: "The File APIs are not fully supported in this browser.",
        files: [],
      });
      return;
    }

    const $input: HTMLInputElement = document.createElement("input");
    $input.type = "file";
    $input.multiple = isMultiple;
    $input.accept = accept;
    $input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target || !target.files) {
        reject({
          status: "error",
          files: [],
        });
        return;
      }

      const files = [...target.files];
      resolve({
        status: "success",
        files,
      });
    };
    $input.click();
  });
};
