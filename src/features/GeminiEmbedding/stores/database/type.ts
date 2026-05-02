import type { DatabaseItemParams } from '../../models/databaseItem';

export type DatabaseState = {
  items: DatabaseItemParams[];
  searchResults: Array<DatabaseItemParams & { similarity: number }> | null;
  searchOrder: 'closest' | 'furthest';
};
