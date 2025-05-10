import fs from 'fs';
import { promisify } from 'util';

// ファイル読み書き系
export const readFileAsync = promisify(fs.readFile);
export const writeFileAsync = promisify(fs.writeFile);
export const appendFileAsync = promisify(fs.appendFile);
export const copyFileAsync = promisify(fs.copyFile);
export const truncateAsync = promisify(fs.truncate);
export const unlinkAsync = promisify(fs.unlink);
export const rmAsync = promisify(fs.rm);

// ディレクトリ操作系
export const mkdirAsync = promisify(fs.mkdir);
export const rmdirAsync = promisify(fs.rmdir);
export const readdirAsync = promisify(fs.readdir);
export const opendirAsync = promisify(fs.opendir);

// ファイルパス系
export const statAsync = promisify(fs.stat);
export const existsAsync = promisify(fs.exists);
export const lstatAsync = promisify(fs.lstat);
export const readlinkAsync = promisify(fs.readlink);
export const realpathAsync = promisify(fs.realpath);
export const symlinkAsync = promisify(fs.symlink);
export const chmodAsync = promisify(fs.chmod);
export const chownAsync = promisify(fs.chown);

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
