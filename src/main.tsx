import React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './Route/tanstack-router'
import './App.css';

const $root = document.getElementById('root');
const root = createRoot($root!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
