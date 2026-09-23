import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ProProvider } from './state/pro';
import './index.css';
import { applyPanelWidth, loadPanelWidth } from './lib/panelWidth';

// Website: bring back the side panel width the user chose last time
applyPanelWidth(loadPanelWidth());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProProvider>
      <App />
    </ProProvider>
  </React.StrictMode>,
);
