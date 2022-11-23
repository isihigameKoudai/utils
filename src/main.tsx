import React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import Router from './Router';
import './App.css';

const $root = document.getElementById('root');
const root = createRoot($root!);
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
