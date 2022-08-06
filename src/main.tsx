import React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App'

const $root = document.getElementById('root');
const root = createRoot($root!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
