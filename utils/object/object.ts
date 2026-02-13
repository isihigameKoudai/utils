/**
 * Object.fromEntriesを型セーフにした関数
 */
export const fromEntries = <
  T extends Record<string, unknown>,
  K extends keyof T = keyof T,
>(
  entries: [K, T[K]][],
): T => {
  return Object.fromEntries(entries) as T;
};

/**
 * オブジェクトを再帰的にフリーズする
 * @param obj - フリーズするオブジェクト
 * @returns フリーズされたオブジェクト
 */
export const deepFreeze = <T extends Record<string, unknown>>(
  obj: T,
): Readonly<T> => {
  // プリミティブ値やnullの場合はそのまま返す
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 配列の場合
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      if (typeof item === 'object' && item !== null) {
        deepFreeze(item as Record<string, unknown>);
      }
    });
    return Object.freeze(obj);
  }

  // オブジェクトの場合：各プロパティを再帰的にフリーズ
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value as Record<string, unknown>);
    }
  });

  return Object.freeze(obj);
};

/**
 * オブジェクトのプロパティからイミュータブルなプロパティ記述子を生成する
 */
const immutarize = <T extends Record<string, unknown>>(
  source: T,
  key: keyof T & string,
): PropertyDescriptor => {
  const descriptor = Object.getOwnPropertyDescriptor(source, key);

  if (!descriptor) {
    throw new Error(
      `Property "${key}" not found in source object. This object has ${Object.keys(
        source,
      ).join(', ')}`,
    );
  }

  // getterがある場合はそのまま引き継ぎ
  if (descriptor.get) {
    return {
      enumerable: true,
      configurable: false,
      get: descriptor.get,
    };
  }

  // 関数の場合はメソッドとして保持する
  if (typeof descriptor.value === 'function') {
    return {
      enumerable: true,
      configurable: false,
      writable: false,
      value: descriptor.value,
    };
  }

  // 値の場合はwritable: falseにする
  return {
    enumerable: true,
    configurable: false,
    writable: false,
    value: descriptor.value,
  };
};

/**
 * getterを保持したままプロパティをマージし、新しいイミュータブルなオブジェクト（prototypeなし）を作成する
 * @param sources - マージするソースオブジェクトのリスト
 * @returns プロトタイプを持たない新しく作成されたオブジェクト
 * @example
 * const obj = createImmutableObject(
 *   { a: 1 },
 *   { b: 2 },
 *   { get c() { return 3; } }
 * );
 * console.log(obj); // { a: 1, b: 2, c: 3 }
 * console.log(Object.getPrototypeOf(obj)); // null
 */
export const createImmutableObject = <T extends Record<string, unknown>>(
  ...sources: Record<string, unknown>[]
): T => {
  const allDescriptors: PropertyDescriptorMap = {};

  for (const source of sources) {
    for (const key of Object.keys(source)) {
      const descriptor = immutarize(source, key);
      if (descriptor) {
        allDescriptors[key] = descriptor;
      }
    }
  }

  return Object.create(null, allDescriptors) as T;
};
