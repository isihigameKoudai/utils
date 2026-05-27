import * as v from 'valibot';

export const databaseItemSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1, 'id is required')),
  label: v.pipe(v.string(), v.minLength(1, 'label is required')),
  previewUrl: v.nullable(v.string()),
  values: v.pipe(
    v.array(v.number()),
    v.minLength(1, 'values must not be empty'),
  ),
  type: v.picklist(['text', 'file']),
});
