import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 启动Mock Service Worker（仅开发环境）
if (import.meta.env.DEV) {
  import('./mocks/browser').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass',
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
