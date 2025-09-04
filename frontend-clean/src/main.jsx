import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import i18n from './i18n/translations';
import { I18nextProvider } from 'react-i18next';

console.log("main.jsx loaded");

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);