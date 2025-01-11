import React, { ChangeEvent, FormEvent } from 'react';
import { defineStore } from '../../../../packages/i-state/defineStore';
import { styled } from '../../../../packages/ui/styled';
import { Theme } from '../../../../packages/ui/theme';
import { ThemeContainer } from './defaultTheme';

// スタイル付きコンポーネント
const Container = styled('div')((theme: Theme) => ({
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
}));

const Section = styled('section')((theme: Theme) => ({
  marginBottom: '40px',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
}));

const Button = styled('button')((theme: Theme) => ({
  margin: '0 5px',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#007bff',
  color: 'white',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#0056b3',
  },
  ':disabled': {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
}));

const Input = styled('input')((theme: Theme) => ({
  margin: '5px 0',
  padding: '8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  width: '100%',
  maxWidth: '300px',
}));

const ErrorText = styled('span')((theme: Theme) => ({
  color: 'red',
  fontSize: '14px',
  marginLeft: '5px',
}));

// 1. シンプルなカウンター
const counterStore = defineStore({
  state: {
    count: 0,
  },
  queries: {
    isPositive: (state) => state.count > 0,
    isNegative: (state) => state.count < 0,
  },
  actions: {
    increment: ({ state, dispatch }) => {
      dispatch('count', state.count + 1);
    },
    decrement: ({ state, dispatch }) => {
      dispatch('count', state.count - 1);
    },
    reset: ({ dispatch }) => {
      dispatch('count', 0);
    },
  },
});

// 2. TODOリスト
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const todoStore = defineStore({
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

// 3. フォーム状態管理
type FormState = {
  username: string;
  email: string;
  password: string;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
};

type FormErrors = {
  username?: string;
  email?: string;
  password?: string;
};

const formStore = defineStore({
  state: {
    username: '',
    email: '',
    password: '',
    touched: {
      username: false,
      email: false,
      password: false,
    },
    isSubmitting: false,
  },
  queries: {
    errors: (state) => {
      const errors: FormErrors = {};
      
      if (state.username.length < 3) {
        errors.username = 'ユーザー名は3文字以上必要です';
      }
      
      if (!state.email.includes('@')) {
        errors.email = '有効なメールアドレスを入力してください';
      }
      
      if (state.password.length < 6) {
        errors.password = 'パスワードは6文字以上必要です';
      }
      
      return errors;
    },
    isValid: (state) => {
      return (
        state.username.length >= 3 &&
        state.email.includes('@') &&
        state.password.length >= 6
      );
    },
  },
  actions: {
    setField: ({ dispatch }, field: keyof FormState, value: string) => {
      dispatch(field, value);
    },
    setTouched: ({ state, dispatch }, field: string) => {
      dispatch('touched', { ...state.touched, [field]: true });
    },
    submitForm: async ({ state, dispatch, queries }) => {
      if (!queries.isValid) return;
      
      dispatch('isSubmitting', true);
      
      // 擬似的な非同期処理
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', {
        username: state.username,
        email: state.email,
        password: state.password,
      });
      
      dispatch('isSubmitting', false);
    },
  },
});

// メインコンポーネント
const IStateExample: React.FC = () => {
  const { state: counterState, queries: counterQueries, actions: counterActions } = counterStore.useStore();
  const { state: todoState, queries: todoQueries, actions: todoActions } = todoStore.useStore();
  const { state: formState, queries: formQueries, actions: formActions } = formStore.useStore();
  
  return (
    <Container>
      <h1>i-state Examples</h1>
      
      <Section>
        <h2>1. シンプルなカウンター</h2>
        <div>
          <p>現在の値: {counterState.count}</p>
          <p>
            ステータス：
            {counterQueries.isPositive && '正の数'}
            {counterQueries.isNegative && '負の数'}
            {!counterQueries.isPositive && !counterQueries.isNegative && 'ゼロ'}
          </p>
          <Button onClick={() => counterActions.increment()}>増加</Button>
          <Button onClick={() => counterActions.decrement()}>減少</Button>
          <Button onClick={() => counterActions.reset()}>リセット</Button>
        </div>
      </Section>
      
      <Section>
        <h2>2. TODOリスト</h2>
        <div>
          <form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem('todoText') as HTMLInputElement;
              if (input.value.trim()) {
                todoActions.addTodo(input.value.trim());
                input.value = '';
              }
            }}
          >
            <Input
              type="text"
              name="todoText"
              placeholder="新しいTODOを入力"
            />
            <Button type="submit">追加</Button>
          </form>
          
          <div>
            <p>全てのTODO ({todoQueries.totalCount})</p>
            <ul>
              {todoState.todos.map((todo) => (
                <li key={todo.id}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => todoActions.toggleTodo(todo.id)}
                  />
                  <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                    {todo.text}
                  </span>
                  <Button onClick={() => todoActions.removeTodo(todo.id)}>削除</Button>
                </li>
              ))}
            </ul>
            <p>完了済み: {todoQueries.completedTodos.length}</p>
            <p>未完了: {todoQueries.incompleteTodos.length}</p>
          </div>
        </div>
      </Section>
      
      <Section>
        <h2>3. フォーム状態管理</h2>
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            formActions.submitForm();
          }}
        >
          <div>
            <label>
              ユーザー名:
              <Input
                type="text"
                value={formState.username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => formActions.setField('username', e.target.value)}
                onBlur={() => formActions.setTouched('username')}
              />
              {formState.touched.username && formQueries.errors.username && (
                <ErrorText>{formQueries.errors.username}</ErrorText>
              )}
            </label>
          </div>
          
          <div>
            <label>
              メールアドレス:
              <Input
                type="email"
                value={formState.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => formActions.setField('email', e.target.value)}
                onBlur={() => formActions.setTouched('email')}
              />
              {formState.touched.email && formQueries.errors.email && (
                <ErrorText>{formQueries.errors.email}</ErrorText>
              )}
            </label>
          </div>
          
          <div>
            <label>
              パスワード:
              <Input
                type="password"
                value={formState.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => formActions.setField('password', e.target.value)}
                onBlur={() => formActions.setTouched('password')}
              />
              {formState.touched.password && formQueries.errors.password && (
                <ErrorText>{formQueries.errors.password}</ErrorText>
              )}
            </label>
          </div>
          
          <Button
            type="submit"
            disabled={!formQueries.isValid || formState.isSubmitting}
          >
            {formState.isSubmitting ? '送信中...' : '送信'}
          </Button>
        </form>
      </Section>
    </Container>
  );
};

export default () => (
  <ThemeContainer.Provider>
    <IStateExample />
    </ThemeContainer.Provider>
  );
