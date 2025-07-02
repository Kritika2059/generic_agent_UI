import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './Auth/LoginForm';
import SignupForm from './Auth/SignupForm';
import PlatformSetup from './Auth/PlatformSetup';

interface AuthWrapperProps {
  children: React.ReactNode;
}

type AuthState = 'login' | 'signup' | 'platformSetup';

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const [authState, setAuthState] = useState<AuthState>('login');
  const [signupUserData, setSignupUserData] = useState<{id: string, name: string, email: string} | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    // Handle signup success - move to platform setup
    const handleSignupSuccess = (userData: {id: string, name: string, email: string}) => {
      console.log('Signup success, user data:', userData); // Add this for debugging
      setSignupUserData(userData);
      setAuthState('platformSetup');
    };

    // Handle platform setup completion - move to login
    const handlePlatformSetupComplete = async (platformData: { [key: string]: string }) => {
      try {
        // Platform data is already saved to the database in PlatformSetup component
        // Just redirect to login
        setAuthState('login');
        setSignupUserData(null);
      } catch (error) {
        console.error('Platform setup completion error:', error);
        // Handle error if needed
      }
    };

    // Render based on current auth state
    switch (authState) {
      case 'signup':
        return (
          <SignupForm 
            onSwitchToLogin={() => setAuthState('login')} 
            onSignupSuccess={handleSignupSuccess}
          />
        );
      
      case 'platformSetup':
        return (
          <PlatformSetup 
            userId={signupUserData?.id} // Pass the user ID
            onComplete={handlePlatformSetupComplete}
            onBack={() => setAuthState('signup')}
            onNavigateToLogin={() => setAuthState('login')} 
          />
        );
      
      default: // 'login'
        return (
          <LoginForm 
            onLogin={(userData) => {
              // handle login success if needed
            }} 
            onSwitchToSignup={() => setAuthState('signup')} 
          />
        );
    }
  }

  // User is authenticated, show the main app with header
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with user info and logout */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Content Generator
              </h1>
              {user.role === 'admin' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Admin
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome, <span className="font-medium">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default AuthWrapper;