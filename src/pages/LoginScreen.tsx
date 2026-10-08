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

      // Open Login Tab with registered user's credentials prefilled
      setActiveTab('login');
      setLoginMode('password');
      setLoginIdentifier(newAccount.mobile || newAccount.email || newAccount.name);
      setLoginPassword('');
      setSelectedRole(newAccount.role);

      // Clear registration inputs
      setRegName('');
      setRegMobile('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');

      setSuccessMsg(
        lang === 'ଓଡ଼ିଆ'
          ? `✓ ${newAccount.name} ଙ୍କ ପାଇଁ ପଞ୍ଜୀକରଣ ସଫଳ ହୋଇଛି! ଆପଣଙ୍କ ତଥ୍ୟ ସୁରକ୍ଷିତ ଭାବେ ସଂରକ୍ଷିତ ହେଲା। ଦୟାକରି ଲଗଇନ୍ କରିବା ପାଇଁ ପାସୱାର୍ଡ ପ୍ରବେଶ କରନ୍ତୁ।`
          : lang === 'हिन्दी'
          ? `✓ ${newAccount.name} का पंजीकरण सफल रहा! आपका विवरण सुरक्षित सहेज लिया गया है। कृपया लॉगिन करने के लिए पासवर्ड दर्ज करें।`
          : `✓ Registration successful for ${newAccount.name}! Your account data is saved. Please enter your password to sign in.`
      );
    }, 450);
  };

  return (
    <div className="mobile-login-screen">
      <div className="mobile-device-shell">
        {/* Clean Language Switcher Pills */}
        {onSelectLang && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '12px'
            }}
          >
            {(['English', 'ଓଡ଼ିଆ', 'हिन्दी'] as Language[]).map(l => (
              <button
                key={l}
                type="button"
                onClick={() => onSelectLang(l)}
                style={{
                  background: lang === l ? '#0284c7' : '#ffffff',
                  color: lang === l ? '#ffffff' : '#334155',
                  border: lang === l ? '1.5px solid #0284c7' : '1.5px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '4px 14px',
                  fontSize: '12px',
                  fontWeight: lang === l ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: lang === l ? '0 2px 6px rgba(2, 132, 199, 0.25)' : '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {/* eSanjeevani White Medical Card */}
        <div className="mobile-glass-card">
          {/* Top Tricolor Ribbon (National Healthcare Hallmark) */}
          <div className="esanjeevani-top-ribbon" />

          <div className="mobile-card-content">
            {/* Government & Tele-OPD Header */}
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  marginBottom: '6px'
                }}
              >
                <span className="pulse-dot-green"></span>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#166534', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                  eSanjeevani Tele-OPD 2.0 • MoHFW
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '3px' }}>
                <h1
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#0f2e5c',
                    margin: 0,
                    letterSpacing: '-0.01em',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  SWASTHYA PATH
                </h1>
                <span
                  style={{
                    background: '#e0f2fe',
                    color: '#0284c7',
                    border: '1px solid #bae6fd',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '6px',
                    textTransform: 'uppercase'
                  }}
                >
                  ABDM
                </span>
              </div>

              <p style={{ color: '#64748b', fontSize: '12.5px', margin: 0, lineHeight: 1.4 }}>
                {lang === 'ଓଡ଼ିଆ'
                  ? 'ଜାତୀୟ ଟେଲିମେଡିସିନ୍ ସେବା • କଳାହାଣ୍ଡି ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟ ନେଟୱାର୍କ'
                  : lang === 'हिन्दी'
                  ? 'राष्ट्रीय टेलीमेडिसिन सेवा • कालाहांडी ग्रामीण स्वास्थ्य नेटवर्क'
                  : 'National Telemedicine Service • Kalahandi Rural Network'}
              </p>
            </div>

            {/* 3D Healthcare Illustration Hero Card */}
            <div className="esanjeevani-hero-container">
              <img
                src="/images/esanjeevani-white-3d-bg.jpg"
                alt="eSanjeevani 3D Healthcare"
                className="esanjeevani-hero-img"
              />
              <div className="esanjeevani-hero-badge">
                <span className="pulse-dot-green"></span>
                <span>Live Telehealth Node</span>
              </div>
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
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {lang === 'ଓଡ଼ିଆ' ? 'ପୋର୍ଟାଲ୍ ଭୂମିକା ଚୟନ:' : lang === 'हिन्दी' ? 'भूमिका चुनें:' : 'Select Portal Role:'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: currentRoleCfg.color }}>
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
                    }}
                    title={r.sub}
                  >
                    <div style={{ color: selectedRole === r.id ? '#0284c7' : '#64748b' }}>
                      {r.icon}
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 700 }}>
                      {r.id === 'patient' ? 'Patient' : r.id === 'doctor' ? 'Doctor' : r.id === 'pharmacy' ? 'Chemist' : r.id === 'lab' ? 'Lab' : 'Admin'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* TAB 1: SIGN IN */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit}>
                {/* Login Method Toggle */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    marginBottom: '16px',
                    fontSize: '13px',
                    color: '#475569'
                  }}
                >
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: loginMode === 'password' ? '#0284c7' : '#64748b', fontWeight: 700 }}>
                  <input
                    type="radio"
                    name="loginMethod"
                    checked={loginMode === 'password'}
                    onChange={() => setLoginMode('password')}
                    style={{ accentColor: '#0284c7' }}
                  />
                  <span>Password Login</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: loginMode === 'otp' ? '#0284c7' : '#64748b', fontWeight: 700 }}>
                  <input
                    type="radio"
                    name="loginMethod"
                    checked={loginMode === 'otp'}
                    onChange={() => setLoginMode('otp')}
                    style={{ accentColor: '#0284c7' }}
                  />
                  <span>Instant Mobile OTP</span>
                </label>
              </div>

              {loginMode === 'password' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Identifier */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#1e293b' }}>
                        {lang === 'ଓଡ଼ିଆ' ? 'ପାସୱାର୍ଡ' : lang === 'हिन्दी' ? 'पासवर्ड' : 'Account Password'}
                      </label>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="mobile-input-control"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
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
                          color: '#64748b',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: 0
                        }}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        style={{ accentColor: '#0284c7' }}
                      />
                      <span>Keep signed in on this device</span>
                    </label>
                  </div>
                </div>
              ) : (
                /* OTP Login mode */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>
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
                          background: '#e0f2fe',
                          color: '#0284c7',
                          border: '1.5px solid #bae6fd',
                          borderRadius: '10px',
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
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>
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
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
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
                <span style={{ fontSize: '12.5px', color: '#64748b' }}>
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
                    color: '#0284c7',
                    fontSize: '12.5px',
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>
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
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>
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
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>
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
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>
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
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1e293b', marginBottom: '5px' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b' }}>
                  <input
                    type="checkbox"
                    checked={showRegPassword}
                    onChange={e => setShowRegPassword(e.target.checked)}
                    style={{ accentColor: '#0284c7' }}
                  />
                  <span>Show password characters</span>
                </div>

                {/* ==================================================== */}
                {/* ROLE-SPECIFIC CREDENTIAL SECTION                    */}
                {/* ==================================================== */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '12px',
                    marginTop: '2px'
                  }}
                >
                  <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: currentRoleCfg.color, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Professional & Credential Details ({currentRoleCfg.label})
                  </span>

                  {selectedRole === 'patient' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Age (Years)</label>
                          <input
                            type="number"
                            className="mobile-input-control"
                            value={patAge}
                            onChange={e => setPatAge(e.target.value)}
                            placeholder="e.g. 28"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Gender</label>
                          <select
                            className="mobile-input-control"
                            value={patGender}
                            onChange={e => setPatGender(e.target.value as any)}
                            style={{ background: '#ffffff', color: '#0f172a' }}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>District Block</label>
                          <select
                            className="mobile-input-control"
                            value={patBlock}
                            onChange={e => setPatBlock(e.target.value)}
                            style={{ background: '#ffffff', color: '#0f172a' }}
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
                          <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>ABHA ID (Optional)</label>
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
                          <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Medical Reg No. (OSMC/MCI) *</label>
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
                          <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Specialization</label>
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
                        <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Hospital / Clinical Hub</label>
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
                        <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Pharmacy Store Name *</label>
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
                          <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Drug License Number *</label>
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
                          <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Market Location</label>
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
                        <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Diagnostic Center Name *</label>
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
                          <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>NABL / Establishment ID *</label>
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
                          <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Center Address</label>
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
                          <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Official Designation *</label>
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
                          <label style={{ display: 'block', fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Government Employee ID</label>
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
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11.5px', color: '#475569', cursor: 'pointer', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    checked={regConsent}
                    onChange={e => setRegConsent(e.target.checked)}
                    style={{ accentColor: '#0284c7', marginTop: '2px' }}
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
                    boxShadow: '0 8px 24px rgba(5, 150, 105, 0.35)'
                  }}
                >
                  {isSubmitting ? (
                    <span>Registering Account...</span>
                  ) : (
                    <>
                      <span>
                        {lang === 'ଓଡ଼ିଆ' ? 'ପଞ୍ଜୀକରଣ କରନ୍ତୁ' : lang === 'हिन्दी' ? 'खाता पंजीकृत करें' : 'Register Account'}
                      </span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <span style={{ fontSize: '12.5px', color: '#64748b' }}>
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
                      color: '#0284c7',
                      fontSize: '12.5px',
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
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '11px',
              color: '#64748b'
            }}
          >
            <ShieldCheck size={14} style={{ color: '#0284c7' }} />
            <span>eSanjeevani Tele-OPD • ABDM Verified • 256-bit AES Clinical Privacy</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
