import { describe, it, expect } from 'vitest';
import {
  isFunction,
  isPromiseFunction,
  isPromise,
  isError,
  isEmpty,
} from './is';

describe('isFunction', () => {
  it('関数を正しく判定できる', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction(async () => {})).toBe(true);
  });

  it('関数以外を正しく判定できる', () => {
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction('function')).toBe(false);
    expect(isFunction(123)).toBe(false);
    expect(isFunction({})).toBe(false);
  });
});

describe('isPromiseFunction', () => {
  it('Promiseを返す関数を正しく判定できる', () => {
    expect(isPromiseFunction(async () => {})).toBe(true);
    expect(isPromiseFunction(() => new Promise(() => {}))).toBe(true);
  });

  it('Promiseを返さない関数を正しく判定できる', () => {
    expect(isPromiseFunction(() => {})).toBe(false);
    expect(isPromiseFunction(() => 123)).toBe(false);
  });

  it('関数以外を正しく判定できる', () => {
    expect(isPromiseFunction(null)).toBe(false);
    expect(isPromiseFunction(undefined)).toBe(false);
    expect(isPromiseFunction('function')).toBe(false);
  });
});

describe('isPromise', () => {
  it('Promiseを正しく判定できる', () => {
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise(new Promise(() => {}))).toBe(true);
  });

  it('Promise以外を正しく判定できる', () => {
    expect(isPromise(null)).toBe(false);
    expect(isPromise(undefined)).toBe(false);
    expect(isPromise({})).toBe(false);
    expect(isPromise(() => {})).toBe(false);
  });
});

describe('isError', () => {
  it('Errorを正しく判定できる', () => {
    expect(isError(new Error())).toBe(true);
    expect(isError(new TypeError())).toBe(true);
    expect(isError(new SyntaxError())).toBe(true);
  });

  it('Error以外を正しく判定できる', () => {
    expect(isError(null)).toBe(false);
    expect(isError(undefined)).toBe(false);
    expect(isError({})).toBe(false);
    expect(isError('error')).toBe(false);
  });
});

describe('isEmpty', () => {
  it('空の値を正しく判定できる', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(0)).toBe(true);
    expect(isEmpty(false)).toBe(true);
    expect(isEmpty(new String(''))).toBe(true);
    expect(isEmpty(new Boolean(true))).toBe(true);
  });

  it('空でない値を正しく判定できる', () => {
    expect(isEmpty({ a: 1 })).toBe(false);
    expect(isEmpty([1, 2])).toBe(false);
    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty(new Map().set('key', 'value'))).toBe(false);
    expect(isEmpty(new Set([1, 2]))).toBe(false);
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty(true)).toBe(false);
    expect(isEmpty(new String('hello'))).toBe(false);
  });
});
