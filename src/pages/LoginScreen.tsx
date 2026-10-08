import React, { useState } from 'react';
import {
  User,
  Stethoscope,
  Pill,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Key,
  Building2,
  FlaskConical,
  Phone,
  Lock,
  UserPlus,
  LogIn,
  Calendar,
  MapPin,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { Role, DemoUser, Language } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { storage } from '../utils/storage';
import { getTranslation } from '../utils/translations';

interface LoginScreenProps {
  onLoginSuccess: (user: DemoUser) => void;
  lang: Language;
  onSelectLang?: (lang: Language) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, lang, onSelectLang }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('patient');

  // Login form state
  const [loginMode, setLoginMode] = useState<'otp' | 'credentials'>('otp');
  const [loginMobile, setLoginMobile] = useState(DEMO_USERS.patient.mobile);
  const [loginOtp, setLoginOtp] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [email, setEmail] = useState(DEMO_USERS.patient.email);
  const [password, setPassword] = useState('Demo@123');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Patient Registration fields
  const [regMobile, setRegMobile] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regOtpVerified, setRegOtpVerified] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientDob, setPatientDob] = useState('1984-06-15');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientLanguage, setPatientLanguage] = useState<Language>(lang);
  const [patientLocation, setPatientLocation] = useState('Karlamunda Block, Kalahandi, Odisha');
  const [patientEmergencyContact, setPatientEmergencyContact] = useState('Subash Rout (+91 94370 21980)');
  const [patientConsent, setPatientConsent] = useState(true);

  // Doctor Registration fields
  const [docName, setDocName] = useState('');
  const [docQualification, setDocQualification] = useState('MBBS, MD (Medicine)');
  const [docRegNumber, setDocRegNumber] = useState('OSMC/2019/8472');
  const [docSpecialty, setDocSpecialty] = useState('General Medicine');
  const [docHospital, setDocHospital] = useState('District Headquarters Hospital, Bhawanipatna');
  const [docWorkingHours, setDocWorkingHours] = useState('09:00 AM - 05:00 PM (Mon-Sat)');
  const [docLanguages, setDocLanguages] = useState('Odia, Hindi, English');
  const [docEmergencyAvail, setDocEmergencyAvail] = useState(true);
  const [docLeaveSchedule, setDocLeaveSchedule] = useState('None currently scheduled');
  const [docConsent, setDocConsent] = useState(true);

  // Pharmacy Registration fields
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyOwner, setPharmacyOwner] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('Karlamunda Market Square, Kalahandi');
  const [pharmacyHours, setPharmacyHours] = useState('08:00 AM - 09:30 PM');
  const [pharmacyHoliday, setPharmacyHoliday] = useState('Open 7 days; Sunday evening half-day');
  const [pharmacyStockSetup, setPharmacyStockSetup] = useState('Essential Generic Medicine Formulary (50 items)');

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEmail(DEMO_USERS[role]?.email || '');
    setLoginMobile(DEMO_USERS[role]?.mobile || '');
    setPassword('Demo@123');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleFillDemo = () => {
    const demo = DEMO_USERS[selectedRole];
    if (demo) {
      setEmail(demo.email);
      setLoginMobile(demo.mobile);
      setPassword('Demo@123');
      setLoginOtp('123456');
      setLoginOtpSent(true);
      setErrorMsg('');
      setSuccessMsg(`Loaded demo credentials for ${demo.name}`);
    }
  };

  const handleSendLoginOtp = () => {
    if (!loginMobile || loginMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoginOtpSent(true);
    setLoginOtp('123456');
    setErrorMsg('');
    setSuccessMsg('Simulated OTP sent to mobile: 123456 (SMS Gateway Demo)');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (loginMode === 'otp') {
      if (!loginOtpSent) {
        setErrorMsg('Please click "Send OTP" first.');
        return;
      }
      if (loginOtp.trim() !== '123456') {
        setErrorMsg('Invalid OTP. Please enter 123456 for the demo simulation.');
        return;
      }
      // Log in with matching demo user or registered user
      const demo = DEMO_USERS[selectedRole];
      if (demo) {
        onLoginSuccess(demo);
        return;
      }
    }

    // Credentials Login Fallback
    const expected = DEMO_USERS[selectedRole];
    if (
      email.trim().toLowerCase() === expected.email.toLowerCase() &&
      password === 'Demo@123'
    ) {
      onLoginSuccess(expected);
      return;
    }

    setErrorMsg(
      lang === 'ଓଡ଼ିଆ'
        ? 'ପ୍ରମାଣପତ୍ର ଭୁଲ୍ ଅଛି। ସ୍ୱୟଂଚାଳିତ ତଥ୍ୟ ପାଇଁ [ଡେମୋ ଆକାଉଣ୍ଟ୍ ବ୍ୟବହାର କରନ୍ତୁ] ଚୟନ କରନ୍ତୁ।'
        : lang === 'हिन्दी'
        ? 'अमान्य क्रेडेंशियल्स। ऑटो-फिल के लिए [डेमो खाता उपयोग करें] पर क्लिक करें।'
        : 'Invalid credentials. Please click [Use Demo Account] above to auto-fill valid credentials.'
    );
  };

  // Registration OTP Handlers
  const handleSendRegOtp = () => {
    if (!regMobile || regMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for registration.');
      return;
    }
    setRegOtpSent(true);
    setRegOtp('123456');
    setErrorMsg('');
    setSuccessMsg('Verification OTP dispatched: 123456 (Simulated SMS OTP)');
  };

  const handleVerifyRegOtp = () => {
    if (regOtp.trim() === '123456') {
      setRegOtpVerified(true);
      setErrorMsg('');
      setSuccessMsg('Mobile verified successfully via OTP! Complete the details below.');
    } else {
      setErrorMsg('Incorrect OTP. Please enter 123456.');
    }
  };

  // Submit Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regOtpVerified) {
      setErrorMsg('Please verify your mobile number with OTP first.');
      return;
    }

    if (selectedRole === 'patient') {
      if (!patientName.trim()) {
        setErrorMsg('Please enter patient full name.');
        return;
      }
      if (!patientConsent) {
        setErrorMsg('Consent is required to create your longitudinal health record.');
        return;
      }

      const newPatientUser: DemoUser = {
        role: 'patient',
        name: patientName,
        email: `${patientName.toLowerCase().replace(/\s+/g, '')}@telehealth.gov.in`,
        mobile: regMobile,
        location: patientLocation,
        healthFacility: 'Karlamunda Ayushman Arogya Mandir'
      };

      storage.registerUser({
        ...newPatientUser,
        dob: patientDob,
        gender: patientGender,
        preferredLanguage: patientLanguage,
        emergencyContact: patientEmergencyContact,
        consentGranted: true,
        consentWording: 'May I issue and share health records with authorized clinicians in accordance with ABDM standards.'
      });

      onLoginSuccess(newPatientUser);
    } else if (selectedRole === 'doctor') {
      if (!docName.trim()) {
        setErrorMsg('Please enter doctor full name.');
        return;
      }
      if (!docConsent) {
        setErrorMsg('Doctor professional registry consent is required.');
        return;
      }

      const newDoctorUser: DemoUser = {
        role: 'doctor',
        name: docName.startsWith('Dr.') ? docName : `Dr. ${docName}`,
        email: `${docName.toLowerCase().replace(/[^a-z]/g, '')}@dhh.odisha.gov.in`,
        mobile: regMobile,
        location: docHospital,
        healthFacility: docHospital
      };

      // Add to doctor directory in storage
      storage.saveDoctor({
        id: `doc-${Date.now()}`,
        name: newDoctorUser.name,
        specialty: docSpecialty,
        hospital: docHospital,
        facility: docHospital,
        status: 'Available',
        nextSlot: 'Available Now',
        nextAvailable: 'Available Now',
        languages: docLanguages.split(',').map((s) => s.trim()),
        emergencyDuty: docEmergencyAvail,
        rating: 5.0,
        available: true,
        experience: docQualification,
        fees: 'Free (Govt Telehealth Service)'
      });

      storage.registerUser({
        ...newDoctorUser,
        qualification: docQualification,
        registrationNumber: docRegNumber,
        specialty: docSpecialty,
        workingHours: docWorkingHours,
        emergencyDuty: docEmergencyAvail
      });

      onLoginSuccess(newDoctorUser);
    } else if (selectedRole === 'pharmacy') {
      if (!pharmacyName.trim()) {
        setErrorMsg('Please enter pharmacy name.');
        return;
      }

      const newPharmacyUser: DemoUser = {
        role: 'pharmacy',
        name: pharmacyOwner ? `${pharmacyName} (${pharmacyOwner})` : pharmacyName,
        email: `${pharmacyName.toLowerCase().replace(/[^a-z]/g, '')}@ruralpharma.in`,
        mobile: regMobile,
        location: pharmacyAddress,
        healthFacility: pharmacyName
      };

      storage.updatePharmacyStatus({
        pharmacyName,
        ownerContact: pharmacyOwner ? `${pharmacyOwner} (${regMobile})` : regMobile,
        operatingHours: pharmacyHours,
        holidayNotice: pharmacyHoliday,
        status: 'Open'
      });

      storage.registerUser({
        ...newPharmacyUser,
        pharmacyName,
        address: pharmacyAddress,
        hours: pharmacyHours
      });

      onLoginSuccess(newPharmacyUser);
    } else if (selectedRole === 'lab') {
      const newLabUser: DemoUser = {
        role: 'lab',
        name: patientName.trim() || 'Central Pathology & Diagnostic Lab',
        email: email || 'pathology@dhh.ruralhealth.in',
        mobile: regMobile || '9861000000',
        location: patientLocation || 'DHH Bhawanipatna',
        healthFacility: 'DHH Central Pathology Hub'
      };

      storage.saveManagedUser({
        id: `usr-${Date.now()}`,
        name: newLabUser.name,
        role: 'lab',
        email: newLabUser.email,
        mobile: newLabUser.mobile,
        location: newLabUser.location,
        verificationStatus: 'VERIFICATION PENDING',
        accountStatus: 'Pending',
        documentsSubmitted: ['NABL Scope Certificate', 'Clinical Establishments Act Registration'],
        registeredAt: 'Today',
        lastActive: 'Just now',
        facilityName: 'DHH Bhawanipatna Central Lab'
      });

      onLoginSuccess(newLabUser);
    } else if (selectedRole === 'admin') {
      const newAdminUser: DemoUser = {
        role: 'admin',
        name: patientName.trim() || 'District Health Administrator',
        email: email || 'admin.kalahandi@ruralhealth.in',
        mobile: regMobile || '9861000000',
        location: patientLocation || 'CDMO Directorate, Kalahandi'
      };

      storage.saveManagedUser({
        id: `usr-${Date.now()}`,
        name: newAdminUser.name,
        role: 'admin',
        email: newAdminUser.email,
        mobile: newAdminUser.mobile,
        location: newAdminUser.location,
        verificationStatus: 'VERIFIED',
        accountStatus: 'Active',
        registeredAt: 'Today',
        lastActive: 'Just now'
      });

      onLoginSuccess(newAdminUser);
    }
  };

  const roleTitle =
    selectedRole === 'patient'
      ? getTranslation(lang, 'rolePatient')
      : selectedRole === 'doctor'
      ? getTranslation(lang, 'roleDoctor')
      : selectedRole === 'pharmacy'
      ? getTranslation(lang, 'rolePharmacy')
      : selectedRole === 'lab'
      ? 'Diagnostic Lab'
      : 'Administrator';

  return (
    <div className="login-screen-wrap" style={{ maxWidth: '640px', margin: '20px auto', padding: '0 16px' }}>
      {/* Language Bar */}
      {onSelectLang && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
            {lang === 'ଓଡ଼ିଆ' ? 'ଭାଷା ବାଛନ୍ତୁ:' : lang === 'हिन्दी' ? 'भाषा चुनें:' : 'Language:'}
          </span>
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

      <div className="card" style={{ padding: '28px', borderRadius: '16px', background: '#ffffff', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0284c7, #06b6d4)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              boxShadow: '0 6px 18px rgba(2, 132, 199, 0.35)'
            }}
          >
            <ShieldCheck size={30} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
            {getTranslation(lang, 'appName')}
          </h2>
          <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>
            {getTranslation(lang, 'tagline')}
          </p>
        </div>

        {/* Primary Tab Switcher: "Log in" vs "Create account" */}
        <div
          style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === 'login' ? '#ffffff' : 'transparent',
              color: activeTab === 'login' ? '#0284c7' : '#64748b',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeTab === 'login' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <LogIn size={16} />
            <span>{getTranslation(lang, 'logIn')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === 'register' ? '#ffffff' : 'transparent',
              color: activeTab === 'register' ? '#0284c7' : '#64748b',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeTab === 'register' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <UserPlus size={16} />
            <span>{getTranslation(lang, 'createAccount')}</span>
          </button>
        </div>

        {/* Role Selector Grid */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
            {lang === 'ଓଡ଼ିଆ' ? 'ଭୂମିକା ଚୟନ କରନ୍ତୁ:' : lang === 'हिन्दी' ? 'भूमिका चुनें:' : 'Select Your Role:'}
          </label>
          <div className="role-selector-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
            <button
              type="button"
              className={`role-card-btn ${selectedRole === 'patient' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('patient')}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                <User size={18} />
              </div>
              <strong style={{ fontSize: '12px', display: 'block' }}>{getTranslation(lang, 'rolePatient')}</strong>
            </button>

            <button
              type="button"
              className={`role-card-btn ${selectedRole === 'doctor' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('doctor')}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf3', color: '#027a48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                <Stethoscope size={18} />
              </div>
              <strong style={{ fontSize: '12px', display: 'block' }}>{getTranslation(lang, 'roleDoctor')}</strong>
            </button>

            <button
              type="button"
              className={`role-card-btn ${selectedRole === 'pharmacy' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('pharmacy')}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3f2', color: '#b42318', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                <Pill size={18} />
              </div>
              <strong style={{ fontSize: '12px', display: 'block' }}>{getTranslation(lang, 'rolePharmacy')}</strong>
            </button>

            <button
              type="button"
              className={`role-card-btn ${selectedRole === 'lab' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('lab')}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                <FlaskConical size={18} />
              </div>
              <strong style={{ fontSize: '12px', display: 'block' }}>Pathology</strong>
            </button>

            <button
              type="button"
              className={`role-card-btn ${selectedRole === 'admin' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('admin')}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                <Building2 size={18} />
              </div>
              <strong style={{ fontSize: '12px', display: 'block' }}>Administrator</strong>
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="alert danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', padding: '10px 14px', borderRadius: '8px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px' }}>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="alert success" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', padding: '10px 14px', borderRadius: '8px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px' }}>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: LOG IN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="loginMode"
                    checked={loginMode === 'otp'}
                    onChange={() => setLoginMode('otp')}
                  />
                  <span>OTP Login (Fast)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="loginMode"
                    checked={loginMode === 'credentials'}
                    onChange={() => setLoginMode('credentials')}
                  />
                  <span>Password Login</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleFillDemo}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #0284c7',
                  background: '#f0f9ff',
                  color: '#0284c7',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
                title="Auto-fill demo credentials"
              >
                <Sparkles size={12} />
                <span>Auto-fill Demo</span>
              </button>
            </div>

            {loginMode === 'otp' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="field">
                  <label htmlFor="login-mobile-input" style={{ fontSize: '12px', fontWeight: 600 }}>
                    <Phone size={13} style={{ display: 'inline', marginRight: '4px' }} />
                    {getTranslation(lang, 'enterMobile')}
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      id="login-mobile-input"
                      type="tel"
                      value={loginMobile}
                      onChange={(e) => setLoginMobile(e.target.value)}
                      placeholder="+91 90000 10001"
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                    <button
                      type="button"
                      onClick={handleSendLoginOtp}
                      style={{
                        padding: '8px 14px',
                        background: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {getTranslation(lang, 'sendOtp')}
                    </button>
                  </div>
                </div>

                {loginOtpSent && (
                  <div className="field">
                    <label htmlFor="login-otp-input" style={{ fontSize: '12px', fontWeight: 600 }}>
                      <Lock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      {getTranslation(lang, 'enterOtp')}
                    </label>
                    <input
                      id="login-otp-input"
                      type="text"
                      maxLength={6}
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value)}
                      placeholder="123456"
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', letterSpacing: '4px', fontSize: '16px', fontWeight: 700, textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      {getTranslation(lang, 'otpSentMsg')}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '12px',
                fontSize: '15px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{getTranslation(lang, 'logIn')} ({roleTitle})</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* TAB 2: CREATE ACCOUNT (OTP BASED REGISTRATION) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                Step 1: Mobile OTP Verification
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="tel"
                  value={regMobile}
                  onChange={(e) => setRegMobile(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  disabled={regOtpVerified}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
                {!regOtpVerified && (
                  <button
                    type="button"
                    onClick={handleSendRegOtp}
                    style={{
                      padding: '8px 12px',
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {getTranslation(lang, 'sendOtp')}
                  </button>
                )}
              </div>

              {regOtpSent && !regOtpVerified && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    maxLength={6}
                    value={regOtp}
                    onChange={(e) => setRegOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP (123456)"
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', letterSpacing: '2px', textAlign: 'center' }}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyRegOtp}
                    style={{
                      padding: '8px 14px',
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {getTranslation(lang, 'verifyOtp')}
                  </button>
                </div>
              )}

              {regOtpVerified && (
                <div style={{ color: '#16a34a', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} />
                  <span>Mobile verified: +91 {regMobile}</span>
                </div>
              )}
            </div>

            {/* Step 2: Role-Specific Details */}
            {selectedRole === 'patient' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Majhi"
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="field">
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>Date of Birth / Age</label>
                    <input
                      type="date"
                      value={patientDob}
                      onChange={(e) => setPatientDob(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div className="field">
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>Gender</label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Preferred Language</label>
                  <select
                    value={patientLanguage}
                    onChange={(e) => setPatientLanguage(e.target.value as Language)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="ଓଡ଼ିଆ">ଓଡ଼ିଆ (Odia)</option>
                    <option value="English">English</option>
                    <option value="हिन्दी">हिन्दी (Hindi)</option>
                  </select>
                </div>

                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Village / Block / Location</label>
                  <input
                    type="text"
                    value={patientLocation}
                    onChange={(e) => setPatientLocation(e.target.value)}
                    placeholder="e.g. Karlamunda Block, Kalahandi"
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Emergency Contact</label>
                  <input
                    type="text"
                    value={patientEmergencyContact}
                    onChange={(e) => setPatientEmergencyContact(e.target.value)}
                    placeholder="e.g. Subash Rout (+91 94370 21980)"
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                {/* Consent & Privacy per Section 3 requirements */}
                <div style={{ marginTop: '8px', padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={patientConsent}
                      onChange={(e) => setPatientConsent(e.target.checked)}
                      style={{ marginTop: '3px' }}
                    />
                    <span>
                      <strong>{getTranslation(lang, 'consentCheckbox')}</strong>
                    </span>
                  </label>
                  <p style={{ margin: '6px 0 0 24px', fontSize: '11px', color: '#64748b' }}>
                    {getTranslation(lang, 'privacyNotice')}
                  </p>
                </div>
              </div>
            )}

            {selectedRole === 'doctor' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Clinician Full Name *</label>
                  <input
                    type="text"
                    required
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="Dr. Srikant Behera"
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="field">
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>Medical Qualification</label>
                    <input
                      type="text"
                      value={docQualification}
                      onChange={(e) => setDocQualification(e.target.value)}
                      placeholder="MBBS, MD"
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div className="field">
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>Medical License / Registration</label>
                    <input
                      type="text"
                      value={docRegNumber}
                      onChange={(e) => setDocRegNumber(e.target.value)}
                      placeholder="OSMC/2019/8472"
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="field">
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>Specialty</label>
                    <input
                      type="text"
                      value={docSpecialty}
                      onChange={(e) => setDocSpecialty(e.target.value)}
                      placeholder="General Medicine / Paediatrics"
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div className="field">
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>Hospital / Clinic Hub</label>
                    <input
                      type="text"
                      value={docHospital}
                      onChange={(e) => setDocHospital(e.target.value)}
                      placeholder="DHH Bhawanipatna"
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Working Hours & Languages</label>
                  <input
                    type="text"
                    value={docWorkingHours}
                    onChange={(e) => setDocWorkingHours(e.target.value)}
                    placeholder="09:00 AM - 05:00 PM"
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={docConsent}
                      onChange={(e) => setDocConsent(e.target.checked)}
                    />
                    <span>I declare that I am a licensed medical practitioner under the National Medical Commission.</span>
                  </label>
                </div>
              </div>
            )}

            {selectedRole === 'pharmacy' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Pharmacy Store Name *</label>
                  <input
                    type="text"
                    required
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    placeholder="e.g. Maa Tarini Medical Store"
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Owner / Licensed Chemist Name</label>
                  <input
                    type="text"
                    value={pharmacyOwner}
                    onChange={(e) => setPharmacyOwner(e.target.value)}
                    placeholder="e.g. Bipin Nayak (Reg. Pharmacist)"
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Physical Address & Landmark</label>
                  <input
                    type="text"
                    value={pharmacyAddress}
                    onChange={(e) => setPharmacyAddress(e.target.value)}
                    placeholder="e.g. Main Road, Karlamunda Block"
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="field">
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>Opening Hours</label>
                    <input
                      type="text"
                      value={pharmacyHours}
                      onChange={(e) => setPharmacyHours(e.target.value)}
                      placeholder="08:00 AM - 09:30 PM"
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div className="field">
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>Holiday Schedule</label>
                    <input
                      type="text"
                      value={pharmacyHoliday}
                      onChange={(e) => setPharmacyHoliday(e.target.value)}
                      placeholder="Sunday evening half-day"
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Medicine Inventory Setup</label>
                  <input
                    type="text"
                    value={pharmacyStockSetup}
                    onChange={(e) => setPharmacyStockSetup(e.target.value)}
                    placeholder="Default essential rural medicine list"
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '12px',
                fontSize: '15px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{getTranslation(lang, 'createAccount')} ({roleTitle})</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
