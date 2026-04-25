import type { Branded } from './type';

export type { Branded };

export const defineBranded = <T, Brand extends string>(
  value: T,
): Branded<T, Brand> => {
  return value as Branded<T, Brand>;
};

/**
 * バリデーションで担保したBranded型の値を返す
 * @param brand
 * @param validator
 * @returns
 * @example
 * const percent = defineBrandedFactory<number, 'Percentage'>('Percentage', (value) => {
 *   return value >= 0 && value <= 100;
 * });
 *
 * const p1 = percent(10);
 * const p2 = percent(110);
 */
export const defineBrandedFactory = <T, Brand extends string>(
  brand: Brand,
  validator?: (value: T) => boolean,
) => {
  const isBranded = (value: T): value is Branded<T, Brand> => {
    if (!validator) return true;
    return validator(value);
  };

  return (v: T): Branded<T, Brand> => {
    if (!isBranded(v)) throw new Error(`Invalid ${brand}`);

    return v;
  };
};
