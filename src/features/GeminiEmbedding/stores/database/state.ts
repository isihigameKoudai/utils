import type { DatabaseState } from './type';

export const initialState: DatabaseState = {
  items: [],
  searchResults: null,
  searchOrder: 'closest',
};
