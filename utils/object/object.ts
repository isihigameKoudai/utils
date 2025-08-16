/**
 * Object.fromEntriesを型セーフにした関数
 */
export const fromEntries = <T extends Record<string, unknown>, K extends keyof T = keyof T>(
  entries: [K, T[K]][]
): T => {
  return Object.fromEntries(entries) as T;
};
