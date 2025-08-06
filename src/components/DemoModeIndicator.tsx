import React from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const DemoModeIndicator: React.FC = () => {
  if (supabase) return null; // Only show in demo mode

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>Demo Mode:</strong> You're using the app without Supabase connection. 
            Data is stored locally and will be lost on refresh. 
            Connect to Supabase for full functionality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoModeIndicator;