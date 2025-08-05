import React from 'react';
import Logo from './Logo';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <Logo size="lg" />
        </div>
        <div className="mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your pet paradise...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;