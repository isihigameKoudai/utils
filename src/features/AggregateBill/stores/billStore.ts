import { defineStore } from '@/utils/i-state';
import { Bill } from '../types/bill';

interface BillState {
  bills: Bill[];
  loading: boolean;
  error: string | null;
}

const initialState: BillState = {
  bills: [],
  loading: false,
  error: null
};

export const BillStore = defineStore({
  state: initialState,
  queries: {
    bills: (state) => state.bills,
    loading: (state) => state.loading,
    error: (state) => state.error
  },
  actions: {
    addBills({ dispatch, state }, bills: Bill[]) {
      dispatch('bills', [...state.bills, ...bills]);
    },
    removeBill({ dispatch, state }, id: string) {
      dispatch('bills', state.bills.filter(bill => bill.id !== id));
    },
    setLoading({ dispatch }, loading: boolean) {
      dispatch('loading', loading);
    },
    setError({ dispatch }, error: string | null) {
      dispatch('error', error);
    }
  }
}); 
