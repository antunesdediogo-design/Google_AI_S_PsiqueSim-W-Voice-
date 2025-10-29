
import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ChatSessionPage from './pages/ChatSessionPage';
import type { AuthMode, PatientId } from './types';

type View = 'landing' | 'auth' | 'dashboard' | 'chat';

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [view, setView] = useState<View>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [currentPatientId, setCurrentPatientId] = useState<PatientId | null>(null);

  const handleLoginSuccess = useCallback(() => {
    setView('dashboard');
  }, []);
  
  const navigateToAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setView('auth');
  };

  const handleStartSession = useCallback((patientId: PatientId) => {
    setCurrentPatientId(patientId);
    setView('chat');
  }, []);

  const handleEndSession = useCallback(() => {
    setCurrentPatientId(null);
    setView('dashboard');
  }, []);
  
  const handleLogout = useCallback(() => {
    logout();
    setView('landing');
  }, [logout]);


  if (user) {
    if (view === 'dashboard') {
      return <DashboardPage onStartSession={handleStartSession} onLogout={handleLogout} />;
    }
    if (view === 'chat' && currentPatientId) {
      return <ChatSessionPage patientId={currentPatientId} onEndSession={handleEndSession} />;
    }
    // Default to dashboard if logged in but view is something else
    return <DashboardPage onStartSession={handleStartSession} onLogout={handleLogout} />;
  }

  if (view === 'auth') {
    return <AuthPage mode={authMode} onLoginSuccess={handleLoginSuccess} onSwitchMode={() => setView('landing')} />;
  }

  return <LandingPage onNavigateToAuth={navigateToAuth} />;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="bg-white text-dark-navy font-sans">
          <AppContent />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
