import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 启动Mock Service Worker（开发和生产环境都启用，用于演示）
import('./mocks/browser').then(({ worker }) => {
  worker.start({
    onUnhandledRequest: 'bypass',
  });
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
