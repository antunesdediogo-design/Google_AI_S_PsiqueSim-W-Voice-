import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import type { AuthMode } from '../types';

interface HeaderProps {
    onNavigateToAuth: (mode: AuthMode) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToAuth }) => {
  const { t } = useLanguage();

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-heading text-dark-navy">PsiqueSim</h1>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-gray-600 hover:text-dark-navy">{t('header.howItWorks')}</a>
          <a href="#" className="text-gray-600 hover:text-dark-navy">{t('header.forIndividuals')}</a>
          <a href="#" className="text-gray-600 hover:text-dark-navy">{t('header.forInstitutions')}</a>
          <a href="#" className="text-gray-600 hover:text-dark-navy">{t('header.pricing')}</a>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <button onClick={() => onNavigateToAuth('login')} className="hidden sm:block border border-dark-navy text-dark-navy px-4 py-2 rounded-md font-semibold hover:bg-dark-navy hover:text-white transition-colors">
            {t('header.login')}
          </button>
          <button onClick={() => onNavigateToAuth('signup')} className="bg-accent-orange text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-opacity">
            {t('header.signup')}
          </button>
        </div>
      </nav>
    </header>
  );
};

const Hero: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
    const { t } = useLanguage();
    return (
        <section className="bg-soft-blue/20">
            <div className="container mx-auto px-6 py-24 text-center">
                <h2 className="text-4xl md:text-5xl font-bold font-heading text-dark-navy mb-4 leading-tight">
                    {t('hero.headline')}
                </h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
                    {t('hero.subheadline')}
                </p>
                <button 
                    onClick={onCtaClick}
                    className="bg-accent-orange text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-opacity-90 transition-opacity transform hover:scale-105"
                >
                    {t('hero.cta')}
                </button>
                 <div className="mt-12">
                    <img src="https://picsum.photos/seed/psiquesim-hero/1200/400" alt="Abstract professional interaction" className="rounded-lg shadow-xl mx-auto w-full max-w-5xl object-cover h-64" />
                </div>
            </div>
        </section>
    );
};

const HowItWorks = () => {
    const { t } = useLanguage();
    const steps = [
        { title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Desc') },
        { title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Desc') },
        { title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Desc') },
    ];
    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <h3 className="text-3xl font-bold font-heading text-center text-dark-navy mb-12">{t('howItWorks.title')}</h3>
                <div className="grid md:grid-cols-3 gap-12 text-center">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="bg-soft-blue text-dark-navy w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                                {index + 1}
                            </div>
                            <h4 className="text-xl font-bold text-dark-navy mb-2">{step.title}</h4>
                            <p className="text-gray-600">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-dark-navy text-white py-8">
        <div className="container mx-auto px-6 text-center">
            <p>&copy; {new Date().getFullYear()} PsiqueSim. All rights reserved.</p>
        </div>
    </footer>
);

interface LandingPageProps {
    onNavigateToAuth: (mode: AuthMode) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigateToAuth={onNavigateToAuth} />
      <main className="flex-grow">
        <Hero onCtaClick={() => onNavigateToAuth('signup')} />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
