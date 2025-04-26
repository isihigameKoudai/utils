import React, { ChangeEvent, FormEvent } from 'react';

import { styled } from '@/utils/ui/styled';
import { ThemeContainer } from './defaultTheme';

import { counterStore } from './store/counter';
import { todoStore } from './store/todo';
import { formStore } from './store/form';

// スタイル付きコンポーネント
const Container = styled('div')({
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
});

const Section = styled('section')({
  marginBottom: '40px',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
});

const Button = styled('button')({
  margin: '0 5px',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#007bff',
  color: 'white',
  cursor: 'pointer',
});

const Input = styled('input')({
  margin: '5px 0',
  padding: '8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  width: '100%',
  maxWidth: '300px',
});

const ErrorText = styled('span')({
  color: 'red',
  fontSize: '14px',
  marginLeft: '5px',
});

const Counter = () => {
  const { state: counterState, queries: counterQueries, actions: counterActions } = counterStore.useStore();

  return (
    <Section>
      <h2>1. シンプルなカウンター（ローカルstate: useStore）</h2>
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
  )
};

const Todo = () => {
  const {
    state: todoState,
    queries: todoQueries,
    actions: todoActions
  } = todoStore.useStore();

  return (
    <Section>
      <h2>2. TODOリスト（useContainer使用）</h2>
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
  )
}


// メインコンポーネント
const IStateExample: React.FC = () => {
  
  const { state: formState, queries: formQueries, actions: formActions } = formStore.useStore();
 
  const { theme } = ThemeContainer.useContainer();
  console.log(theme);
  return (
    <Container>
      <h1>i-state Examples</h1>
      <Counter />
      <Todo />
      
      <Section>
        <h2>3. フォーム状態管理（親コンポーネントローカルステート: useStore）</h2>
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
