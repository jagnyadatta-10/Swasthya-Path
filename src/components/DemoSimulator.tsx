import React, { useState } from 'react';
import { Sliders, ChevronDown, ChevronUp, User, Wifi, Globe, Shield, Activity } from 'lucide-react';
import { Role, NetworkQuality, Language, DemoUser } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface DemoSimulatorProps {
  currentRole: Role | null;
  onSelectRole: (user: DemoUser) => void;
  networkQuality: NetworkQuality;
  onSelectNetwork: (net: NetworkQuality) => void;
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
}

export const DemoSimulator: React.FC<DemoSimulatorProps> = ({
  currentRole,
  onSelectRole,
  networkQuality,
  onSelectNetwork,
  currentLang,
  onSelectLang
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 400,
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Collapsed Pill */}
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          style={{
            background: 'linear-gradient(135deg, #071c42, #0d3875)',
            color: '#ffffff',
            border: '1px solid rgba(25, 211, 255, 0.4)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
            borderRadius: '999px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600
          }}
          title="Open Evaluator Demo Simulator"
        >
          <Sliders size={15} style={{ color: '#19d3ff' }} />
          <span>Demo Controls</span>
          <span
            style={{
              background: networkQuality === 'good' ? '#059669' : networkQuality === 'limited' ? '#d97706' : '#dc2626',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              display: 'inline-block'
            }}
          ></span>
          <ChevronUp size={15} />
        </button>
      ) : (
        /* Expanded Floating Card */
        <div
          style={{
            background: 'rgba(7, 28, 66, 0.97)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(25, 211, 255, 0.35)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
            padding: '16px',
            width: '320px',
            maxWidth: '92vw'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={16} style={{ color: '#19d3ff' }} />
              <strong style={{ fontSize: '13px', letterSpacing: '0.04em' }}>EVALUATOR DEMO SIMULATOR</strong>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              style={{ background: 'transparent', border: 0, color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* 1. ROLE SWITCHER */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
              <User size={13} />
              <span>Simulate Role:</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
              {(['patient', 'doctor', 'pharmacy', 'admin', 'lab'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onSelectRole(DEMO_USERS[r])}
                  style={{
                    background: currentRole === r ? '#0284c7' : 'rgba(255, 255, 255, 0.08)',
                    color: currentRole === r ? '#ffffff' : '#cbd5e1',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '6px 2px',
                    fontSize: '10px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    textAlign: 'center'
                  }}
                >
                  {r === 'patient' ? '👤 Patient' : r === 'doctor' ? '🩺 Doctor' : r === 'pharmacy' ? '💊 Chemist' : r === 'admin' ? '🏛️ Admin' : '🔬 Pathology'}
                </button>
              ))}
            </div>
          </div>

          {/* 2. NETWORK SIMULATOR */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
              <Wifi size={13} />
              <span>Network Condition:</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
              {[
                { id: 'good', label: 'Good (4G)', color: '#059669' },
                { id: 'limited', label: 'Limited (2G)', color: '#d97706' },
                { id: 'offline', label: 'Offline', color: '#dc2626' }
              ].map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => onSelectNetwork(n.id as NetworkQuality)}
                  style={{
                    background: networkQuality === n.id ? n.color : 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '6px 4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. LANGUAGE SWITCHER */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
              <Globe size={13} />
              <span>Interface Language:</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
              {(['English', 'ଓଡ଼ିଆ', 'हिन्दी'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onSelectLang(l)}
                  style={{
                    background: currentLang === l ? '#0284c7' : 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '6px 4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* 4. 1-CLICK DEMO SCENARIOS (Section 40) */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '6px' }}>
              <Activity size={13} />
              <span>1-Click Evaluator Scenarios:</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
              <button
                type="button"
                onClick={() => {
                  onSelectRole(DEMO_USERS.patient);
                  onSelectNetwork('good');
                }}
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#86efac',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '5px 6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                1. Routine Fever (Low)
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectRole(DEMO_USERS.doctor);
                  onSelectNetwork('good');
                }}
                style={{
                  background: 'rgba(234, 179, 8, 0.15)',
                  color: '#fef08a',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  padding: '5px 6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                2. Priority Review
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectRole(DEMO_USERS.patient);
                  onSelectNetwork('good');
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '5px 6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                3. Emergency (108)
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectRole(DEMO_USERS.patient);
                  onSelectNetwork('limited');
                }}
                style={{
                  background: 'rgba(249, 115, 22, 0.15)',
                  color: '#fed7aa',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  padding: '5px 6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                4. Limited (2G Text)
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectRole(DEMO_USERS.patient);
                  onSelectNetwork('offline');
                }}
                style={{
                  background: 'rgba(148, 163, 184, 0.15)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  padding: '5px 6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                5. Offline Mode
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectRole(DEMO_USERS.pharmacy);
                  onSelectNetwork('good');
                }}
                style={{
                  background: 'rgba(14, 165, 233, 0.15)',
                  color: '#7dd3fc',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  padding: '5px 6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                6. Pharmacy Stock
              </button>
            </div>
            <div style={{ marginTop: '8px', fontSize: '9px', color: '#94a3b8', textAlign: 'center' }}>
              DEMO DATA — NOT REAL PATIENT DATA
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
