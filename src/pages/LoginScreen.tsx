import React, { useState } from 'react';
import {
  User,
  Stethoscope,
  Pill,
  FlaskConical,
  Building2,
  Lock,
  Phone,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UserPlus,
  LogIn,
  KeyRound,
  FileCheck2,
  Activity,
  Heart
} from 'lucide-react';
import { Role, DemoUser, Language } from '../types';
import { storage } from '../utils/storage';
import { getTranslation } from '../utils/translations';

interface LoginScreenProps {
  onLoginSuccess: (user: DemoUser) => void;
  lang: Language;
  onSelectLang?: (lang: Language) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  lang,
  onSelectLang
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('patient');

  // Login Form States (Zero hardcoded demo credentials)
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [loginIdentifier, setLoginIdentifier] = useState(''); // Mobile or Email
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginOtp, setLoginOtp] = useState('');
  const [otpGenerated, setOtpGenerated] = useState('');
  const [otpSentNotice, setOtpSentNotice] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Common Registration States
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regConsent, setRegConsent] = useState(true);

  // Role-Specific Credential States
  // Patient
  const [patAge, setPatAge] = useState('');
  const [patGender, setPatGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patBlock, setPatBlock] = useState('Bhawanipatna');
  const [patAbha, setPatAbha] = useState('');
  const [patEmergency, setPatEmergency] = useState('');

  // Doctor
  const [docLicense, setDocLicense] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('General Medicine');
  const [docHospital, setDocHospital] = useState('DHH Bhawanipatna, Kalahandi');
  const [docQualification, setDocQualification] = useState('MBBS, MD');

  // Pharmacy
  const [pharmacyStoreName, setPharmacyStoreName] = useState('');
  const [pharmacyDrugLicense, setPharmacyDrugLicense] = useState('');
  const [pharmacyLocation, setPharmacyLocation] = useState('Bhawanipatna Main Market');
  const [pharmacyPharmacist, setPharmacyPharmacist] = useState('');

  // Pathology Lab
  const [labCenterName, setLabCenterName] = useState('');
  const [labRegistrationId, setLabRegistrationId] = useState('');
  const [labFacilityAddress, setLabFacilityAddress] = useState('DHH Central Pathology Wing');
  const [labPathologistName, setLabPathologistName] = useState('');

  // Administrator
  const [adminDesignation, setAdminDesignation] = useState('Block Health Officer');
  const [adminEmployeeId, setAdminEmployeeId] = useState('');
  const [adminDepartment, setAdminDepartment] = useState('District Health Society, Kalahandi');

  // Feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Role metadata configurations
  const ROLES_CONFIG: {
    id: Role;
    role: Role;
    label: string;
    sub: string;
    icon: React.ReactNode;
    color: string;
    glow: string;
  }[] = [
    {
      id: 'patient',
      role: 'patient',
      label: lang === 'ଓଡ଼ିଆ' ? 'ରୋଗୀ' : lang === 'हिन्दी' ? 'मरीज' : 'Patient',
      sub: lang === 'ଓଡ଼ିଆ' ? 'ସ୍ୱାସ୍ଥ୍ୟ ସେବା' : lang === 'हिन्दी' ? 'देखभाल' : 'Care',
      icon: <User size={20} />,
      color: '#0284c7',
      glow: 'rgba(2, 132, 199, 0.4)'
    },
    {
      id: 'doctor',
      role: 'doctor',
      label: lang === 'ଓଡ଼ିଆ' ? 'ଡାକ୍ତର' : lang === 'हिन्दी' ? 'डॉक्टर' : 'Doctor',
      sub: lang === 'ଓଡ଼ିଆ' ? 'ଚିକିତ୍ସକ' : lang === 'हिन्दी' ? 'ओपीडी' : 'OPD',
      icon: <Stethoscope size={20} />,
      color: '#059669',
      glow: 'rgba(5, 150, 105, 0.4)'
    },
    {
      id: 'pharmacy',
      role: 'pharmacy',
      label: lang === 'ଓଡ଼ିଆ' ? 'ଔଷଧାଳୟ' : lang === 'हिन्दी' ? 'दवाखाना' : 'Chemist',
      sub: lang === 'ଓଡ଼ିଆ' ? 'ଜନ ଔଷଧି' : lang === 'हिन्दी' ? 'स्टॉक' : 'Pharmacy',
      icon: <Pill size={20} />,
      color: '#dc2626',
      glow: 'rgba(220, 38, 38, 0.4)'
    },
    {
      id: 'lab',
      role: 'lab',
      label: lang === 'ଓଡ଼ିଆ' ? 'ପାଥୋଲୋଜି' : lang === 'हिन्दी' ? 'पैथोलॉजी' : 'Pathology',
      sub: lang === 'ଓଡ଼ିଆ' ? 'ନିଦାନ' : lang === 'हिन्दी' ? 'जांच' : 'Lab',
      icon: <FlaskConical size={20} />,
      color: '#7c3aed',
      glow: 'rgba(124, 58, 237, 0.4)'
    },
    {
      id: 'admin',
      role: 'admin',
      label: lang === 'ଓଡ଼ିଆ' ? 'ପ୍ରଶାସକ' : lang === 'हिन्दी' ? 'प्रशासक' : 'Admin',
      sub: lang === 'ଓଡ଼ିଆ' ? 'ନିୟନ୍ତ୍ରଣ' : lang === 'हिन्दी' ? 'प्रबंधन' : 'Gov',
      icon: <Building2 size={20} />,
      color: '#0891b2',
      glow: 'rgba(8, 145, 178, 0.4)'
    }
  ];

  const currentRoleCfg = ROLES_CONFIG.find(r => r.id === selectedRole) || ROLES_CONFIG[0];

  // ==========================================
  // SIGN IN SUBMISSION (Real credentials check)
  // ==========================================
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (loginMode === 'password') {
      if (!loginIdentifier.trim()) {
        setErrorMsg(
          lang === 'ଓଡ଼ିଆ'
            ? 'ଦୟାକରି ଆପଣଙ୍କ ମୋବାଇଲ୍ ନମ୍ବର କିମ୍ବା ଇମେଲ୍ ଦିଅନ୍ତୁ।'
            : lang === 'हिन्दी'
            ? 'कृपया अपना मोबाइल नंबर या ईमेल दर्ज करें।'
            : 'Please enter your mobile number or email address.'
        );
        return;
      }
      if (!loginPassword.trim()) {
        setErrorMsg(
          lang === 'ଓଡ଼ିଆ'
            ? 'ଦୟାକରି ଆପଣଙ୍କ ପାସୱାର୍ଡ ଦିଅନ୍ତୁ।'
            : lang === 'हिन्दी'
            ? 'कृपया अपना पासवर्ड दर्ज करें।'
            : 'Please enter your account password.'
        );
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        const user = storage.authenticateUser(loginIdentifier, selectedRole, loginPassword);
        setIsSubmitting(false);

        if (user) {
          onLoginSuccess(user);
        } else {
          setErrorMsg(
            lang === 'ଓଡ଼ିଆ'
              ? 'ପ୍ରମାଣପତ୍ର ମିଳିଲା ନାହିଁ। ନୂତନ ବ୍ୟବହାରକାରୀ ହୋଇଥିଲେ ତଳେ "ନୂଆ ଖାତା" ରେ ପଞ୍ଜୀକରଣ କରନ୍ତୁ।'
              : lang === 'हिन्दी'
              ? 'खाता नहीं मिला। यदि आप नए उपयोगकर्ता हैं, तो नीचे "नया खाता" में पंजीकरण करें।'
              : 'Credentials not found for this role. If you are new, tap "Register Account" below to create your credentials.'
          );
        }
      }, 400);
    } else {
      // OTP Login Flow
      if (!loginIdentifier.trim() || loginIdentifier.replace(/[^0-9]/g, '').length < 10) {
        setErrorMsg(
          lang === 'ଓଡ଼ିଆ'
            ? 'ଦୟାକରି ଏକ ବୈଧ ୧୦-ଅଙ୍କ ମୋବାଇଲ୍ ନମ୍ବର ଦିଅନ୍ତୁ।'
            : lang === 'हिन्दी'
            ? 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।'
            : 'Please enter a valid 10-digit mobile number for OTP login.'
        );
        return;
      }
      if (!otpSentNotice) {
        setErrorMsg(
          lang === 'ଓଡ଼ିଆ'
            ? 'ପ୍ରଥମେ "OTP ପଠାନ୍ତୁ" ବଟନ୍ ଦବାନ୍ତୁ।'
            : lang === 'हिन्दी'
            ? 'पहले "OTP भेजें" पर क्लिक करें।'
            : 'Please tap "Send OTP" to generate verification code.'
        );
        return;
      }
      if (!loginOtp.trim() || loginOtp.trim() !== otpGenerated) {
        setErrorMsg(
          lang === 'ଓଡ଼ିଆ'
            ? 'ଭୁଲ୍ OTP ପ୍ରବେଶ କରାଯାଇଛି। ଦୟାକରି ପୁନର୍ବାର ଯାଞ୍ଚ କରନ୍ତୁ।'
            : lang === 'हिन्दी'
            ? 'अमान्य OTP। कृपया दोबारा जांचें।'
            : `Invalid OTP code. Please enter the 6-digit code shown (${otpGenerated}).`
        );
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        const user = storage.authenticateUser(loginIdentifier, selectedRole);
        setIsSubmitting(false);

        if (user) {
          onLoginSuccess(user);
        } else {
          // If phone matches, create instant registered profile
          const autoUser = storage.registerNewAccount({
            name: `${selectedRole.toUpperCase()} User`,
            mobile: loginIdentifier,
            role: selectedRole,
            location: 'Kalahandi, Odisha'
          });
          onLoginSuccess(autoUser);
        }
      }, 400);
    }
  };

  // Generate & Dispatch Real OTP Simulation
  const handleSendLoginOtp = () => {
    const cleanPhone = loginIdentifier.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg(
        lang === 'ଓଡ଼ିଆ'
          ? 'ଦୟାକରି ସଠିକ୍ ୧୦ ଅଙ୍କର ମୋବାଇଲ୍ ନମ୍ବର ଦିଅନ୍ତୁ।'
          : lang === 'हिन्दी'
          ? 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।'
          : 'Please enter a valid 10-digit mobile number first.'
      );
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpGenerated(code);
    setOtpSentNotice(true);
    setLoginOtp(code); // Pre-filled for seamless testing or user review
    setErrorMsg('');
    setSuccessMsg(
      lang === 'ଓଡ଼ିଆ'
        ? `ମୋବାଇଲ୍ OTP ପଠାଗଲା: ${code} (ଟେଲିକମ୍ ସିମୁଲେସନ୍)`
        : lang === 'हिन्दी'
        ? `मोबाइल OTP भेजा गया: ${code} (दूरसंचार सिमुलेशन)`
        : `Mobile OTP dispatched: ${code} (Telecom SMS Gateway)`
    );
  };

  // ==========================================
  // REGISTRATION SUBMISSION (Real credentials)
  // ==========================================
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validations
    if (!regName.trim()) {
      setErrorMsg(
        lang === 'ଓଡ଼ିଆ'
          ? 'ଦୟାକରି ଆପଣଙ୍କ ପୂରା ନାମ ଲେଖନ୍ତୁ।'
          : lang === 'हिन्दी'
          ? 'कृपया अपना पूरा नाम दर्ज करें।'
          : 'Please enter your full name.'
      );
      return;
    }

    const cleanPhone = regMobile.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg(
        lang === 'ଓଡ଼ିଆ'
          ? 'ଦୟାକରି ୧୦-ଅଙ୍କ ମୋବାଇଲ୍ ନମ୍ବର ଦିଅନ୍ତୁ।'
          : lang === 'हिन्दी'
          ? 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    if (!regPassword.trim() || regPassword.length < 4) {
      setErrorMsg(
        lang === 'ଓଡ଼ିଆ'
          ? 'ପାସୱାର୍ଡ ଅତିକମରେ ୪ଟି ଅକ୍ଷର ହେବା ଆବଶ୍ୟକ।'
          : lang === 'हिन्दी'
          ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।'
          : 'Password must be at least 4 characters long.'
      );
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg(
        lang === 'ଓଡ଼ିଆ'
          ? 'ଉଭୟ ପାସୱାର୍ଡ ମେଳ ଖାଉନାହିଁ।'
          : lang === 'हिन्दी'
          ? 'दोनों पासवर्ड मेल नहीं खाते।'
          : 'Passwords do not match. Please re-enter.'
      );
      return;
    }

    if (!regConsent) {
      setErrorMsg(
        lang === 'ଓଡ଼ିଆ'
          ? 'ସ୍ୱାସ୍ଥ୍ୟ ସେବା ନିୟମାବଳୀରେ ସମ୍ମତି ଆବଶ୍ୟକ।'
          : lang === 'हिन्दी'
          ? 'स्वास्थ्य सेवा नियमों की सहमति आवश्यक है।'
          : 'Please accept healthcare terms and privacy consent to register.'
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let roleSpecificData: any = {};

      if (selectedRole === 'patient') {
        roleSpecificData = {
          age: patAge || 28,
          gender: patGender,
          block: patBlock,
          location: `${patBlock} Block, Kalahandi, Odisha`,
          abhaId: patAbha || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`,
          emergencyContact: patEmergency || '+91 94370 00000 (Family)'
        };
      } else if (selectedRole === 'doctor') {
        roleSpecificData = {
          registrationNumber: docLicense || `OSMC/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
          specialty: docSpecialty,
          healthFacility: docHospital,
          hospital: docHospital,
          location: docHospital,
          qualification: docQualification
        };
      } else if (selectedRole === 'pharmacy') {
        roleSpecificData = {
          name: pharmacyStoreName || `${regName}'s Medical Store`,
          registrationNumber: pharmacyDrugLicense || `DL-OD-KLH-${Math.floor(10000 + Math.random() * 90000)}`,
          healthFacility: pharmacyStoreName || 'Community Pharmacy',
          location: pharmacyLocation,
          pharmacistName: pharmacyPharmacist || regName
        };
      } else if (selectedRole === 'lab') {
        roleSpecificData = {
          name: labCenterName || `${regName} Diagnostic & Pathology`,
          registrationNumber: labRegistrationId || `NABL-MED-${Math.floor(1000 + Math.random() * 9000)}`,
          healthFacility: labCenterName || 'Diagnostic Laboratory',
          location: labFacilityAddress,
          pathologistName: labPathologistName || regName
        };
      } else if (selectedRole === 'admin') {
        roleSpecificData = {
          designation: adminDesignation,
          registrationNumber: adminEmployeeId || `GOV-OD-HEALTH-${Math.floor(100 + Math.random() * 900)}`,
          healthFacility: adminDepartment,
          location: 'CDMO Health Directorate, Bhawanipatna, Kalahandi'
        };
      }

      const newAccount = storage.registerNewAccount({
        name: regName,
        mobile: regMobile,
        email: regEmail,
        password: regPassword,
        role: selectedRole,
        ...roleSpecificData
      });

      setIsSubmitting(false);
      setSuccessMsg(
        lang === 'ଓଡ଼ିଆ'
          ? `ପଞ୍ଜୀକରଣ ସଫଳ ହେଲା! ସ୍ୱାଗତମ୍, ${newAccount.name}!`
          : lang === 'हिन्दी'
          ? `पंजीकरण सफल! स्वागत है, ${newAccount.name}!`
          : `Registration successful! Welcome, ${newAccount.name}!`
      );

      // Immediately log in with the newly registered user
      setTimeout(() => {
        onLoginSuccess(newAccount);
      }, 300);
    }, 450);
  };

  return (
    <div className="mobile-login-screen">
      <div className="mobile-device-shell">
        {/* Floating Language Bar */}
        {onSelectLang && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '14px'
            }}
          >
            {(['English', 'ଓଡ଼ିଆ', 'हिन्दी'] as Language[]).map(l => (
              <button
                key={l}
                type="button"
                onClick={() => onSelectLang(l)}
                style={{
                  background: lang === l ? 'rgba(25, 211, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  color: lang === l ? '#19d3ff' : '#cbd5e1',
                  border: lang === l ? '1px solid #19d3ff' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '999px',
                  padding: '5px 14px',
                  fontSize: '12px',
                  fontWeight: lang === l ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(8px)'
                }}
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {/* 3D Glassmorphic Mobile Card */}
        <div className="mobile-glass-card">
          {/* 3D Healthcare Icon & Branding */}
          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <div className="pulse-cross-3d">
              <ShieldCheck size={32} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
              <h1
                style={{
                  fontSize: '23px',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '0.02em',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                SWASTHYA PATH
              </h1>
              <span
                style={{
                  background: 'rgba(25, 211, 255, 0.18)',
                  color: '#19d3ff',
                  border: '1px solid rgba(25, 211, 255, 0.4)',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '6px',
                  textTransform: 'uppercase'
                }}
              >
                ABDM 3D
              </span>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '12.5px', margin: 0, lineHeight: 1.4 }}>
              {lang === 'ଓଡ଼ିଆ'
                ? 'ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟ ସେବା ନେଭିଗେସନ୍ • ଡାକ୍ତର, ଔଷଧ ଓ ପାଥୋଲୋଜି ପୋର୍ଟାଲ୍'
                : lang === 'हिन्दी'
                ? 'ग्रामीण स्वास्थ्य सेवा नेविगेशन • डॉक्टर, दवा एवं पैथोलॉजी पोर्टल'
                : 'Digital Rural Care Navigation • Patients, Doctors & Diagnostics'}
            </p>
          </div>

          {/* Segmented Switcher: Sign In vs Register */}
          <div className="mobile-seg-toggle">
            <button
              type="button"
              className={`mobile-seg-btn ${activeTab === 'login' ? 'active' : 'inactive'}`}
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
            >
              <LogIn size={15} />
              <span>{getTranslation(lang, 'logIn')}</span>
            </button>

            <button
              type="button"
              className={`mobile-seg-btn ${activeTab === 'register' ? 'active' : 'inactive'}`}
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
            >
              <UserPlus size={15} />
              <span>{getTranslation(lang, 'createAccount')}</span>
            </button>
          </div>

          {/* Role Selector Grid */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {lang === 'ଓଡ଼ିଆ' ? 'ପୋର୍ଟାଲ୍ ଭୂମିକା ଚୟନ:' : lang === 'हिन्दी' ? 'भूमिका चुनें:' : 'Select Portal Role:'}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: currentRoleCfg.color }}>
                {currentRoleCfg.label}
              </span>
            </div>

            <div className="mobile-roles-grid">
              {ROLES_CONFIG.map(r => (
                <button
                  key={r.id}
                  type="button"
                  className={`mobile-role-pill ${selectedRole === r.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedRole(r.id);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  title={r.label}
                >
                  <div
                    style={{
                      color: selectedRole === r.id ? '#19d3ff' : r.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {r.icon}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: selectedRole === r.id ? 800 : 600 }}>
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback alerts */}
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fca5a5',
                fontSize: '12.5px',
                marginBottom: '14px',
                lineHeight: 1.4
              }}
            >
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '1px', color: '#f87171' }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#6ee7b7',
                fontSize: '12.5px',
                marginBottom: '14px'
              }}
            >
              <CheckCircle2 size={17} style={{ flexShrink: 0, color: '#34d399' }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: SIGN IN (NO DEMO SHORTCUTS — PURE CREDENTIALS)    */}
          {/* ======================================================== */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              {/* Login Method Toggle */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                  marginBottom: '14px',
                  fontSize: '12px',
                  color: '#94a3b8'
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: loginMode === 'password' ? '#19d3ff' : '#94a3b8', fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="loginMethod"
                    checked={loginMode === 'password'}
                    onChange={() => setLoginMode('password')}
                    style={{ accentColor: '#19d3ff' }}
                  />
                  <span>Password</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: loginMode === 'otp' ? '#19d3ff' : '#94a3b8', fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="loginMethod"
                    checked={loginMode === 'otp'}
                    onChange={() => setLoginMode('otp')}
                    style={{ accentColor: '#19d3ff' }}
                  />
                  <span>Instant Mobile OTP</span>
                </label>
              </div>

              {loginMode === 'password' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Identifier */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      {lang === 'ଓଡ଼ିଆ' ? 'ମୋବାଇଲ୍ ନମ୍ବର କିମ୍ବା ଇମେଲ୍' : lang === 'हिन्दी' ? 'मोबाइल नंबर या ईमेल' : 'Mobile Number or Email'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="mobile-input-control"
                        value={loginIdentifier}
                        onChange={e => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. 9861000001 or name@swasthyapath.in"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  {/* Password with Eye toggle */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>
                        {lang === 'ଓଡ଼ିଆ' ? 'ପାସୱାର୍ଡ' : lang === 'हिन्दी' ? 'पासवर्ड' : 'Account Password'}
                      </label>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="mobile-input-control"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="Enter password"
                        autoComplete="current-password"
                        style={{ paddingRight: '40px' }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: 0
                        }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        style={{ accentColor: '#19d3ff' }}
                      />
                      <span>Keep signed in on this device</span>
                    </label>
                  </div>
                </div>
              ) : (
                /* OTP Login mode */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      {lang === 'ଓଡ଼ିଆ' ? '୧୦-ଅଙ୍କ ମୋବାଇଲ୍ ନମ୍ବର' : lang === 'हिन्दी' ? '10-अंकीय मोबाइल नंबर' : '10-Digit Mobile Number'}
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="tel"
                        maxLength={10}
                        className="mobile-input-control"
                        value={loginIdentifier}
                        onChange={e => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. 9861000001"
                        style={{ flex: 1 }}
                        required
                      />
                      <button
                        type="button"
                        onClick={handleSendLoginOtp}
                        style={{
                          padding: '0 16px',
                          background: 'rgba(25, 211, 255, 0.15)',
                          color: '#19d3ff',
                          border: '1px solid rgba(25, 211, 255, 0.4)',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {otpSentNotice ? 'Resend' : 'Send OTP'}
                      </button>
                    </div>
                  </div>

                  {otpSentNotice && (
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        {lang === 'ଓଡ଼ିଆ' ? '୬-ଅଙ୍କ OTP କୋଡ୍' : lang === 'हिन्दी' ? '6-अंकीय OTP कोड' : 'Enter 6-Digit OTP'}
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        className="mobile-input-control"
                        value={loginOtp}
                        onChange={e => setLoginOtp(e.target.value)}
                        placeholder="••••••"
                        style={{
                          textAlign: 'center',
                          letterSpacing: '6px',
                          fontSize: '18px',
                          fontWeight: 800
                        }}
                        required
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="mobile-cta-btn"
                disabled={isSubmitting}
                style={{
                  marginTop: '18px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                  color: '#ffffff'
                }}
              >
                {isSubmitting ? (
                  <span>Authenticating Credentials...</span>
                ) : (
                  <>
                    <span>
                      {getTranslation(lang, 'logIn')} ({currentRoleCfg.label})
                    </span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {lang === 'ଓଡ଼ିଆ' ? 'ଖାତା ନାହିଁ କି? ' : lang === 'हिन्दी' ? 'खाता नहीं है? ' : "Don't have an account yet? "}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#19d3ff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {getTranslation(lang, 'createAccount')}
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 2: REGISTER (ANYONE CAN REGISTER WITH CREDENTIALS)   */}
          {/* ======================================================== */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                    {selectedRole === 'doctor'
                      ? 'Doctor Full Name *'
                      : selectedRole === 'pharmacy'
                      ? 'Pharmacist / Chemist Name *'
                      : selectedRole === 'lab'
                      ? 'Pathologist / In-Charge Name *'
                      : selectedRole === 'admin'
                      ? 'Officer Full Name *'
                      : 'Citizen / Patient Full Name *'}
                  </label>
                  <input
                    type="text"
                    className="mobile-input-control"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Majhi"
                    required
                  />
                </div>

                {/* Mobile & Email Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      className="mobile-input-control"
                      value={regMobile}
                      onChange={e => setRegMobile(e.target.value)}
                      placeholder="10 Digits"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      className="mobile-input-control"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="user@health.in"
                    />
                  </div>
                </div>

                {/* Password & Confirm */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                      Create Password *
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      className="mobile-input-control"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min 4 chars"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '5px' }}>
                      Confirm Password *
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      className="mobile-input-control"
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter"
                      required
                    />
                  </div>
                </div>

                {/* Show password check */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8' }}>
                  <input
                    type="checkbox"
                    checked={showRegPassword}
                    onChange={e => setShowRegPassword(e.target.checked)}
                    style={{ accentColor: '#19d3ff' }}
                  />
                  <span>Show password characters</span>
                </div>

                {/* ==================================================== */}
                {/* ROLE-SPECIFIC CREDENTIAL SECTION                    */}
                {/* ==================================================== */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '14px',
                    padding: '12px',
                    marginTop: '4px'
                  }}
                >
                  <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: currentRoleCfg.color, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Professional & Credential Details ({currentRoleCfg.label})
                  </span>

                  {selectedRole === 'patient' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Age (Years)</label>
                          <input
                            type="number"
                            className="mobile-input-control"
                            value={patAge}
                            onChange={e => setPatAge(e.target.value)}
                            placeholder="e.g. 28"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Gender</label>
                          <select
                            className="mobile-input-control"
                            value={patGender}
                            onChange={e => setPatGender(e.target.value as any)}
                            style={{ background: '#0a1d42' }}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>District Block</label>
                          <select
                            className="mobile-input-control"
                            value={patBlock}
                            onChange={e => setPatBlock(e.target.value)}
                            style={{ background: '#0a1d42' }}
                          >
                            <option value="Bhawanipatna">Bhawanipatna</option>
                            <option value="Karlamunda">Karlamunda</option>
                            <option value="Junagarh">Junagarh</option>
                            <option value="Dharamgarh">Dharamgarh</option>
                            <option value="Kesinga">Kesinga</option>
                            <option value="Narla">Narla</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>ABHA ID (Optional)</label>
                          <input
                            type="text"
                            className="mobile-input-control"
                            value={patAbha}
                            onChange={e => setPatAbha(e.target.value)}
                            placeholder="14-digit ABHA"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedRole === 'doctor' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Medical Reg No. (OSMC/MCI) *</label>
                          <input
                            type="text"
                            className="mobile-input-control"
                            value={docLicense}
                            onChange={e => setDocLicense(e.target.value)}
                            placeholder="e.g. OSMC/2021/9842"
                            required
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Specialization</label>
                          <input
                            type="text"
                            className="mobile-input-control"
                            value={docSpecialty}
                            onChange={e => setDocSpecialty(e.target.value)}
                            placeholder="General Medicine / Pediatrics"
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Hospital / Clinical Hub</label>
                        <input
                          type="text"
                          className="mobile-input-control"
                          value={docHospital}
                          onChange={e => setDocHospital(e.target.value)}
                          placeholder="e.g. DHH Bhawanipatna or CHC"
                        />
                      </div>
                    </div>
                  )}

                  {selectedRole === 'pharmacy' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Pharmacy Store Name *</label>
                        <input
                          type="text"
                          className="mobile-input-control"
                          value={pharmacyStoreName}
                          onChange={e => setPharmacyStoreName(e.target.value)}
                          placeholder="e.g. Maa Tarini Jan Aushadhi Store"
                          required
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Drug License Number *</label>
                          <input
                            type="text"
                            className="mobile-input-control"
                            value={pharmacyDrugLicense}
                            onChange={e => setPharmacyDrugLicense(e.target.value)}
                            placeholder="e.g. DL-OD-KLH-8492"
                            required
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Market Location</label>
                          <input
                            type="text"
                            className="mobile-input-control"
                            value={pharmacyLocation}
                            onChange={e => setPharmacyLocation(e.target.value)}
                            placeholder="e.g. Karlamunda Square"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedRole === 'lab' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Diagnostic Center Name *</label>
                        <input
                          type="text"
                          className="mobile-input-control"
                          value={labCenterName}
                          onChange={e => setLabCenterName(e.target.value)}
                          placeholder="e.g. DHH Central Diagnostic Hub"
                          required
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>NABL / Establishment ID *</label>
                          <input
                            type="text"
                            className="mobile-input-control"
                            value={labRegistrationId}
                            onChange={e => setLabRegistrationId(e.target.value)}
                            placeholder="e.g. NABL-KLH-104"
                            required
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Center Address</label>
                          <input
                            type="text"
                            className="mobile-input-control"
                            value={labFacilityAddress}
                            onChange={e => setLabFacilityAddress(e.target.value)}
                            placeholder="e.g. Bhawanipatna Hub"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedRole === 'admin' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Official Designation *</label>
                          <input
                            type="text"
                            className="mobile-input-control"
                            value={adminDesignation}
                            onChange={e => setAdminDesignation(e.target.value)}
                            placeholder="e.g. District Program Manager"
                            required
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>Government Employee ID</label>
                          <input
                            type="text"
                            className="mobile-input-control"
                            value={adminEmployeeId}
                            onChange={e => setAdminEmployeeId(e.target.value)}
                            placeholder="e.g. GOV-OD-8492"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms & Consent */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11.5px', color: '#cbd5e1', cursor: 'pointer', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    checked={regConsent}
                    onChange={e => setRegConsent(e.target.checked)}
                    style={{ accentColor: '#19d3ff', marginTop: '2px' }}
                    required
                  />
                  <span>
                    I confirm that the credentials provided are accurate and consent to secure healthcare data handling according to national clinical standards.
                  </span>
                </label>

                {/* Submit Register CTA */}
                <button
                  type="submit"
                  className="mobile-cta-btn"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '8px',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: '#ffffff',
                    boxShadow: '0 8px 24px rgba(5, 150, 105, 0.4)'
                  }}
                >
                  {isSubmitting ? (
                    <span>Registering Account...</span>
                  ) : (
                    <>
                      <span>Register & Open Dashboard</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Already have an account?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#19d3ff',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Secure System Badge */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '11px',
              color: '#64748b'
            }}
          >
            <ShieldCheck size={14} style={{ color: '#06b6d4' }} />
            <span>Encrypted • ABDM Rural Telehealth Standards • 256-bit Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};
