import React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import './App.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';

// ファイルベースのルーティングを使用するために自動生成されたルートを導入
import { routeTree } from './routes/routeTree.gen'

// ルーターの作成
const router = createRouter({ routeTree })

// Typeエラーを避けるための型宣言
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const $root = document.getElementById('root');
const root = createRoot($root!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
