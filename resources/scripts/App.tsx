// =============================================================================
// App.tsx — Root application component with routing
// =============================================================================

import React, { useState } from 'react';
import Dashboard from './components/theme/Dashboard';
import LoginPage from './components/theme/LoginPage';

type Page = 'login' | 'dashboard';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (currentPage === 'login') {
    return (
      <LoginPage
        onLogin={(data) => {
          console.log('Login:', data);
          setCurrentPage('dashboard');
        }}
      />
    );
  }

  return <Dashboard />;
};

export default App;
