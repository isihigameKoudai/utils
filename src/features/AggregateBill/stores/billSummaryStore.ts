import { defineStore } from '@/utils/i-state';
import { Bill, BillProps } from '../models/Bill';
import { csv2array, fetchFiles } from '@/utils/file/file';
import type { SortKey, SortOrder } from './type';

type BillSummaryState = {
  summaryRecords: BillProps[];
  sort: {
    target: SortKey;
    order: SortOrder;
  }
}

const initialState: BillSummaryState = {
  summaryRecords: [] as BillSummaryState['summaryRecords'],
  sort: {
    target: 'date',
    order: 'desc',
  },
};

export const BillSummaryStore = defineStore({
  state: initialState,
  queries: {
    sort: (state) => state.sort,
    summaryRecords: (state) => {
      const records = state.summaryRecords
        // title行を削除
        .slice(1)
        .filter(record => !Bill.isEmpty(record))
        .map(record => new Bill(record));
      
      return records;
      // return sortByKey(records, state.sort.target, state.sort.order);
    },
    isEmptySummaryRecords: (state) => state.summaryRecords.length <= 0,
  },
  actions: {
    async loadSummaryRecords({ dispatch }) {
      try {
        const { files } = await fetchFiles({
          isMultiple: false,
          accept: '.csv'
        });
        const records = csv2array(await files[0].text());
        console.log(records);
        dispatch('summaryRecords', records as BillProps[]);
      } catch (error) {
        console.error('CSVファイルの読み込みに失敗しました:', error);
        throw error;
      }
    },
    setSort({ dispatch }, payload: BillSummaryState['sort']) {
      dispatch('sort', payload);
    }
  },
}); 
