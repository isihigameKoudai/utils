import { defineStore } from '../../../../../utils/i-state';

// 2. TODOリスト
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export const todoStore = defineStore({
  state: {
    todos: [] as Todo[],
    nextId: 1,
  },
  queries: {
    completedTodos: (state) => state.todos.filter((todo) => todo.completed),
    incompleteTodos: (state) => state.todos.filter((todo) => !todo.completed),
    totalCount: (state) => state.todos.length,
    strTotalNum: (state) => state.todos.length.toString(),
  },
  actions: {
    addTodo: ({ state, dispatch }, text: string) => {
      const newTodo: Todo = {
        id: state.nextId,
        text,
        completed: false,
      };
      dispatch('todos', [...state.todos, newTodo]);
      dispatch('nextId', state.nextId + 1);
    },
    toggleTodo: ({ state, dispatch }, id: number) => {
      const newTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      dispatch('todos', newTodos);
    },
    removeTodo: ({ state, dispatch }, id: number) => {
      dispatch('todos', state.todos.filter((todo) => todo.id !== id));
    },
  },
});
