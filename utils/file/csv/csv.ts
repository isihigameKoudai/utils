export class CSV<C extends string = string> {
  /**
   * 元となるCSVデータ
   * 
   * @example
   * const csv = [
   *  ['header1', 'header2', 'header3'],
   *  ['value1-1', 'value1-2', 'value1-3'],
   *  ['value2-1', 'value2-2', 'value2-3'],
   * ];
   */
  readonly _value: string[][];

  /**
   * 
   * Mapを使ったCSVデータ
   * 
   * @example
   * const csv = [
   *  new Map<string, string>([['header1', 'value1-1'], ['header2', 'value1-2'], ['header3', 'value1-3']]),
   *  new Map<string, string>([['header1', 'value2-1'], ['header2', 'value2-2'], ['header3', 'value2-3']]),
   * ];
   */
  private _mapList: Map<C, string>[];

  constructor(originCsv: string[][]) {
    this.validate(originCsv);

    this._value = originCsv;
    this._mapList = this.createMap(originCsv);
  }

  get value() {
    return this._value;
  }

  get headers() {
    return this._value[0];
  }

  /**
   * CSVデータに該当しない場合エラーにする
   * 
   * ・カラムの数が一致しない場合
   */
  validate(csv: string[][]) {
    // カラムの数が一致しない場合
    const hasDiffColumnCount = csv.some((row) => row.length !== csv[0].length);
    if (hasDiffColumnCount) {
      throw new Error('The number of columns does not match');
    }
  }

  createMap(csv: string[][]): Map<C, string>[] {
    return csv.slice(1).map((row) => {
      return new Map<C, string>(row.map((value, index) => [this.headers[index] as C, value]));
    });
  }

  /**
   * @example
   * const csv = new Map<{'header1' | 'header2' | 'header3'}>([
   *  ['header1', 'header2', 'header3'],
   *  ['value1-1', 'value1-2', 'value1-3'],
   *  ['value2-1', 'value2-2', 'value2-3'],
   * ]);
   * 
   * const record = csv.getRecord('header1', 'value1-1');
   * => ['value1-1', 'value1-2', 'value1-3']
   */
  getRecords(key: C, where: string) {
    const targets = this._mapList.filter((map) => map.get(key) === where);
    if (targets.length === 0) {
      throw new Error('Record not found');
    }
    return targets.map((map) => map.get(key) || '');
  }

  /**
   * @example
   * const csv = new Map<{'header1' | 'header2' | 'header3'}>([
   *  ['header1', 'header2', 'header3'],
   *  ['value1-1', 'value1-2', 'value1-3'],
   *  ['value2-1', 'value2-2', 'value2-3'],
   * ]);
   * 
   * const columns = csv.getColumns(['header2', 'header3']);
   * => [
   *  ['value1-2', 'value1-3'],
   *  ['value2-2', 'value2-3'],
   * ]
   */
  getColumns(keys: C[]): string[][] {
    return this._mapList.map((map) => {
      return keys.map((key) => map.get(key) || '');
    });
  }
}
