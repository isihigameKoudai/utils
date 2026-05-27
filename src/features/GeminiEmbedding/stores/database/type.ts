import type { DatabaseItemParams } from '../../models/databaseItem';

export type ChromaStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export type DatabaseState = {
  items: DatabaseItemParams[];
  searchResults: Array<DatabaseItemParams & { similarity: number }> | null;
  searchOrder: 'closest' | 'furthest';
  chromaUrl: string;
  chromaCollectionName: string;
  chromaStatus: ChromaStatus;
  chromaError: string | null;
};
