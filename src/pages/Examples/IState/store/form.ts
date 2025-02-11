import { defineStore } from '@/packages/i-state';

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

export const formStore = defineStore({
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
      
      dispatch('isSubmitting', false);
    },
  },
});
