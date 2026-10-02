import React, { useState } from 'react';
import { User, Stethoscope, Pill, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, Key, Building2, FlaskConical } from 'lucide-react';
import { Role, DemoUser, Language } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { getTranslation } from '../utils/translations';

interface LoginScreenProps {
  onLoginSuccess: (user: DemoUser) => void;
  lang: Language;
  onSelectLang?: (lang: Language) => void;
}

const LOGIN_I18N = {
  English: {
    langLabel: 'Language:',
    whoAreYou: 'Who are you?',
    subtitle: 'Select your role to access the Swasthya Path telehealth portal.',
    patientRole: 'Patient',
    patientDesc: 'Care navigation & records',
    doctorRole: 'Doctor',
    doctorDesc: 'Triage queue & clinical decisions',
    pharmacyRole: 'Pharmacy',
    pharmacyDesc: 'Local medicine stock updates',
    adminRole: 'Administrator',
    adminDesc: 'District impact & facility telemetry',
    labRole: 'Diagnostic Lab',
    labDesc: 'Submit physical reports & pathology',
    loginAs: (role: string) => `Login as ${role}`,
    useDemo: 'Use Demo Account',
    demoAccount: 'Demo Account:',
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter email address',
    mobileLabel: 'Mobile Number',
    mobilePlaceholder: '+91 90000 10001',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    location: 'Location:',
    invalidCreds: 'Invalid credentials. Click [Use Demo Account] above to auto-fill the required demo credentials.',
    rolesMap: {
      patient: 'Patient',
      doctor: 'Doctor',
      pharmacy: 'Pharmacy',
      admin: 'Administrator',
      lab: 'Diagnostic Lab & Medical Center'
    }
  },
  'ଓଡ଼ିଆ': {
    langLabel: 'ଭାଷା:',
    whoAreYou: 'ଆପଣ କିଏ?',
    subtitle: 'ସ୍ୱାସ୍ଥ୍ୟ ପଥ ଟେଲିହେଲ୍ଥ ପୋର୍ଟାଲ୍ ବ୍ୟବହାର କରିବାକୁ ଆପଣଙ୍କ ଭୂମିକା ଚୟନ କରନ୍ତୁ।',
    patientRole: 'ରୋଗୀ (Patient)',
    patientDesc: 'ଚିକିତ୍ସା ନେଭିଗେସନ୍ ଓ ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ',
    doctorRole: 'ଡାକ୍ତର (Doctor)',
    doctorDesc: 'ଟ୍ରାଇଏଜ୍ କତାର ଓ ଡାକ୍ତରୀ ନିଷ୍ପତ୍ତି',
    pharmacyRole: 'ଔଷଧାଳୟ (Pharmacy)',
    pharmacyDesc: 'ସ୍ଥାନୀୟ ଔଷଧ ଷ୍ଟକ୍ ଯାଞ୍ଚ ଓ ଅପଡେଟ୍',
    adminRole: 'ପ୍ରଶାସକ (Admin)',
    adminDesc: 'ଜିଲ୍ଲା ସ୍ତରୀୟ ତଥ୍ୟ ଓ କେନ୍ଦ୍ର ଟେଲିମେଟ୍ରି',
    labRole: 'ନିଦାନ କେନ୍ଦ୍ର (Lab)',
    labDesc: 'ରୋଗୀଙ୍କ ଶାରୀରିକ ରିପୋର୍ଟ ଦାଖଲ ଓ ପରୀକ୍ଷା',
    loginAs: (role: string) => `${role} ଭାବେ ପ୍ରବେଶ କରନ୍ତୁ`,
    useDemo: 'ଡେମୋ ଆକାଉଣ୍ଟ୍ ବ୍ୟବହାର କରନ୍ତୁ',
    demoAccount: 'ଡେମୋ ଆକାଉଣ୍ଟ୍:',
    emailLabel: 'ଇମେଲ୍ ଠିକଣା',
    emailPlaceholder: 'ଇମେଲ୍ ଲେଖନ୍ତୁ',
    mobileLabel: 'ମୋବାଇଲ୍ ନମ୍ବର',
    mobilePlaceholder: '+91 90000 10001',
    passwordLabel: 'ପାସୱାର୍ଡ',
    passwordPlaceholder: 'ପାସୱାର୍ଡ ଲେଖନ୍ତୁ',
    location: 'ସ୍ଥାନ:',
    invalidCreds: 'ତ୍ରୁଟିପୂର୍ଣ୍ଣ ପ୍ରମାଣପତ୍ର। ଆପଣାଛାଏଁ ତଥ୍ୟ ପୂରଣ କରିବାକୁ ଉପରେ ଥିବା [ଡେମୋ ଆକାଉଣ୍ଟ୍ ବ୍ୟବହାର କରନ୍ତୁ] ବଟନ୍ କ୍ଲିକ୍ କରନ୍ତୁ।',
    rolesMap: {
      patient: 'ରୋଗୀ',
      doctor: 'ଡାକ୍ତର',
      pharmacy: 'ଔଷଧାଳୟ',
      admin: 'ପ୍ରଶାସକ',
      lab: 'ଡାକ୍ତରୀ ନିଦାନ କେନ୍ଦ୍ର'
    }
  },
  'हिन्दी': {
    langLabel: 'भाषा:',
    whoAreYou: 'आप कौन हैं?',
    subtitle: 'स्वास्थ्य पथ टेलीहेल्थ पोर्टल का उपयोग करने के लिए अपनी भूमिका चुनें।',
    patientRole: 'रोगी (Patient)',
    patientDesc: 'देखभाल नेविगेशन और स्वास्थ्य रिकॉर्ड',
    doctorRole: 'चिकित्सक (Doctor)',
    doctorDesc: 'ट्राइएज कतार और नैदानिक निर्णय',
    pharmacyRole: 'फार्मेसी (Pharmacy)',
    pharmacyDesc: 'स्थानीय दवा स्टॉक जांच और अपडेट',
    adminRole: 'व्यवस्थापक (Admin)',
    adminDesc: 'जिला प्रभाव एवं स्वास्थ्य केंद्र टेलीमेट्री',
    labRole: 'डायग्नोस्टिक लैब',
    labDesc: 'शारीरिक रिपोर्ट जमा एवं पैथोलॉजी टेस्ट',
    loginAs: (role: string) => `${role} के रूप में लॉगिन करें`,
    useDemo: 'डेमो खाता उपयोग करें',
    demoAccount: 'डेमो खाता:',
    emailLabel: 'ईमेल पता',
    emailPlaceholder: 'ईमेल पता दर्ज करें',
    mobileLabel: 'मोबाइल नंबर',
    mobilePlaceholder: '+91 90000 10001',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'पासवर्ड दर्ज करें',
    location: 'स्थान:',
    invalidCreds: 'अमान्य क्रेडेंशियल्स। आवश्यक डेमो क्रेडेंशियल्स ऑटो-भरने के लिए ऊपर [डेमो खाता उपयोग करें] पर क्लिक करें।',
    rolesMap: {
      patient: 'रोगी',
      doctor: 'डॉक्टर',
      pharmacy: 'फार्मेसी',
      admin: 'व्यवस्थापक',
      lab: 'डायग्नोस्टिक लैब एवं मेडिकल सेंटर'
    }
  }
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, lang, onSelectLang }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('patient');
  const [email, setEmail] = useState(DEMO_USERS.patient.email);
  const [mobile, setMobile] = useState(DEMO_USERS.patient.mobile);
  const [password, setPassword] = useState('Demo@123');
  const [errorMsg, setErrorMsg] = useState('');

  const t = LOGIN_I18N[lang] || LOGIN_I18N.English;

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
      setErrorMsg(t.invalidCreds);
      return;
    }

    setErrorMsg('');
    onLoginSuccess(expected);
  };

  const roleDisplay = t.rolesMap[selectedRole];

  return (
    <div className="login-screen-wrap">
      {/* Prominent Language Bar (Prompt Section 7) */}
      {onSelectLang && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>{t.langLabel}</span>
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
          <h2 style={{ marginBottom: '6px' }}>{t.whoAreYou}</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '440px', margin: '0 auto' }}>
            {t.subtitle}
          </p>
        </div>

        {/* 5 Portal Role Selection Cards */}
        <div className="role-selector-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
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
            <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>{t.patientRole}</strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>
              {t.patientDesc}
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
            <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>{t.doctorRole}</strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>
              {t.doctorDesc}
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
            <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>{t.pharmacyRole}</strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>
              {t.pharmacyDesc}
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
            <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>{t.adminRole}</strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>
              {t.adminDesc}
            </span>
          </button>

          <button
            type="button"
            className={`role-card-btn ${selectedRole === 'lab' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('lab')}
            aria-pressed={selectedRole === 'lab'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FlaskConical size={20} />
              </div>
              {selectedRole === 'lab' && <CheckCircle2 size={18} style={{ color: '#168cff' }} />}
            </div>
            <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>{t.labRole}</strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>
              {t.labDesc}
            </span>
          </button>
        </div>

        {/* Selected Portal Form */}
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--navy-mid)' }}>
                {t.loginAs(roleDisplay)}
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
                <span>{t.useDemo}</span>
              </button>
            </div>

            {/* Demo Credentials Helper Box */}
            <div className="demo-credentials-box">
              <div style={{ fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} style={{ color: '#0b4a92' }} />
                <span>{t.demoAccount}</span>
                <span style={{ color: '#0b4a92' }}>{DEMO_USERS[selectedRole].name}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '12px' }}>
                <div><strong>Email:</strong> {DEMO_USERS[selectedRole].email}</div>
                <div><strong>Mobile:</strong> {DEMO_USERS[selectedRole].mobile}</div>
                <div><strong>Password:</strong> Demo@123</div>
                <div><strong>{t.location}</strong> {DEMO_USERS[selectedRole].location}</div>
              </div>
            </div>

            <div className="field">
              <label htmlFor="login-email">{t.emailLabel}</label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
              />
            </div>

            <div className="field">
              <label htmlFor="login-mobile">{t.mobileLabel}</label>
              <input
                id="login-mobile"
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder={t.mobilePlaceholder}
              />
            </div>

            <div className="field">
              <label htmlFor="login-password">{t.passwordLabel}</label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
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
              <span>{t.loginAs(roleDisplay)}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
