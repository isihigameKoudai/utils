import type { DatabaseState } from './type';

export const initialState: DatabaseState = {
  items: [],
  searchResults: null,
  searchOrder: 'closest',
  chromaUrl: 'http://localhost:8000',
  chromaCollectionName: 'gemini-embeddings',
  chromaStatus: 'disconnected',
  chromaError: null,
};
