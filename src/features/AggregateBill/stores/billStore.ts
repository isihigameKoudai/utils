import { defineStore } from '@/utils/i-state';
import type { Brand } from '../types/brand';
import { BRANDS } from '../constants/brand';
import { csv2array, fetchFiles } from '@/utils/file';
import { fromEntries } from '@/utils/object';
import { CSV } from '@/utils/file/csv';

type BrandState = {
  [key in Brand]: CSV | null;
}

type BillState = {
  totalRecords: CSV | null;
} & BrandState;

const initialState = {
  totalRecords: null,
  ...fromEntries<{ [key in Brand]: CSV | null }>(
    BRANDS.map(brand => [
      brand,
      null
    ])
  )
} satisfies BillState;

export const BillStore = defineStore({
  state: initialState,
  queries: {
    totalRecords: (state) => state.totalRecords,
    ...fromEntries<{ [key in `${Brand}Records`]: (state: BillState) => CSV | null }>(
    BRANDS.map(brand => [
      `${brand}Records`,
      (state) => state[brand]
    ]))
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
    }
  }
});
