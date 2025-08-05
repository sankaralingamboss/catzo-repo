import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Logo from './Logo';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <Logo size="md" />
            
            <div className="mt-8 mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-4">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
              
              {this.state.error && (
                <details className="text-left bg-gray-50 rounded-lg p-4 mb-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                    Error Details
                  </summary>
                  <code className="text-xs text-red-600 break-all">
                    {this.state.error.message}
                  </code>
                </details>
              )}
            </div>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Reload Page
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-6">
              If the problem persists, please contact support at{' '}
              <a href="mailto:catzowithao@gmail.com" className="text-orange-500 hover:underline">
                catzowithao@gmail.com
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;