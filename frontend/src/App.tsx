import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AuthWrapper from './components/AuthWrapper';
import ContentGenerator from './components/ContentGenerator'; // Import your content generator component
import './App.css';

// Import your existing content generator component
// import YourContentGeneratorComponent from './components/YourContentGeneratorComponent';

function App() {
  return (
    <AuthProvider>
      <AuthWrapper>
        <ContentGenerator />
      </AuthWrapper>
    </AuthProvider>
  );
}

export default App;