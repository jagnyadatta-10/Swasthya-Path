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

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>('good');
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(true);
  const [lang, setLang] = useState<Language>('English');
  const [fontScale, setFontScale] = useState<number>(1);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isCareFlowOpen, setIsCareFlowOpen] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale.toString());
  }, [fontScale]);

  // Cycle network Good -> Limited -> Offline -> Good
  const handleToggleNetwork = () => {
    setNetworkQuality((prev) => {
      if (prev === 'good') return 'limited';
      if (prev === 'limited') return 'offline';
      return 'good';
    });
  };

  const handleToggleFontScale = () => {
    setFontScale((prev) => (prev > 1 ? 1 : 1.15));
  };

  const handleLogout = () => {
    setCurrentUser(null);
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
          <LoginScreen onLoginSuccess={setCurrentUser} lang={lang} onSelectLang={setLang} />
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
          />
        ) : currentUser.role === 'pharmacy' ? (
          <PharmacyPortal
            user={currentUser}
            networkQuality={networkQuality}
            lang={lang}
          />
        ) : (
          <AdminPortal
            user={currentUser}
            networkQuality={networkQuality}
            lang={lang}
          />
        )}
      </main>

      {/* Floating Demo Simulator for Evaluators */}
      <DemoSimulator
        currentRole={currentUser?.role || null}
        onSelectRole={setCurrentUser}
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
          <strong>SWASTHYA PATH</strong> • Low-bandwidth access to rural care in many languages.
        </p>
        <p style={{ marginTop: '4px', fontSize: '11px', color: 'var(--muted)' }}>
          AI assists symptom intake & navigation; doctors make clinical decisions.
          AI is never presented as a medical diagnosis system. In emergencies, call 108 immediately.
        </p>
      </footer>
    </div>
  );
};

export default App;
