import type { Dayjs } from 'dayjs';

import { csv2array, fetchFiles } from '@/utils/file/file';
import { defineStore } from '@/utils/i-state';

import { Bill, type BillProps } from '../models/Bill';

import type { SortKey, SortOrder } from './type';

type GroupingType = 'none' | 'store' | 'month';

type BillSummaryState = {
  summaryRecords: BillProps[];
  sort: {
    target: SortKey;
    order: SortOrder;
  };
  groupingType: GroupingType;
};

const initialState: BillSummaryState = {
  summaryRecords: [] as BillSummaryState['summaryRecords'],
  sort: {
    target: 'date',
    order: 'desc',
  },
  groupingType: 'none',
};

export const BillSummaryStore = defineStore({
  state: initialState,
  queries: {
    sort: (state) => state.sort,
    groupingType: (state) => state.groupingType,
    summaryRecords: (state) => {
      const records = state.summaryRecords
        .slice(1)
        .filter((record) => !Bill.isEmpty(record))
        .map((record) => new Bill(record));

      if (state.groupingType === 'none') {
        return records;
      }

      const groupedRecords = records.reduce(
        (acc, record) => {
          let key: string;
          switch (state.groupingType) {
            case 'store':
              key = record.store;
              break;
            case 'month':
              key = record.date.format('YYYY-MM');
              break;
            default:
              key = record.store;
          }

          const existingRecord = acc[key];

          return {
            ...acc,
            [key]: existingRecord
              ? {
                  date: record.date,
                  store: state.groupingType === 'store' ? key : '集計',
                  amount: existingRecord.amount + record.amount,
                }
              : {
                  date: record.date,
                  store: state.groupingType === 'store' ? key : '集計',
                  amount: record.amount,
                },
          };
        },
        {} as Record<string, { date: Dayjs; store: string; amount: number }>,
      );

      return Object.values(groupedRecords).map(
        (record) =>
          new Bill([
            record.date.format('YYYY-MM-DD'),
            record.store,
            record.amount.toString(),
          ]),
      );
    },
    isEmptySummaryRecords: (state) => state.summaryRecords.length <= 0,
  },
  actions: {
    async loadSummaryRecords({ dispatch }) {
      try {
        const { files } = await fetchFiles({
          isMultiple: false,
          accept: '.csv',
        });
        const records = csv2array(await files[0].text());
        dispatch('summaryRecords', records as BillProps[]);
      } catch (error) {
        console.error('CSVファイルの読み込みに失敗しました:', error);
        throw error;
      }
    },
    setSort({ dispatch }, payload: BillSummaryState['sort']) {
      dispatch('sort', payload);
    },
    setGroupingType({ dispatch }, groupingType: GroupingType) {
      dispatch('groupingType', groupingType);
    },
  },
});
