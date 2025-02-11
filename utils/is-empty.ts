/*
 isEmpty({a: 3, b: 5}) // false
 isEmpty([1, 2]) // false
 isEmpty(new Set([1, 2, 2])) // false
 isEmpty((new Map()).set('a', 2)) // false
 isEmpty({}) // true
 isEmpty([]) // true
 isEmpty(new Set()) // true
 isEmpty(new Map()) // true
 isEmpty('abc') // false
 isEmpty('') // true
 isEmpty(0) // true
 isEmpty(1) // true
 isEmpty(true) // true
 isEmpty(Symbol('abc')); // true
 isEmpty(//); // true
 isEmpty(new String('abc')); // false
 isEmpty(new String('')); // true
 isEmpty(new Boolean(true)); // true
 isEmpty(null) // true
 isEmpty(undefined) // true
*/
const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string') {
    return value === '';
  }
  if (typeof value === 'number') {
    return value === 0;
  }
  if (typeof value === 'boolean') {
    return value === false;
  }
  if (typeof value === 'symbol') {
    return value === Symbol();
  }
  if (value instanceof String) {
    return value.toString() === '';
  }
  if (value instanceof Boolean) {
    return value.valueOf() === false;
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }
  if (value instanceof Object) {
    return Object.keys(value).length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
}

export default isEmpty;

