import React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import './App.css';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './Route/routeConfig';

const $root = document.getElementById('root');
const root = createRoot($root!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
