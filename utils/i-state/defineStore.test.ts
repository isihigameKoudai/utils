import { describe, it, expect } from 'vitest';
import { defineStore } from './defineStore';

describe('defineStore', () => {
  describe('store creation', () => {
    it('should create store with correct structure', () => {
      const store = defineStore({
        state: { count: 0 },
        queries: {},
        actions: {}
      });

      expect(store).toHaveProperty('useStore');
    });
  });

  describe('store configuration', () => {
    it('should accept initial state', () => {
      const initialState = { count: 0 };
      const store = defineStore({
        state: initialState,
        queries: {},
        actions: {}
      });

      expect(store).toBeDefined();
    });

    it('should accept queries configuration', () => {
      const store = defineStore({
        state: { count: 0 },
        queries: {
          doubled: (state) => state.count * 2
        },
        actions: {}
      });

      expect(store).toBeDefined();
    });

    it('should accept actions configuration', () => {
      const store = defineStore({
        state: { count: 0 },
        queries: {},
        actions: {
          increment: ({ state, dispatch }) => dispatch('count', state.count + 1)
        }
      });

      expect(store).toBeDefined();
    });
  });

  describe('type safety', () => {
    it('should maintain type safety for state', () => {
      interface TestState {
        count: number;
        text: string;
      }

      const store = defineStore<TestState, any, any>({
        state: { count: 0, text: '' },
        queries: {},
        actions: {}
      });

      expect(store).toBeDefined();
    });

    it('should maintain type safety for queries', () => {
      const store = defineStore({
        state: { count: 0 },
        queries: {
          doubled: (state) => state.count * 2,
          isPositive: (state) => state.count > 0
        },
        actions: {}
      });

      expect(store).toBeDefined();
    });

    it('should maintain type safety for actions', () => {
      const store = defineStore({
        state: { count: 0 },
        queries: {},
        actions: {
          increment: ({ state, dispatch }) => dispatch('count', state.count + 1),
          setValue: ({ dispatch }, value: number) => dispatch('count', value)
        }
      });

      expect(store).toBeDefined();
    });

    it('should maintain payload type safety when using generics', () => {
      interface TestState {
        count: number;
      }

      type TestQueries = {
        doubled: (state: TestState) => number;
      }

      type TestActions = {
        setValue: (context: any, value: number) => void;
        setMultiple: (context: any, a: number, b: string) => void;
      }

      // ジェネリクスを指定した場合でもactionのpayload型が維持されるか確認
      const store = defineStore<TestState, TestQueries, TestActions>({
        state: { count: 0 },
        queries: {
          doubled: (state) => state.count * 2
        },
        actions: {
          setValue: ({ dispatch }, value: number) => dispatch('count', value),
          setMultiple: ({ dispatch }, a: number, b: string) => {
            dispatch('count', a);
            console.log(b);
          }
        }
      });

      expect(store).toBeDefined();
    });
  });
});
