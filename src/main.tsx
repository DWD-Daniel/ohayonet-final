import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // 1. IMPORT THIS
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* 2. WRAP YOUR APP IN THIS */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);