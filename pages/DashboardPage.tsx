
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { patients } from '../constants';
import { PatientId } from '../types';

interface DashboardPageProps {
  onStartSession: (patientId: PatientId) => void;
  onLogout: () => void;
}

const DashboardHeader: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const { user } = useAuth();
    const { t } = useLanguage();
    
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold font-heading text-dark-navy">PsiqueSim</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700 hidden sm:inline">{t('dashboard.welcome')}, {user?.name}!</span>
                    <LanguageSwitcher />
                    <button 
                        onClick={onLogout}
                        className="border border-dark-navy text-dark-navy px-4 py-2 rounded-md font-semibold hover:bg-dark-navy hover:text-white transition-colors"
                    >
                        {t('dashboard.logout')}
                    </button>
                </div>
            </div>
        </header>
    );
};


const DashboardPage: React.FC<DashboardPageProps> = ({ onStartSession, onLogout }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onLogout={onLogout} />
      <main className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-dark-navy mb-2 sm:hidden">
          {t('dashboard.welcome')}, {user?.name}!
        </h2>
        <h3 className="text-2xl font-semibold text-dark-navy mb-8 mt-4">
          {t('dashboard.title')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {patients.map((patient) => (
              <div key={patient.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={patient.avatarUrl} 
                      alt="Patient avatar" 
                      className="w-24 h-24 rounded-full border-4 border-soft-blue"
                    />
                    <div>
                      <h4 className="text-2xl font-bold text-dark-navy">{t(patient.nameKey)}</h4>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-4">
                    {t(patient.descriptionKey)}
                  </p>
                </div>
                <div className="p-6 mt-auto">
                  <button 
                    onClick={() => onStartSession(patient.id)}
                    className="w-full bg-accent-orange text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-opacity-90 transition-opacity"
                  >
                    {t('dashboard.startSession')}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
