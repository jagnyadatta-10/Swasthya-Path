import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, LogOut, Globe, Activity, ZoomIn, ZoomOut, Layers, Signal, Bell, RefreshCw, CheckCircle2, Database, Compass, ArrowLeft } from 'lucide-react';
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
}

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
  onOpenCareFlow
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const refreshNotifs = () => {
    setNotifications(storage.getNotifications());
  };

  useEffect(() => {
    refreshNotifs();
    const interval = setInterval(refreshNotifs, 4000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleManualSync = () => {
    if (networkQuality === 'offline') {
      setSyncMessage('Offline: Cannot sync right now. Records are saved locally.');
      setTimeout(() => setSyncMessage(''), 3000);
      return;
    }
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncMessage('✓ All local records successfully synced!');
      storage.addAuditLog('Local health records synchronized', currentUser?.name || 'System');
      setTimeout(() => setSyncMessage(''), 3000);
    }, 1000);
  };
  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <div className="brand-wrap" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentUser && (
            <button
              type="button"
              className="btn btn-ghost-light"
              onClick={onLogout}
              title={lang === 'ଓଡ଼ିଆ' ? 'ମୁଖ୍ୟ ପୋର୍ଟାଲ୍ ଚୟନକୁ ଫେରନ୍ତୁ' : lang === 'हिन्दी' ? 'मुख्य पोर्टल चयन पर वापस जाएं' : 'Back to Portal Selection'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(25, 211, 255, 0.15)',
                border: '1px solid rgba(25, 211, 255, 0.4)',
                color: '#19d3ff',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={15} />
              <span>{lang === 'ଓଡ଼ିଆ' ? 'ପଛକୁ ଫେରନ୍ତୁ' : lang === 'हिन्दी' ? 'पीछे जाएं' : 'Back'}</span>
            </button>
          )}
          <div className="brand-icon-box" title="Swasthya Path Care Bridge">
            <Activity size={24} />
          </div>
          <div>
            <div className="brand-title">
              SWASTHYA <span>PATH</span>
            </div>
            <div className="brand-sub">
              {getTranslation(lang, 'subTagline')}
            </div>
          </div>
        </div>

        <div className="top-controls">
          {/* 3-State Network Status Pill */}
          <span
            className={`status-pill ${
              networkQuality === 'good'
                ? 'online'
                : networkQuality === 'limited'
                ? 'offline'
                : 'offline'
            }`}
            style={{
              background:
                networkQuality === 'good'
                  ? 'rgba(34, 197, 94, 0.2)'
                  : networkQuality === 'limited'
                  ? 'rgba(245, 158, 11, 0.25)'
                  : 'rgba(239, 68, 68, 0.25)',
              color:
                networkQuality === 'good'
                  ? '#86efac'
                  : networkQuality === 'limited'
                  ? '#fde047'
                  : '#fca5a5',
              borderColor:
                networkQuality === 'good'
                  ? 'rgba(34, 197, 94, 0.4)'
                  : networkQuality === 'limited'
                  ? 'rgba(245, 158, 11, 0.4)'
                  : 'rgba(239, 68, 68, 0.4)'
            }}
            title={
              networkQuality === 'good'
                ? 'Good 4G/WiFi Connection (~25ms)'
                : networkQuality === 'limited'
                ? 'Limited 2G/Unstable Network (Audio Prioritized)'
                : 'Offline / Cellular Dead Zone'
            }
            aria-live="polite"
          >
            <span
              className="status-dot"
              style={{
                background:
                  networkQuality === 'good'
                    ? '#22c55e'
                    : networkQuality === 'limited'
                    ? '#eab308'
                    : '#ef4444'
              }}
            ></span>
            {networkQuality === 'good' ? (
              <>
                <Wifi size={13} />
                <span>{lang === 'ଓଡ଼ିଆ' ? 'ଭଲ ନେଟୱର୍କ' : lang === 'हिन्दी' ? 'अच्छा नेटवर्क' : 'Good Network'}</span>
              </>
            ) : networkQuality === 'limited' ? (
              <>
                <Signal size={13} />
                <span>{lang === 'ଓଡ଼ିଆ' ? 'ସୀମିତ 2G' : lang === 'हिन्दी' ? 'सीमित 2G' : 'Limited 2G'}</span>
              </>
            ) : (
              <>
                <WifiOff size={13} />
                <span>{lang === 'ଓଡ଼ିଆ' ? 'ଅଫଲାଇନ୍' : lang === 'हिन्दी' ? 'ऑफ़लाइन' : 'Offline'}</span>
              </>
            )}
          </span>

          {/* Sync Status & Manual Sync Button */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: '6px',
                background: networkQuality === 'offline' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(25, 211, 255, 0.15)',
                color: networkQuality === 'offline' ? '#fca5a5' : '#7dd3fc',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title={networkQuality === 'offline' ? 'Saved locally on this device' : 'All records synchronized'}
            >
              <Database size={12} />
              {networkQuality === 'offline'
                ? (lang === 'ଓଡ଼ିଆ' ? 'କେବଳ ସ୍ଥାନୀୟ' : lang === 'हिन्दी' ? 'केवल स्थानीय' : 'Local Only')
                : networkQuality === 'limited'
                ? (lang === 'ଓଡ଼ିଆ' ? '୧ ଟି ବାକି ଅଛି' : lang === 'हिन्दी' ? '1 लंबित' : '1 Pending')
                : (lang === 'ଓଡ଼ିଆ' ? 'ସବୁ ସିଙ୍କ୍ ହୋଇଛି' : lang === 'हिन्दी' ? 'सभी सिंक हैं' : 'All Synced')}
            </span>

            {networkQuality !== 'offline' && (
              <button
                type="button"
                className="btn btn-ghost-light"
                onClick={handleManualSync}
                disabled={syncing}
                title="Synchronize local offline records with central health server"
                style={{ padding: '4px 8px', fontSize: '11px' }}
              >
                <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
                <span>{syncing ? (lang === 'ଓଡ଼ିଆ' ? 'ସିଙ୍କ୍ ହେଉଛି...' : lang === 'हिन्दी' ? 'सिंकिंग...' : 'Syncing...') : (lang === 'ଓଡ଼ିଆ' ? 'ବର୍ତ୍ତମାନ ସିଙ୍କ୍' : lang === 'हिन्दी' ? 'अभी सिंक करें' : 'Sync Now')}</span>
              </button>
            )}
          </div>

          {/* Network Toggle Button (cycles Good -> Limited -> Offline -> Good) */}
          <button
            className="btn btn-ghost-light"
            onClick={onToggleNetwork}
            title="Cycle network state for testing"
            style={{ padding: '6px 12px' }}
          >
            <span>{lang === 'ଓଡ଼ିଆ' ? 'ନେଟ୍ ବଦଳାନ୍ତୁ' : lang === 'हिन्दी' ? 'नेटवर्क बदलें' : 'Cycle Network'}</span>
          </button>

          {/* Low Bandwidth Mode Toggle */}
          <button
            className="btn btn-ghost-light"
            onClick={onToggleLowBandwidth}
            style={{
              padding: '6px 10px',
              background: lowBandwidthMode ? 'rgba(25, 211, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              borderColor: lowBandwidthMode ? '#19d3ff' : 'rgba(255, 255, 255, 0.2)'
            }}
            title="Toggle low-bandwidth optimization mode"
          >
            <span style={{ fontSize: '12px' }}>
              {lang === 'ଓଡ଼ିଆ' ? 'ସ୍ୱଳ୍ପ ଡାଟା ମୋଡ୍:' : lang === 'हिन्दी' ? 'कम डेटा मोड:' : 'Low-Bandwidth Mode:'} <strong>{lowBandwidthMode ? (lang === 'ଓଡ଼ିଆ' ? 'ଅନ୍' : lang === 'हिन्दी' ? 'चालू' : 'ON') : (lang === 'ଓଡ଼ିଆ' ? 'ଅଫ୍' : lang === 'हिन्दी' ? 'बंद' : 'OFF')}</strong>
            </span>
          </button>

          {/* In-App Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn btn-ghost-light"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              title="In-app notifications and SMS simulation"
              style={{ padding: '6px 10px', position: 'relative' }}
              aria-label="View notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <NotificationDropdown
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              notifications={notifications}
              onRefresh={refreshNotifs}
            />
          </div>

          {/* Language Selector */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={15} style={{ color: '#19d3ff' }} />
            <select
              value={lang}
              onChange={(e) => onSelectLang(e.target.value as Language)}
              style={{
                background: 'rgba(7, 28, 66, 0.9)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '13px',
                width: 'auto'
              }}
              aria-label="Select Language"
            >
              <option value="English">English</option>
              <option value="ଓଡ଼ିଆ">ଓଡ଼ିଆ (Odia)</option>
              <option value="हिन्दी">हिन्दी (Hindi)</option>
            </select>
          </div>

          {/* Accessibility Font Size Toggle */}
          <button
            className="btn btn-ghost-light"
            onClick={onToggleFontScale}
            title="Adjust text size for easier reading"
            style={{ padding: '6px 10px' }}
            aria-label="Toggle text zoom"
          >
            {fontScale > 1 ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
            <span>{fontScale > 1 ? 'A-' : 'A+'}</span>
          </button>

            {/* Care Navigation Flow Diagram (User Request) */}
          {onOpenCareFlow && (
            <button
              className="btn btn-ghost-light"
              onClick={onOpenCareFlow}
              title={lang === 'ଓଡ଼ିଆ' ? 'ସ୍ୱାସ୍ଥ୍ୟ ପଥ ଚିକିତ୍ସା ପ୍ରବାହ ଚିତ୍ର ଦେଖନ୍ତୁ' : lang === 'हिन्दी' ? 'स्वास्थ्य पथ केयर नेविगेशन फ्लो डायग्राम देखें' : 'View end-to-end Swasthya Path Care Navigation Flow Diagram'}
              style={{
                padding: '6px 12px',
                background: 'rgba(2, 132, 199, 0.25)',
                borderColor: '#38bdf8',
                color: '#ffffff'
              }}
            >
              <Compass size={15} style={{ color: '#38bdf8' }} />
              <span>{lang === 'ଓଡ଼ିଆ' ? 'ଚିକିତ୍ସା ପ୍ରବାହ' : lang === 'हिन्दी' ? 'केयर फ्लो' : 'Care Flow'}</span>
            </button>
          )}

          {/* Architecture / Replicability Specs */}
          <button
            className="btn btn-ghost-light"
            onClick={onOpenArchitecture}
            title={lang === 'ଓଡ଼ିଆ' ? 'ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟ ବ୍ୟବସ୍ଥା ଢାଞ୍ଚା ଓ ମଡେଲ୍ ଦେଖନ୍ତୁ' : lang === 'हिन्दी' ? 'ग्रामीण स्वास्थ्य सिस्टम आर्किटेक्चर एवं मॉडल देखें' : 'View system architecture, scalability and rural deployment model'}
            style={{ padding: '6px 12px' }}
          >
            <Layers size={15} />
            <span>{lang === 'ଓଡ଼ିଆ' ? 'ସିଷ୍ଟମ୍ ଢାଞ୍ଚା' : lang === 'हिन्दी' ? 'आर्किटेक्चर' : 'Architecture'}</span>
          </button>

          {/* Logged in User Bar & Logout */}
          {currentUser && (
            <button
              className="btn btn-ghost-light"
              onClick={onLogout}
              title={`Logged in as ${currentUser.name}. Click to log out.`}
            >
              <LogOut size={15} />
              <span>{getTranslation(lang, 'logout')}</span>
            </button>
          )}
        </div>
      </div>

      {syncMessage && (
        <div style={{
          background: '#0284c7',
          color: '#ffffff',
          fontSize: '12px',
          textAlign: 'center',
          padding: '4px',
          fontWeight: 600
        }}>
          {syncMessage}
        </div>
      )}
    </header>
  );
};
