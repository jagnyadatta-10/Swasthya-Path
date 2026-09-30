import React, { useState } from 'react';
import { User, Stethoscope, Pill, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, Key, Building2 } from 'lucide-react';
import { Role, DemoUser, Language } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { getTranslation } from '../utils/translations';

interface LoginScreenProps {
  onLoginSuccess: (user: DemoUser) => void;
  lang: Language;
  onSelectLang?: (lang: Language) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, lang, onSelectLang }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('patient');
  const [email, setEmail] = useState(DEMO_USERS.patient.email);
  const [mobile, setMobile] = useState(DEMO_USERS.patient.mobile);
  const [password, setPassword] = useState('Demo@123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEmail(DEMO_USERS[role].email);
    setMobile(DEMO_USERS[role].mobile);
    setPassword('Demo@123');
    setErrorMsg('');
  };

  const handleFillDemo = () => {
    setEmail(DEMO_USERS[selectedRole].email);
    setMobile(DEMO_USERS[selectedRole].mobile);
    setPassword('Demo@123');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = DEMO_USERS[selectedRole];
    const trimEmail = email.trim();
    const trimMobile = mobile.trim();

    if (
      trimEmail !== expected.email ||
      trimMobile !== expected.mobile ||
      password !== 'Demo@123'
    ) {
      setErrorMsg('Invalid credentials. Click [Use Demo Account] above to auto-fill the required demo credentials.');
      return;
    }

    setErrorMsg('');
    onLoginSuccess(expected);
  };

  return (
    <div className="login-screen-wrap">
      {/* Prominent Language Bar (Prompt Section 7) */}
      {onSelectLang && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Language:</span>
          {(['English', 'ଓଡ଼ିଆ', 'हिन्दी'] as Language[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onSelectLang(l)}
              style={{
                background: lang === l ? '#0284c7' : '#ffffff',
                color: lang === l ? '#ffffff' : '#334155',
                border: lang === l ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                borderRadius: '999px',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: lang === l ? 800 : 500,
                cursor: 'pointer',
                boxShadow: lang === l ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none'
              }}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      <div className="card" style={{ padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #168cff, #19d3ff)',
              color: '#020a1d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 8px 24px rgba(25, 211, 255, 0.35)'
            }}
          >
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ marginBottom: '6px' }}>Who are you?</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '440px', margin: '0 auto' }}>
            Select your role to access the Swasthya Path telehealth portal.
          </p>
        </div>

        {/* 4 Portal Role Selection Cards */}
        <div className="role-selector-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
          <button
            type="button"
            className={`role-card-btn ${selectedRole === 'patient' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('patient')}
            aria-pressed={selectedRole === 'patient'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} />
              </div>
              {selectedRole === 'patient' && <CheckCircle2 size={18} style={{ color: '#168cff' }} />}
            </div>
            <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Patient</strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>
              Care navigation & records
            </span>
          </button>

          <button
            type="button"
            className={`role-card-btn ${selectedRole === 'doctor' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('doctor')}
            aria-pressed={selectedRole === 'doctor'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf3', color: '#027a48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Stethoscope size={20} />
              </div>
              {selectedRole === 'doctor' && <CheckCircle2 size={18} style={{ color: '#168cff' }} />}
            </div>
            <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Doctor</strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>
              Triage queue & clinical decisions
            </span>
          </button>

          <button
            type="button"
            className={`role-card-btn ${selectedRole === 'pharmacy' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('pharmacy')}
            aria-pressed={selectedRole === 'pharmacy'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3f2', color: '#b42318', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pill size={20} />
              </div>
              {selectedRole === 'pharmacy' && <CheckCircle2 size={18} style={{ color: '#168cff' }} />}
            </div>
            <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Pharmacy</strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>
              Local medicine stock updates
            </span>
          </button>

          <button
            type="button"
            className={`role-card-btn ${selectedRole === 'admin' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('admin')}
            aria-pressed={selectedRole === 'admin'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={20} />
              </div>
              {selectedRole === 'admin' && <CheckCircle2 size={18} style={{ color: '#168cff' }} />}
            </div>
            <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Administrator</strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>
              District impact & facility telemetry
            </span>
          </button>
        </div>

        {/* Selected Portal Form */}
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--navy-mid)' }}>
                Login as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
              </h3>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFillDemo}
                style={{
                  fontSize: '12px',
                  padding: '6px 14px',
                  minHeight: '34px',
                  background: 'linear-gradient(135deg, #168cff, #19d3ff)',
                  color: '#020a1d'
                }}
                title="Auto-fill the required demo credentials"
              >
                <Sparkles size={14} />
                <span>Use Demo Account</span>
              </button>
            </div>

            {/* Demo Credentials Helper Box */}
            <div className="demo-credentials-box">
              <div style={{ fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} style={{ color: '#0b4a92' }} />
                <span>Demo Account:</span>
                <span style={{ color: '#0b4a92' }}>{DEMO_USERS[selectedRole].name}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '12px' }}>
                <div><strong>Email:</strong> {DEMO_USERS[selectedRole].email}</div>
                <div><strong>Mobile:</strong> {DEMO_USERS[selectedRole].mobile}</div>
                <div><strong>Password:</strong> Demo@123</div>
                <div><strong>Location:</strong> {DEMO_USERS[selectedRole].location}</div>
              </div>
            </div>

            <div className="field">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <div className="field">
              <label htmlFor="login-mobile">Mobile Number</label>
              <input
                id="login-mobile"
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 90000 10001"
              />
            </div>

            <div className="field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            {errorMsg && (
              <div className="alert danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '14px', padding: '14px', fontSize: '15px' }}
            >
              <span>Login as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
