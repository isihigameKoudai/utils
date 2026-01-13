import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { routeTree } from './generated/routeTree.gen';
import './index.css';
import './App.css';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

(() => {
  const $root = document.getElementById('root');
  if (!$root) {
    throw new Error('rootが見つかりません');
  }

  const root = createRoot($root);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
})();
