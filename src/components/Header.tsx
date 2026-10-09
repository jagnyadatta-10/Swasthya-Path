import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi, WifiOff, LogOut, Globe, Activity, ZoomIn, ZoomOut, Layers,
  Signal, Bell, RefreshCw, Database, Compass, ArrowLeft, Settings,
  ChevronDown
} from 'lucide-react';
import { DemoUser, Language, NetworkQuality, AppNotification } from '../types';
import { getTranslation } from '../utils/translations';
import { storage } from '../utils/storage';
import { NotificationDropdown } from './NotificationDropdown';

interface HeaderProps {
  networkQuality: NetworkQuality;
  onToggleNetwork: () => void;
  lowBandwidthMode: boolean;
  onToggleLowBandwidth: () => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  currentUser: DemoUser | null;
  onLogout: () => void;
  fontScale: number;
  onToggleFontScale: () => void;
  onOpenArchitecture: () => void;
  onOpenCareFlow?: () => void;
  onGoBack?: () => void;
}

const DropSection: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ padding: '4px 18px 2px', fontSize: '10px', fontWeight: 700, color: '#9bacc8', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
    {label}
  </div>
);

const DropButton: React.FC<{ icon: React.ReactNode; label: string; badge?: string; onClick: () => void }> = ({ icon, label, badge, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{ width: '100%', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#374151', transition: 'background 0.15s' }}
    onMouseEnter={e => (e.currentTarget.style.background = '#f0f6ff')}
    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
  >
    <span style={{ color: '#6b7a99', flexShrink: 0 }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {badge && (
      <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', background: '#fee2e2', color: '#b91c1c' }}>{badge}</span>
    )}
  </button>
);

const DropToggle: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{ width: '100%', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: '#374151', transition: 'background 0.15s' }}
    onMouseEnter={e => (e.currentTarget.style.background = '#f0f6ff')}
    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
  >
    <span style={{ color: '#6b7a99', flexShrink: 0 }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    <span
      style={{
        width: '34px',
        height: '18px',
        borderRadius: '9px',
        background: active ? '#168cff' : '#d1d5db',
        position: 'relative',
        flexShrink: 0,
        transition: 'background 0.2s',
        display: 'inline-block'
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '2px',
          left: active ? '18px' : '2px',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s'
        }}
      />
    </span>
  </button>
);

export const Header: React.FC<HeaderProps> = ({
  networkQuality,
  onToggleNetwork,
  lowBandwidthMode,
  onToggleLowBandwidth,
  lang,
  onSelectLang,
  currentUser,
  onLogout,
  fontScale,
  onToggleFontScale,
  onOpenArchitecture,
  onOpenCareFlow,
  onGoBack
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const refreshNotifs = () => setNotifications(storage.getNotifications());
  useEffect(() => {
    refreshNotifs();
    const interval = setInterval(refreshNotifs, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleManualSync = () => {
    if (networkQuality === 'offline') {
      setSyncMessage('Offline – records saved locally.');
      setTimeout(() => setSyncMessage(''), 3000);
      return;
    }
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncMessage('All records synced!');
      storage.addAuditLog('Records synchronized', currentUser?.name || 'System');
      setTimeout(() => setSyncMessage(''), 3000);
    }, 1000);
  };

  const networkLabel = () => {
    if (networkQuality === 'good') return lang === 'ଓଡ଼ିଆ' ? 'ଉତ୍ତମ ସଂଯୋଗ' : lang === 'हिन्दी' ? 'अच्छा नेटवर्क' : 'Good';
    if (networkQuality === 'limited') return lowBandwidthMode ? (lang === 'ଓଡ଼ିଆ' ? '2G ଦୁର୍ବଳ' : lang === 'हिन्दी' ? 'बहुत कमजोर 2G' : 'Very Weak 2G') : (lang === 'ଓଡ଼ିଆ' ? '3G ଦୁର୍ବଳ' : lang === 'हिन्दी' ? 'कमजोर 3G' : 'Weak 3G');
    return lang === 'ଓଡ଼ିଆ' ? 'ଅଫଲାଇନ୍' : lang === 'हिन्दी' ? 'ऑफ़लाइन' : 'Offline';
  };

  const networkDot = networkQuality === 'good' ? '#22c55e' : networkQuality === 'limited' ? (lowBandwidthMode ? '#f97316' : '#eab308') : '#ef4444';
  const netBg = networkQuality === 'good' ? '#ecfdf5' : networkQuality === 'limited' ? '#fffbeb' : '#fef2f2';
  const netColor = networkQuality === 'good' ? '#059669' : networkQuality === 'limited' ? '#b45309' : '#dc2626';
  const netBorder = networkQuality === 'good' ? '#a7f3d0' : networkQuality === 'limited' ? '#fde68a' : '#fecaca';

  const roleLabel = () => {
    if (!currentUser) return '';
    const r = currentUser.role;
    const mapping: Record<string, [string, string, string]> = {
      patient: ['Patient', 'मरीज़', 'ରୋଗୀ'],
      doctor: ['Doctor', 'डॉक्टर', 'ଡାକ୍ତର'],
      pharmacy: ['Pharmacy', 'फार्मेसी', 'ଫାର୍ମାସୀ'],
      lab: ['Pathology', 'पैथोलॉजी', 'ପ୍ୟାଥୋଲୋଜି'],
      pathology: ['Pathology', 'पैथोलॉजी', 'ପ୍ୟାଥୋଲୋଜି']
    };
    const [en, hi, od] = mapping[r] || ['Admin', 'एडमिन', 'ଆଡ୍‍ମିନ'];
    return lang === 'English' ? en : lang === 'हिन्दी' ? hi : od;
  };

  const t = (en: string, hi: string, od: string) => (lang === 'English' ? en : lang === 'हिन्दी' ? hi : od);

  return (
    <header style={{ background: '#ffffff', borderBottom: '1.5px solid #e5eaf2', position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 2px 12px rgba(6,17,38,0.07)' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 20px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        {/* LEFT: Back button (if any) + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          {currentUser && onGoBack && (
            <button
              type="button"
              onClick={onGoBack}
              aria-label="Go back"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 10px', background: '#f0f4ff', border: '1px solid #c7d7f7', borderRadius: '8px', color: '#1e40af', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              <ArrowLeft size={14} />
              <span>{t('Back', 'वापस', 'ପଛ')}</span>
            </button>
          )}
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', flexShrink: 0, background: 'linear-gradient(135deg, #168cff 0%, #19d3ff 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(22,140,255,0.35)' }}>
              <Activity size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit','Inter',sans-serif", fontSize: 'clamp(15px,2vw,19px)', fontWeight: 800, letterSpacing: '0.05em', color: '#0e1a2f', lineHeight: 1.1 }}>
                SWASTHYA <span style={{ color: '#168cff' }}>PATH</span>
              </div>
              <div style={{ fontSize: '10px', color: '#6b7a99', fontWeight: 400, marginTop: '1px' }}>{getTranslation(lang, 'subTagline')}</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Network pill, Bell, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Network status pill */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: netBg, color: netColor, border: `1px solid ${netBorder}`, letterSpacing: '0.3px' }} title={`Network: ${networkLabel()}`}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: networkDot, flexShrink: 0 }} />
            {networkQuality === 'good' ? <Wifi size={11} /> : networkQuality === 'limited' ? <Signal size={11} /> : <WifiOff size={11} />}
            <span>{networkLabel()}</span>
          </span>

          {/* Notification bell */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
              aria-label="Notifications"
              style={{ width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid #e2e8f4', background: '#f8faff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', color: '#374151' }}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', fontSize: '9px', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} notifications={notifications} onRefresh={refreshNotifs} />
          </div>

          {/* Profile dropdown */}
          {currentUser && (
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                aria-label="Open profile menu"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 10px 5px 6px', border: '1.5px solid #e2e8f4', borderRadius: '10px', background: '#f8faff', cursor: 'pointer', color: '#0e1a2f' }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #168cff, #19d3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0e1a2f', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.name.split(' ')[0]}</div>
                  <div style={{ fontSize: '10px', color: '#6b7a99' }}>{roleLabel()}</div>
                </div>
                <ChevronDown size={12} color="#6b7a99" style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
              </button>

              {isProfileOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: '280px', background: '#ffffff', border: '1.5px solid #e2e8f4', borderRadius: '14px', boxShadow: '0 12px 40px rgba(6,17,38,0.14)', overflow: 'hidden', zIndex: 500, animation: 'dropdownFade 0.15s ease' }}>
                  {/* Header user info */}
                  <div style={{ padding: '16px 18px 12px', background: 'linear-gradient(135deg, #f0f6ff 0%, #e8f4ff 100%)', borderBottom: '1px solid #dce8f8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #168cff, #19d3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0e1a2f' }}>{currentUser.name}</div>
                        <div style={{ fontSize: '11px', color: '#6b7a99', marginTop: '1px' }}>{roleLabel()} • {currentUser.healthFacility || 'Swasthya Path'}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '8px 0', maxHeight: '70vh', overflowY: 'auto' }}>
                    {/* Connection Section */}
                    <DropSection label={t('Connection', 'कनेक्शन', 'ସଂଯୋଗ')} />
                    <div style={{ padding: '6px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {networkQuality === 'good' ? <Wifi size={14} color="#059669" /> : networkQuality === 'limited' ? <Signal size={14} color="#b45309" /> : <WifiOff size={14} color="#dc2626" />}
                        {t('Network Status', 'नेटवर्क', 'ନେଟୱର୍କ')}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: netBg, color: netColor }}>{networkLabel()}</span>
                    </div>
                    <DropButton icon={<Database size={14} />} label={t('Cycle Network (Simulate)', 'नेटवर्क सिमुलेट करें', 'ନେଟୱର୍କ ସିମ୍ୟୁଲେଟ୍')} onClick={onToggleNetwork} />
                    <DropToggle icon={<Signal size={14} />} label={t('Low-Bandwidth Mode', 'कम डेटा मोड', 'ସ୍ୱଳ୍ପ ଡାଟା ମୋଡ')} active={lowBandwidthMode} onClick={onToggleLowBandwidth} />
                    <DropButton icon={<RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />} label={syncing ? t('Syncing...', 'सिंक हो रहा है...', 'ସିଙ୍କ ହେଉଛି...') : t('Sync Now', 'अभी सिंक करें', 'ବର୍ତ୍ତମାନ ସିଙ୍କ')} badge={networkQuality === 'offline' ? t('Offline', 'ऑफ़लाइन', 'ଅଫ') : undefined} onClick={handleManualSync} />
                    {syncMessage && <div style={{ padding: '4px 18px', fontSize: '11px', color: '#059669', fontWeight: 600 }}>{syncMessage}</div>}
                    <div style={{ height: '1px', background: '#f0f4fb', margin: '4px 0' }} />
                    {/* Language & Accessibility */}
                    <DropSection label={currentUser?.role === 'doctor' ? 'Language & Accessibility' : t('Language & Accessibility', 'भाषा और पहुँच', 'ଭାଷା ଓ ଆଭ୍ୟାସ')} />
                    <div style={{ padding: '6px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}><Globe size={14} color="#168cff" />{currentUser?.role === 'doctor' ? 'Language' : t('Language', 'भाषा', 'ଭାଷା')}</span>
                      {currentUser?.role === 'doctor' ? (
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>English (Clinical)</span>
                      ) : (
                        <select
                          value={lang}
                          onChange={e => onSelectLang(e.target.value as Language)}
                          style={{ border: '1px solid #dce8f8', borderRadius: '7px', padding: '4px 8px', fontSize: '12px', background: '#f8faff', color: '#0e1a2f', cursor: 'pointer', fontWeight: 600 }}
                          aria-label="Select Language"
                        >
                          <option value="English">English</option>
                          <option value="ଓଡ଼ିଆ">ଓଡ଼ିଆ (Odia)</option>
                          <option value="हिन्दी">हिन्दी (Hindi)</option>
                        </select>
                      )}
                    </div>
                    <DropButton icon={fontScale > 1 ? <ZoomOut size={14} /> : <ZoomIn size={14} />} label={fontScale > 1 ? t('Normal Text Size (A-)', 'सामान्य टेक्स्ट (A-)', 'ସ୍ୱାଭାବିକ ଆଖ (A-)') : t('Larger Text Size (A+)', 'बड़ा टेक्स्ट (A+)', 'ବଡ ଆଖ (A+)')} badge={fontScale > 1 ? 'LARGE' : undefined} onClick={onToggleFontScale} />
                    <div style={{ height: '1px', background: '#f0f4fb', margin: '4px 0' }} />
                    {/* Navigation Section */}
                    <DropSection label={t('Navigation', 'नेविगेशन', 'ନ୍ୟାଭିଗେଶନ')} />
                    {onOpenCareFlow && (
                      <DropButton icon={<Compass size={14} color="#0284c7" />} label={t('View Care Flow Diagram', 'केयर फ्लो डायग्राम', 'ଚିକିତ୍ସା ପ୍ରବାହ ଡାୟାଗ୍ରାମ')} onClick={() => { onOpenCareFlow(); setIsProfileOpen(false); }} />
                    )}
                    <DropButton icon={<Layers size={14} color="#7c3aed" />} label={t('System Architecture', 'सिस्टम आर्किटेक्चर', 'ସିଷ୍ଟମ ଢାଞ୍ଚା')} onClick={() => { onOpenArchitecture(); setIsProfileOpen(false); }} />
                    <div style={{ height: '1px', background: '#f0f4fb', margin: '4px 0' }} />
                    {/* Account Section */}
                    <DropSection label={t('Account', 'खाता', 'ଖାତା')} />
                    <DropButton icon={<Settings size={14} />} label={t('Profile & Account Settings', 'प्रोफ़ाइल और सेटिंग', 'ପ୍ରୋଫ୍‌ଇଲ ଓ ସେଟିଂ')} onClick={() => {}} />
                    <button
                      type="button"
                      onClick={() => { onLogout(); setIsProfileOpen(false); }}
                      style={{ width: '100%', padding: '9px 18px', display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#dc2626' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <LogOut size={14} />{getTranslation(lang, 'logout')}
                    </button>
                    <div style={{ height: '8px' }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Sync toast */}
      {syncMessage && (
        <div style={{ background: '#0284c7', color: '#fff', fontSize: '12px', textAlign: 'center', padding: '4px', fontWeight: 600 }}>{syncMessage}</div>
      )}
      <style>{`@keyframes dropdownFade { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </header>
  );
};
