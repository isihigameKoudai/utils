import { defineStore } from '@/utils/i-state';
import { Bill, BillProps } from '../models/Bill';
import { sortByKey, sumByKey } from '@/utils/array/array';
import { csv2array } from '@/utils/file/file';
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
        .filter(record => !Bill.isEmpty(record))
        .map(record => new Bill(record));
      
      return sortByKey(records, state.sort.target, state.sort.order);
    },
    isEmptySummaryRecords: (state) => state.summaryRecords.length <= 0,
  },
  actions: {
    async loadSummaryRecords({ dispatch }) {
      try {
        const response = await fetch('/total_records.csv');
        const text = await response.text();
        const records = csv2array(text);
        dispatch('summaryRecords', records.slice(1) as BillSummaryState['summaryRecords']);
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
