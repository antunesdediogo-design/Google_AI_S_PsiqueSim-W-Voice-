import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { AuthMode } from '../types';
import GoogleIcon from '../components/icons/GoogleIcon';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

interface AuthPageProps {
  mode: AuthMode;
  onLoginSuccess: () => void;
  onSwitchMode: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ mode: initialMode, onLoginSuccess, onSwitchMode }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    const userName = mode === 'signup' ? name : 'Demo User';
    if(email && password && userName) {
        login(userName, email);
        onLoginSuccess();
    }
  };

  const handleGoogleSignIn = () => {
    // Mock Google sign-in
    login('Google User', 'user@google.com');
    onLoginSuccess();
  };

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'login' ? 'signup' : 'login');
  };

  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen bg-soft-blue/20 flex items-center justify-center p-4">
       <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 relative">
          <button
            onClick={onSwitchMode}
            className="absolute top-4 left-4 text-gray-400 hover:text-dark-navy p-2 rounded-full transition-colors"
            aria-label="Back to home page"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          
          <h1 className="text-2xl font-bold font-heading text-center text-dark-navy mb-2">
            PsiqueSim
          </h1>
          <h2 className="text-xl font-semibold text-center text-dark-navy mb-6">
            {isLogin ? t('auth.loginTitle') : t('auth.signupTitle')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {t('auth.nameLabel')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-soft-blue focus:border-soft-blue"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth.emailLabel')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-soft-blue focus:border-soft-blue"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.passwordLabel')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-soft-blue focus:border-soft-blue"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-accent-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange"
              >
                {isLogin ? t('auth.loginButton') : t('auth.signupButton')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {t('auth.or')}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <GoogleIcon className="w-5 h-5 mr-3" />
                {t('auth.googleSignIn')}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button onClick={toggleMode} className="text-sm text-dark-navy hover:underline">
              {isLogin ? t('auth.switch_to_signup') : t('auth.switch_to_login')}
            </button>
          </div>
        </div>
        </div>
    </div>
  );
};

export default AuthPage;