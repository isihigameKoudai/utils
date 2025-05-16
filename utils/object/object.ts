/**
 * Object.fromEntriesを型セーフにした関数
 */
export const fromEntries = <T extends Record<string, unknown>>(entries: [string, T[keyof T]][]): T => {
  return Object.fromEntries(entries) as T;
};
