// =============================================================================
// index.tsx — Main entry point for Predodactyl Theme
// =============================================================================

import React from 'react';
import ReactDOM from 'react-dom';
import './css/app.css';
import ThemeProvider from './components/theme/ThemeProvider';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('app')
);
