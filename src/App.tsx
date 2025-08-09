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
  
  console.log('App state:', { user, authLoading, currentPage });

  // Check for demo user in localStorage
  useEffect(() => {
    const demoUser = localStorage.getItem('demo-user');
    console.log('Demo user check:', demoUser);
    if (demoUser && !user) {
      // Demo mode is active, but we'll let the auth hook handle it
      console.log('Demo user found in localStorage');
    }
  }, [user]);

  // Show loading spinner while checking authentication
  if (authLoading) {
    console.log('Showing loading spinner');
    return <LoadingSpinner />;
  }

  // If user is logged in, show catalog
  if (user) {
    console.log('User logged in, showing catalog');
    return <ProductCatalog />;
  }

  console.log('Showing page:', currentPage);

  // Show appropriate page based on state
  switch (currentPage) {
    case 'landing':
      return <LandingPage onGetStarted={() => {
        console.log('Get started clicked, navigating to login');
        setCurrentPage('login');
      }} />;
    case 'login':
      return <LoginForm onBack={() => {
        console.log('Back clicked, navigating to landing');
        setCurrentPage('landing');
      }} />;
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