import type { InferOutput } from 'valibot';

import type { databaseItemSchema } from './scheme';

export type DatabaseItemParams = InferOutput<typeof databaseItemSchema>;

export type InputMode = DatabaseItemParams['type'];

export type DatabaseItem = DatabaseItemParams & {
  readonly dimensions: number;
  readonly hasPreview: boolean;
  readonly isText: boolean;
  readonly isFile: boolean;
};
