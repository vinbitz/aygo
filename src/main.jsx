import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ProProvider } from './state/pro';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProProvider>
      <App />
    </ProProvider>
  </React.StrictMode>,
);
