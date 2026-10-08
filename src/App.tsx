import React, { useState, useEffect } from 'react';
import { DemoUser, Language, NetworkQuality } from './types';
import { Header } from './components/Header';
import { SafetyBanner } from './components/SafetyBanner';
import { ArchitectureModal } from './components/ArchitectureModal';
import { CareNavigationFlowModal } from './components/CareNavigationFlowModal';
import { DemoSimulator } from './components/DemoSimulator';
import { LoginScreen } from './pages/LoginScreen';
import { PatientPortal } from './pages/PatientPortal';
import { DoctorPortal } from './pages/DoctorPortal';
import { PharmacyPortal } from './pages/PharmacyPortal';
import { AdminPortal } from './pages/AdminPortal';
import { MedicalDashboard } from './pages/MedicalDashboard';
import { storage } from './utils/storage';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(() => {
    return storage.getActiveSession();
  });
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>('good');
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(true);
  const [lang, setLang] = useState<Language>('English');
  const [fontScale, setFontScale] = useState<number>(1);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isCareFlowOpen, setIsCareFlowOpen] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale.toString());
  }, [fontScale]);

  // Keep active session in sync with storage
  const handleLoginSuccess = (user: DemoUser) => {
    storage.setActiveSession(user);
    setCurrentUser(user);
    window.history.pushState({ portal: user.role }, '', `#${user.role}`);
  };

  const handleLogout = () => {
    storage.clearActiveSession();
    setCurrentUser(null);
    window.history.pushState(null, '', window.location.pathname);
  };

  // Prevent back navigation from destroying session unexpectedly
  useEffect(() => {
    const handlePopState = () => {
      const activeSession = storage.getActiveSession();
      if (activeSession && !currentUser) {
        setCurrentUser(activeSession);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentUser]);

  // Cycle network Good -> Weak (3G) -> Very Weak (2G) -> Offline -> Good
  const handleToggleNetwork = () => {
    setNetworkQuality((prev) => {
      if (prev === 'good') return 'limited';
      if (prev === 'limited') {
        if (!lowBandwidthMode) {
          setLowBandwidthMode(true);
          return 'limited';
        }
        return 'offline';
      }
      setLowBandwidthMode(false);
      return 'good';
    });
  };

  const handleToggleFontScale = () => {
    setFontScale((prev) => (prev > 1 ? 1 : 1.15));
  };

  return (
    <div className="min-h-screen" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Top Header */}
      <Header
        networkQuality={networkQuality}
        onToggleNetwork={handleToggleNetwork}
        lowBandwidthMode={lowBandwidthMode}
        onToggleLowBandwidth={() => setLowBandwidthMode(!lowBandwidthMode)}
        lang={lang}
        onSelectLang={setLang}
        currentUser={currentUser}
        onLogout={handleLogout}
        fontScale={fontScale}
        onToggleFontScale={handleToggleFontScale}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenCareFlow={() => setIsCareFlowOpen(true)}
      />

      <main className="app-container" style={{ flex: 1 }}>
        {/* Universal Clinical Safety Banner */}
        <SafetyBanner lang={lang} />

        {/* Dynamic Route: Login or Selected Role Portal */}
        {!currentUser ? (
          <LoginScreen onLoginSuccess={handleLoginSuccess} lang={lang} onSelectLang={setLang} />
        ) : currentUser.role === 'patient' ? (
          <PatientPortal
            user={currentUser}
            networkQuality={networkQuality}
            onNetworkChange={setNetworkQuality}
            lowBandwidthMode={lowBandwidthMode}
            onToggleLowBandwidth={() => setLowBandwidthMode(!lowBandwidthMode)}
            lang={lang}
            onSelectLang={setLang}
          />
        ) : currentUser.role === 'doctor' ? (
          <DoctorPortal
            user={currentUser}
            networkQuality={networkQuality}
            onNetworkChange={setNetworkQuality}
            lang={lang}
            onSelectLang={setLang}
          />
        ) : currentUser.role === 'pharmacy' ? (
          <PharmacyPortal
            user={currentUser}
            networkQuality={networkQuality}
            lang={lang}
            onSelectLang={setLang}
          />
        ) : (currentUser.role === 'lab' || currentUser.role === 'pathology') ? (
          <MedicalDashboard
            user={currentUser}
            networkQuality={networkQuality}
            lang={lang}
            onSelectLang={setLang}
            onBack={handleLogout}
          />
        ) : (
          <AdminPortal
            user={currentUser}
            networkQuality={networkQuality}
            lang={lang}
            onSelectLang={setLang}
            onBack={handleLogout}
          />
        )}
      </main>

      {/* Floating Demo Simulator for Evaluators */}
      <DemoSimulator
        currentRole={currentUser?.role || null}
        onSelectRole={(userOrRole) => {
          if (!userOrRole) {
            handleLogout();
          } else if (typeof userOrRole === 'object') {
            handleLoginSuccess(userOrRole);
          }
        }}
        networkQuality={networkQuality}
        onSelectNetwork={setNetworkQuality}
        currentLang={lang}
        onSelectLang={setLang}
      />

      {/* Global Architecture & Scalability Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Global SWASTHYA PATH Care Navigation Flow Modal */}
      <CareNavigationFlowModal
        isOpen={isCareFlowOpen}
        onClose={() => setIsCareFlowOpen(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          <strong>SWASTHYA PATH</strong> •{' '}
          {lang === 'ଓଡ଼ିଆ'
            ? 'ବହୁଭାଷୀ ଗ୍ରାମୀଣ ଟେଲିମେଡିସିନ୍ ଓ ସ୍ୱଳ୍ପ ବ୍ୟାଣ୍ଡୱିଡ଼ଥ୍ ସେବା।'
            : lang === 'हिन्दी'
            ? 'बहुभाषी ग्रामीण टेलीमेडिसिन एवं कम बैंडविड्थ सेवा।'
            : 'Low-bandwidth access to rural care in many languages.'}
        </p>
        <p style={{ marginTop: '4px', fontSize: '11px', color: 'var(--muted)' }}>
          {lang === 'ଓଡ଼ିଆ'
            ? 'AI କେବଳ ଲକ୍ଷଣ ତଥ୍ୟ ସଂଗ୍ରହ ଓ ମାର୍ଗଦର୍ଶନରେ ସାହାଯ୍ୟ କରେ; ଡାକ୍ତରମାନେ ହିଁ ଚିକିତ୍ସା ନିଷ୍ପତ୍ତି ନିଅନ୍ତି। AI କୌଣସି ଡାକ୍ତରୀ ନିଦାନ ପ୍ରଣାଳୀ ନୁହେଁ। ଜରୁରୀ ପରିସ୍ଥିତିରେ ତୁରନ୍ତ ୧୦୮ କୁ କଲ୍ କରନ୍ତୁ।'
            : lang === 'हिन्दी'
            ? 'AI केवल लक्षण संग्रह और नेविगेशन में सहायता करता है; डॉक्टर ही नैदानिक निर्णय लेते हैं। AI कोई चिकित्सा निदान प्रणाली नहीं है। आपात स्थिति में तुरंत 108 पर कॉल करें।'
            : 'AI assists symptom intake & navigation; doctors make clinical decisions. AI is never presented as a medical diagnosis system. In emergencies, call 108 immediately.'}
        </p>
      </footer>
    </div>
  );
};

export default App;
