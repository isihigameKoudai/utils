import {
  defineStore,
  type ActionsProps,
  type QueriesProps,
} from '@/utils/i-state';
import type { Brand } from '../types/brand';
import { BRAND } from '../constants/brand';
import {
  array2csv,
  csv2array,
  fetchFiles,
  mergeCSVs,
  readCsvFileAsText,
} from '@/utils/file';
import { fromEntries } from '@/utils/object';
import { CSV } from '@/utils/file/csv/csv';
import { isTruthy } from '@/utils/guards';
import { Bill, type BillProps } from '../models/Bill';
import { normalizeBrandRows } from './normalizer';

type BrandState = {
  [key in Brand]: CSV | null;
};

type BillState = {
  totalRecords: BillProps[];
} & BrandState;

const initialState = {
  totalRecords: [] as BillState['totalRecords'],
  ...fromEntries<{ [key in Brand]: CSV | null }>(
    Object.values(BRAND).map((brand) => [brand.value, null]),
  ),
} satisfies BillState;

const queries = {
  totalRecords: (state) =>
    state.totalRecords
      .filter((record) => !Bill.isEmpty(record))
      .map((record) => new Bill(record)),
  ...fromEntries<{
    [key in `${Brand}Records`]: (state: BillState) => CSV | null;
  }>(
    Object.values(BRAND).map((brand) => [
      `${brand.value}Records`,
      (state) => state[brand.value as Brand],
    ]),
  ),
  isEmptyAllRecords: (state) =>
    Object.values(BRAND).every((brand) => !state[brand.value]?.value.length),
  isEmptyTotalRecords: (state) => state.totalRecords.length <= 0,
} satisfies QueriesProps<BillState>;

const actions = {
  async fetchCSVFiles({ dispatch }, { brand }: { brand: Brand }) {
    try {
      const { files } = await fetchFiles({
        isMultiple: true,
        accept: '.csv',
      });
      const records = await Promise.all(
        files.map(async (file) => csv2array(await readCsvFileAsText(file))),
      );
      const mergedRecords = mergeCSVs(records);
      const hasDiffColumnCount = mergedRecords.some(
        (row) => row.length !== mergedRecords[0].length,
      );
      console.log(mergedRecords);
      if (hasDiffColumnCount) {
        const invalidRecords = mergedRecords.filter(
          (row) => row.length !== mergedRecords[0].length,
        );
        console.table(invalidRecords);
        throw new Error('カラム数が一致しません');
      }
      dispatch(brand, new CSV(mergedRecords));
    } catch (error) {
      console.error(error);
    }
  },
  adaptTotalRecords({ dispatch, queries }) {
    const allRecords = Object.values(BRAND)
      .map((brand) => {
        const records = queries[`${brand.value}Records`];
        if (!records) {
          return null;
        }
        const brandColumns = Array.from(BRAND[brand.value].columns);
        const brandRows = records.getColumns(brandColumns);
        return normalizeBrandRows(brand.value as Brand, brandRows);
      })
      .filter<BillProps[]>(isTruthy);
    if (allRecords.length === 0) {
      throw new Error('集計するデータがありません');
    }
    dispatch('totalRecords', allRecords.flat() as BillState['totalRecords']);
  },
  saveTotalRecords({ queries }) {
    try {
      const totalRecords = queries.totalRecords as Bill[];
      const isEmptyTotalRecords = queries.isEmptyTotalRecords;

      if (isEmptyTotalRecords) {
        throw new Error('保存するデータがありません');
      }

      // CSV文字列を生成
      const csvContent = array2csv([
        ['date', 'store', 'amount'],
        ...totalRecords.map((bill) => [
          bill.dateLabel, // yyyy-mm-dd形式
          bill.store,
          bill.amount.toString(),
        ]),
      ]);

      const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
      // Blobを作成してダウンロード
      const blob = new Blob([bom, csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
          'download',
          `total_records_${new Date().toISOString().split('T')[0]}.csv`,
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('CSVファイルの保存に失敗しました:', error);
      throw error;
    }
  },
} satisfies ActionsProps<BillState, typeof queries>;

export const BillStore = defineStore({
  state: initialState,
  queries,
  actions,
});
