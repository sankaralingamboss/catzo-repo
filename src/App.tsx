import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import ProductCatalog from './components/ProductCatalog';
import LoadingSpinner from './components/LoadingSpinner';
import { useApp } from './context/AppContext';

const AppContent: React.FC = () => {
  const { user, authLoading } = useApp();
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'catalog'>('landing');

  // Check for demo user in localStorage
  useEffect(() => {
    const demoUser = localStorage.getItem('demo-user');
    if (demoUser && !user) {
      // Demo mode is active, but we'll let the auth hook handle it
    }
  }, [user]);

  // Show loading spinner while checking authentication
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // If user is logged in, show catalog
  if (user) {
    return <ProductCatalog />;
  }

  // Show appropriate page based on state
  switch (currentPage) {
    case 'landing':
      return <LandingPage onGetStarted={() => setCurrentPage('login')} />;
    case 'login':
      return <LoginForm onBack={() => setCurrentPage('landing')} />;
    default:
      return <LandingPage onGetStarted={() => setCurrentPage('login')} />;
  }
};

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;