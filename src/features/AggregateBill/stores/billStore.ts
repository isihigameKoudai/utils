import { defineStore } from '@/utils/i-state';
import type { Brand } from '../types/brand';
import { BRAND } from '../constants/brand';
import { csv2array, fetchFiles } from '@/utils/file';
import { fromEntries } from '@/utils/object';
import { CSV } from '@/utils/file/csv';
import { isTruthy } from '@/utils/guards';

type BrandState = {
  [key in Brand]: CSV | null;
}

type BillState = {
  totalRecords: string[][];
} & BrandState;

const initialState = {
  totalRecords: [] as string[][],
  ...fromEntries<{ [key in Brand]: CSV | null }>(
    Object.values(BRAND).map(brand => [
      brand.value,
      null
    ])
  )
} satisfies BillState;

export const BillStore = defineStore({
  state: initialState,
  queries: {
    totalRecords: (state) => state.totalRecords,
    ...fromEntries<{ [key in `${Brand}Records`]: (state: BillState) => CSV | null }>(
    Object.values(BRAND).map(brand => [
      `${brand.value}Records`,
      (state) => state[brand.value as Brand]
    ])),
    isEmptyAllRecords: (state) => Object.values(BRAND).every(brand => !state[brand.value]?.value.length),
  },
  actions: {
    async fetchCSVRecords({ dispatch }, { brand }: { brand: Brand }) {
      try {
        const { files } = await fetchFiles({
          isMultiple: true,
          accept: '.csv'
        });
        const records = csv2array(await files[0].text());
        dispatch(brand, new CSV(records));
      } catch (error) {
        console.error(error);
      }
    },
    adaptTotalRecords({ dispatch, queries }) {
      const allRecords = Object.values(BRAND)
        .map(brand => {
          const records = queries[`${brand.value}Records`];
          if (!records) {
            return null;
          }
          return records.getColumns(BRAND[brand.value].columns);
        })
        .filter<string[][]>(isTruthy);
      if (allRecords.length === 0) {
        throw new Error('集計するデータがありません');
      }
      dispatch('totalRecords', allRecords.flat() as string[][]);
    }
  },
});
