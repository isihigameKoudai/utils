import { createModelFactory } from '@/utils/model/createModel';

import { databaseItemSchema } from './scheme';
import type { DatabaseItem, DatabaseItemParams } from './types';

export const createDatabaseItem = createModelFactory<
  DatabaseItemParams,
  DatabaseItem
>({
  schema: databaseItemSchema,
  extension: (params) => ({
    get dimensions() {
      return params.values.length;
    },
    get hasPreview() {
      return params.previewUrl !== null;
    },
    get isText() {
      return params.type === 'text';
    },
    get isFile() {
      return params.type === 'file';
    },
  }),
});

export const isDatabaseItemEmpty = (
  params: Partial<DatabaseItemParams>,
): boolean => {
  return !params.id || !params.values || params.values.length === 0;
};

export const createDatabaseItemParams = (
  partial: Partial<DatabaseItemParams>,
): DatabaseItemParams => ({
  id: partial.id ?? crypto.randomUUID(),
  label: partial.label ?? '',
  previewUrl: partial.previewUrl ?? null,
  values: partial.values ?? [],
  type: partial.type ?? 'text',
});
