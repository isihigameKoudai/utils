import fs from 'fs';
import { promisify } from 'util';

import { Option, FetchFiles } from './type';

/**
 * ファイルを非同期で読み込む
 * @param {string} path - 読み込むファイルのパス
 * @param {string} [encoding='utf8'] - エンコーディング
 * @returns {Promise<string | Buffer>} ファイルの内容
 * @example
 * // テキストファイルを読み込む
 * const content = await readFileAsync('example.txt');
 * 
 * // バイナリファイルを読み込む
 * const buffer = await readFileAsync('image.png', null);
 */
export const readFileAsync = promisify(fs.readFile);

/**
 * ファイルを非同期で書き込む
 * @param {string} path - 書き込むファイルのパス
 * @param {string | Buffer} data - 書き込むデータ
 * @param {string} [encoding='utf8'] - エンコーディング
 * @returns {Promise<void>}
 * @example
 * // テキストを書き込む
 * await writeFileAsync('example.txt', 'Hello, World!');
 * 
 * // バイナリデータを書き込む
 * await writeFileAsync('image.png', buffer);
 */
export const writeFileAsync = promisify(fs.writeFile);

/**
 * ファイルの末尾に非同期で追記する
 * @param {string} path - 追記するファイルのパス
 * @param {string | Buffer} data - 追記するデータ
 * @param {string} [encoding='utf8'] - エンコーディング
 * @returns {Promise<void>}
 * @example
 * // ログファイルに追記
 * await appendFileAsync('app.log', 'New log entry\n');
 */
export const appendFileAsync = promisify(fs.appendFile);

/**
 * ファイルを非同期でコピーする
 * @param {string} src - コピー元のファイルパス
 * @param {string} dest - コピー先のファイルパス
 * @returns {Promise<void>}
 * @example
 * // ファイルをコピー
 * await copyFileAsync('source.txt', 'destination.txt');
 */
export const copyFileAsync = promisify(fs.copyFile);

/**
 * ファイルを非同期で切り詰める
 * @param {string} path - 切り詰めるファイルのパス
 * @param {number} [len=0] - 切り詰めるサイズ（バイト）
 * @returns {Promise<void>}
 * @example
 * // ファイルを空にする
 * await truncateAsync('example.txt');
 * 
 * // ファイルを100バイトに切り詰める
 * await truncateAsync('example.txt', 100);
 */
export const truncateAsync = promisify(fs.truncate);

/**
 * ファイルを非同期で削除する
 * @param {string} path - 削除するファイルのパス
 * @returns {Promise<void>}
 * @example
 * // ファイルを削除
 * await unlinkAsync('example.txt');
 */
export const unlinkAsync = promisify(fs.unlink);

/**
 * ファイルまたはディレクトリを非同期で削除する
 * @param {string} path - 削除するパス
 * @param {Object} [options] - 削除オプション
 * @returns {Promise<void>}
 * @example
 * // ファイルを削除
 * await rmAsync('example.txt');
 * 
 * // ディレクトリを再帰的に削除
 * await rmAsync('temp', { recursive: true });
 */
export const rmAsync = promisify(fs.rm);

// ディレクトリ操作系
/**
 * ディレクトリを非同期で作成する
 * @param {string} path - 作成するディレクトリのパス
 * @param {Object} [options] - 作成オプション
 * @returns {Promise<void>}
 * @example
 * // ディレクトリを作成
 * await mkdirAsync('new-directory');
 * 
 * // 再帰的にディレクトリを作成
 * await mkdirAsync('parent/child', { recursive: true });
 */
export const mkdirAsync = promisify(fs.mkdir);

/**
 * ディレクトリを非同期で削除する
 * @param {string} path - 削除するディレクトリのパス
 * @returns {Promise<void>}
 * @example
 * // 空のディレクトリを削除
 * await rmdirAsync('empty-directory');
 */
export const rmdirAsync = promisify(fs.rmdir);

/**
 * ディレクトリの内容を非同期で読み込む
 * @param {string} path - 読み込むディレクトリのパス
 * @param {Object} [options] - 読み込みオプション
 * @returns {Promise<string[]>} ディレクトリ内のファイル名の配列
 * @example
 * // ディレクトリの内容を取得
 * const files = await readdirAsync('my-directory');
 * 
 * // withFileTypesオプションを使用
 * const entries = await readdirAsync('my-directory', { withFileTypes: true });
 */
export const readdirAsync = promisify(fs.readdir);

/**
 * ディレクトリを非同期で開く
 * @param {string} path - 開くディレクトリのパス
 * @param {Object} [options] - オプション
 * @returns {Promise<fs.Dir>} ディレクトリオブジェクト
 * @example
 * // ディレクトリを開いて内容を読み込む
 * const dir = await opendirAsync('my-directory');
 * for await (const entry of dir) {
 *   console.log(entry.name);
 * }
 */
export const opendirAsync = promisify(fs.opendir);

// ファイルパス系
/**
 * ファイルの状態情報を非同期で取得する
 * @param {string} path - 対象のパス
 * @returns {Promise<fs.Stats>} ファイルの状態情報
 * @example
 * // ファイルの情報を取得
 * const stats = await statAsync('example.txt');
 * console.log(`Size: ${stats.size} bytes`);
 * console.log(`Created: ${stats.birthtime}`);
 */
export const statAsync = promisify(fs.stat);

/**
 * ファイルまたはディレクトリの存在を非同期で確認する
 * @param {string} path - 確認するパス
 * @returns {Promise<boolean>} 存在する場合はtrue
 * @example
 * // ファイルの存在確認
 * const exists = await existsAsync('example.txt');
 * if (exists) {
 *   console.log('File exists');
 * }
 */
export const existsAsync = promisify(fs.exists);

/**
 * シンボリックリンクの状態情報を非同期で取得する
 * @param {string} path - 対象のパス
 * @returns {Promise<fs.Stats>} リンクの状態情報
 * @example
 * // シンボリックリンクの情報を取得
 * const stats = await lstatAsync('symlink.txt');
 * console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
 */
export const lstatAsync = promisify(fs.lstat);

/**
 * シンボリックリンクの参照先を非同期で読み込む
 * @param {string} path - シンボリックリンクのパス
 * @returns {Promise<string>} 参照先のパス
 * @example
 * // シンボリックリンクの参照先を取得
 * const target = await readlinkAsync('symlink.txt');
 * console.log(`Link points to: ${target}`);
 */
export const readlinkAsync = promisify(fs.readlink);

/**
 * パスの正規化された絶対パスを非同期で取得する
 * @param {string} path - 対象のパス
 * @returns {Promise<string>} 正規化された絶対パス
 * @example
 * // 絶対パスを取得
 * const realPath = await realpathAsync('./symlink.txt');
 * console.log(`Real path: ${realPath}`);
 */
export const realpathAsync = promisify(fs.realpath);

/**
 * シンボリックリンクを非同期で作成する
 * @param {string} target - リンクの参照先
 * @param {string} path - 作成するリンクのパス
 * @returns {Promise<void>}
 * @example
 * // シンボリックリンクを作成
 * await symlinkAsync('target.txt', 'link.txt');
 */
export const symlinkAsync = promisify(fs.symlink);

/**
 * ファイルのパーミッションを非同期で変更する
 * @param {string} path - 対象のパス
 * @param {number} mode - 新しいパーミッション
 * @returns {Promise<void>}
 * @example
 * // 実行権限を付与
 * await chmodAsync('script.sh', 0o755);
 */
export const chmodAsync = promisify(fs.chmod);

/**
 * ファイルの所有者を非同期で変更する
 * @param {string} path - 対象のパス
 * @param {number} uid - ユーザーID
 * @param {number} gid - グループID
 * @returns {Promise<void>}
 * @example
 * // 所有者を変更
 * await chownAsync('file.txt', 1000, 1000);
 */
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

const initialOption: Option = {
  isMultiple: false,
  accept: '*',
};

export const fetchFiles: FetchFiles = async (option = initialOption) => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = option.isMultiple ?? false;
    input.accept = option.accept ?? '*';

    input.onchange = (event) => {
      const files = Array.from((event.target as HTMLInputElement).files || []);
      resolve({
        status: 'success',
        files
      });
    };

    input.click();
  });
};
