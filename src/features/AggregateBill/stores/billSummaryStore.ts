import { defineStore } from '@/utils/i-state';
import { Bill, BillProps } from '../models/Bill';
import { csv2array, fetchFiles } from '@/utils/file/file';
import type { SortKey, SortOrder } from './type';
import { Dayjs } from 'dayjs';

type BillSummaryState = {
  summaryRecords: BillProps[];
  sort: {
    target: SortKey;
    order: SortOrder;
  };
  isGrouped: boolean;
}

const initialState: BillSummaryState = {
  summaryRecords: [] as BillSummaryState['summaryRecords'],
  sort: {
    target: 'date',
    order: 'desc',
  },
  isGrouped: false,
};

export const BillSummaryStore = defineStore({
  state: initialState,
  queries: {
    sort: (state) => state.sort,
    isGrouped: (state) => state.isGrouped,
    summaryRecords: (state) => {
      const records = state.summaryRecords
        .slice(1)
        .filter(record => !Bill.isEmpty(record))
        .map(record => new Bill(record));
      
      if (state.isGrouped) {
        const groupedRecords = records.reduce((acc, record) => {
          const store = record.store;
          const existingRecord = acc[store];
          
          return {
            ...acc,
            [store]: existingRecord
              ? {
                  date: record.date,
                  store,
                  amount: existingRecord.amount + record.amount,
                }
              : {
                  date: record.date,
                  store,
                  amount: record.amount,
                },
          };
        }, {} as Record<string, { date: Dayjs; store: string; amount: number }>);
        
        return Object.values(groupedRecords)
          .map(record => new Bill([
            record.date.format('YYYY-MM-DD'),
            record.store,
            record.amount.toString(),
          ]));
      }
      
      return records;
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
    },
    toggleGrouping({ dispatch, state }) {
      dispatch('isGrouped', !state.isGrouped);
    }
  },
}); 
