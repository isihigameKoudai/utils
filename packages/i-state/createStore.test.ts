import { describe, test, expect } from 'vitest'
import { createStore } from './createStore'

describe('createStore', () => {
  test('初期状態が正しく設定される', () => {
    const store = createStore({
      state: { count: 0 },
      queries: {},
      actions: {}
    })
    
    const hook = store.useStore()
    expect(hook.state).toEqual({ count: 0 })
  })

  test('queriesが正しく計算される', () => {
    const store = createStore({
      state: { count: 5 },
      queries: {
        doubled: (state) => state.count * 2,
        isPositive: (state) => state.count > 0
      },
      actions: {}
    })

    const hook = store.useStore()
    expect(hook.queries.doubled).toBe(10)
    expect(hook.queries.isPositive).toBe(true)
  })

  test('actionsで状態が更新される', () => {
    const store = createStore({
      state: { count: 0 },
      queries: {},
      actions: {
        increment: ({ state, dispatch }) => {
          dispatch('count', state.count + 1)
        }
      }
    })

    const hook = store.useStore()
    hook.actions.increment()
    expect(hook.state.count).toBe(1)
  })
})
