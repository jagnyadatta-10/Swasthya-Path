import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Stethoscope,
  Calendar,
  Pill,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Mic,
  Phone,
  PhoneCall,
  Search,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Video,
  MapPin,
  User,
  CreditCard,
  Eye,
  Activity,
  Check,
  HelpCircle,
  Volume2,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Home,
  Compass,
  Bot,
  Store,
  WifiOff
} from 'lucide-react';
import {
  DemoUser,
  Language,
  HealthRecord,
  DoctorItem,
  DoctorLeave,
  MedicineItem,
  WarningSignId,
  NetworkQuality,
  KalahandiBlock,
  ConsultationToken,
  PhysiologicalVitals,
  DiagnosticDocument,
  FullPrescription
} from '../types';
import { storage } from '../utils/storage';
import { getTranslation } from '../utils/translations';
import { VoiceModal } from '../components/VoiceModal';
import { VideoConsultationRoom } from '../components/VideoConsultationRoom';
import { DigitalHealthCardModal } from '../components/DigitalHealthCardModal';
import { DocumentViewerModal } from '../components/DocumentViewerModal';
import { EPrescriptionModal } from '../components/EPrescriptionModal';
import { EmergencyHelpModal } from '../components/EmergencyHelpModal';
import { FacilityDirectoryModal } from '../components/FacilityDirectoryModal';
import { ConsentManagementModal } from '../components/ConsentManagementModal';
import { PrimaryCareServicesModal } from '../components/PrimaryCareServicesModal';
import { CareNavigationFlowModal } from '../components/CareNavigationFlowModal';

interface PatientPortalProps {
  user: DemoUser;
  networkQuality: NetworkQuality;
  onNetworkChange?: (quality: NetworkQuality) => void;
  lowBandwidthMode: boolean;
  onToggleLowBandwidth: () => void;
  lang: Language;
  onSelectLang?: (lang: Language) => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  user,
  networkQuality,
  onNetworkChange,
  lowBandwidthMode,
  onToggleLowBandwidth,
  lang,
  onSelectLang
}) => {
  // Navigation Tabs: Home, Doctor, Records, Medicines, Profile (Prompt Section 8)
  const [activeTab, setActiveTab] = useState<'home' | 'symptom' | 'doctor' | 'records' | 'medicines' | 'profile'>('home');
  const [tabHistory, setTabHistory] = useState<('home' | 'symptom' | 'doctor' | 'records' | 'medicines' | 'profile')[]>(['home']);

  const navigateToTab = (newTab: 'home' | 'symptom' | 'doctor' | 'records' | 'medicines' | 'profile') => {
    setTabHistory(prev => (prev[prev.length - 1] === newTab ? prev : [...prev, newTab]));
    setActiveTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (activeTab === 'symptom' && symptomStep > 1) {
      setSymptomStep(symptomStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (tabHistory.length > 1) {
      const updated = [...tabHistory];
      updated.pop();
      const prev = updated[updated.length - 1];
      setTabHistory(updated);
      setActiveTab(prev);
    } else {
      setActiveTab('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderBackButton = (customLabel?: string) => (
    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
      <button
        type="button"
        onClick={handleGoBack}
        className="btn btn-secondary"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '10px',
          background: '#ffffff',
          border: '1.5px solid #cbd5e1',
          color: '#0f172a',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}
        title="Go back to previous page"
      >
        <ArrowLeft size={16} />
        <span>
          {customLabel || (
            lang === 'ଓଡ଼ିଆ'
              ? '← ପଛକୁ ଫେରନ୍ତୁ (ପୂର୍ବ ପୃଷ୍ଠା)'
              : lang === 'हिन्दी'
              ? '← वापस जाएं (पिछला पृष्ठ)'
              : '← Back to Previous Page'
          )}
        </span>
      </button>

      {activeTab !== 'home' && (
        <button
          type="button"
          onClick={() => navigateToTab('home')}
          className="btn btn-ghost-light"
          style={{
            fontSize: '12px',
            color: '#0284c7',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Home size={14} />
          <span>{lang === 'ଓଡ଼ିଆ' ? 'ମୁଖ୍ୟ ପୃଷ୍ଠାକୁ ଫେରନ୍ତୁ' : lang === 'हिन्दी' ? 'मुख्य पृष्ठ पर जाएं' : 'Back to Home'}</span>
        </button>
      )}
    </div>
  );

  // Elderly-Friendly "Simple Mode" Toggle (Prompt Section 23)
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(false);

  // Accessibility Controls (Prompt Section 22): Text Size & High Contrast
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Conversational Symptom Intake Flow State (Prompt Section 4, 5, 27)
  const [symptomStep, setSymptomStep] = useState<number>(1);
  const [selectedSymptom, setSelectedSymptom] = useState<string>('Fever');
  const [selectedSymptomIcon, setSelectedSymptomIcon] = useState<string>('🤒');
  const [symptomDuration, setSymptomDuration] = useState<string>('2–3 days');
  const [symptomSeverity, setSymptomSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [symptomWorsening, setSymptomWorsening] = useState<'Yes' | 'No' | "I'm not sure">('Yes');
  const [symptomWarningSign, setSymptomWarningSign] = useState<WarningSignId>('no');
  const [voiceConfirmedMsg, setVoiceConfirmedMsg] = useState<string>('');

  // Doctor Specialty Filter (Prompt Section 12)
  const [doctorCategory, setDoctorCategory] = useState<string>('All');

  // 3-Step Appointment Booking State (Prompt Section 13 & 24)
  const [bookingDoctor, setBookingDoctor] = useState<DoctorItem | null>(null);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [bookingSlot, setBookingSlot] = useState<string>('Today • 10:30 AM');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingSuccessNotice, setBookingSuccessNotice] = useState<string>('');

  // Voice narration helper for accessibility (Section 18 & 22)
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'हिन्दी') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  // Modals & Viewers
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  // Track the doctor selected for the current video consultation
  const [selectedConsultDoctor, setSelectedConsultDoctor] = useState<DoctorItem | null>(null);
  const [viewingDoctorProfile, setViewingDoctorProfile] = useState<DoctorItem | null>(null);
  const [isHealthCardOpen, setIsHealthCardOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<DiagnosticDocument | null>(null);
  const [viewingPrescription, setViewingPrescription] = useState<FullPrescription | null>(null);
  const [isEmergencyHelpOpen, setIsEmergencyHelpOpen] = useState(false);
  const [isFacilityDirectoryOpen, setIsFacilityDirectoryOpen] = useState(false);
  const [isConsentManagerOpen, setIsConsentManagerOpen] = useState(false);
  const [isPrimaryCareOpen, setIsPrimaryCareOpen] = useState(false);
  const [activeHelpTopic, setActiveHelpTopic] = useState<{ title: string; desc: string; icon: string; steps: string[] } | null>(null);
  const [isCareFlowOpen, setIsCareFlowOpen] = useState(false);

  // Direct branch selector from Care Navigation Flow diagram
  const handleFlowSelectPath = (pathway: 'low' | 'moderate' | 'emergency' | 'doctor' | 'pharmacy') => {
    if (pathway === 'low') {
      setActiveTab('symptom');
      setSelectedSymptom('Fever');
      setSelectedSymptomIcon('🤒');
      setSymptomDuration('Today');
      setSymptomSeverity('Mild');
      setSymptomWorsening('No');
      setSymptomWarningSign('no');
      setSymptomStep(5);
    } else if (pathway === 'moderate') {
      setActiveTab('symptom');
      setSelectedSymptom('Fever');
      setSelectedSymptomIcon('🤒');
      setSymptomDuration('2–3 days');
      setSymptomSeverity('Moderate');
      setSymptomWorsening('Yes');
      setSymptomWarningSign('no');
      setSymptomStep(5);
    } else if (pathway === 'emergency') {
      setActiveTab('symptom');
      setSelectedSymptom('Severe Breathing Difficulty');
      setSelectedSymptomIcon('😮‍💨');
      setSymptomStep(5);
      setSymptomWarningSign('breathing');
      setIsEmergencyHelpOpen(true);
    } else if (pathway === 'doctor') {
      setActiveTab('doctor');
    } else if (pathway === 'pharmacy') {
      setActiveTab('medicines');
      setMedicineSearch('Paracetamol');
    }
  };

  // Storage Data
  const [token, setToken] = useState<ConsultationToken | null>(storage.getActiveToken());
  const [records, setRecords] = useState<HealthRecord[]>(storage.getRecords());
  const [prescriptions, setPrescriptions] = useState<FullPrescription[]>(storage.getPrescriptions());
  const [documents, setDocuments] = useState<DiagnosticDocument[]>(storage.getDocuments());
  const [medicines, setMedicines] = useState<MedicineItem[]>(storage.getMedicines());
  const [allDoctors, setAllDoctors] = useState<DoctorItem[]>(storage.getDoctors());
  const [doctorLeaves, setDoctorLeaves] = useState<DoctorLeave[]>(storage.getDoctorLeaves());

  // Search & Filter for medicines
  const [medicineSearch, setMedicineSearch] = useState<string>('');
  const [selectedBlock, setSelectedBlock] = useState<KalahandiBlock>('All Blocks');
  const [medicineHoldNotice, setMedicineHoldNotice] = useState<string>('');

  // Search & Filter for doctors (Prompt Section 7)
  const [doctorSearch, setDoctorSearch] = useState<string>('');
  const [doctorLocation, setDoctorLocation] = useState<string>('All');

  const isConnected = networkQuality !== 'offline';
  const patientId = user.patientId || 'RHB-OD-KLH-0941';

  // Primary Doctor reference for direct video calls
  const primaryDoctor: DoctorItem = allDoctors.find(d => d.id === 'doc-01') || {
    id: 'doc-01',
    name: 'Dr. Ananya Mishra',
    specialty: 'General Medicine',
    hospital: 'District Headquarters Hospital (DHH) Bhawanipatna',
    facility: 'District Headquarters Hospital (DHH) Bhawanipatna',
    nextSlot: 'Today • Available Now',
    languages: ['English', 'ଓଡ଼ିଆ (Odia)', 'हिन्दी (Hindi)'],
    rating: 4.9,
    available: true,
    experience: '9 yrs exp • MBBS, MD',
    fees: 'Free (Govt Telehealth Initiative)',
    estimatedWaitMin: 10,
    gender: 'female',
    feedUrl: '/images/doctor-feed.jpg',
    avatarUrl: '/images/female-doctor-avatar.jpg'
  };

  // Refresh records and tokens when switching tabs
  useEffect(() => {
    setRecords(storage.getRecords());
    setPrescriptions(storage.getPrescriptions());
    setDocuments(storage.getDocuments());
    setMedicines(storage.getMedicines());
    setAllDoctors(storage.getDoctors());
    setDoctorLeaves(storage.getDoctorLeaves());
    setToken(storage.getActiveToken());
  }, [activeTab]);

  // Dynamic Patient Greeting (Custom name for new users, Keshab only for demo Keshab)
  const getPatientGreeting = () => {
    const isKeshab = (user?.name || '').toLowerCase().includes('keshab');
    if (isKeshab) {
      return getTranslation(lang, 'greetingPatient'); // 'Good morning, Keshab 👋' / 'ଶୁଭ ସକାଳ, କେଶବ 👋' / 'नमस्ते, केशव 👋'
    }
    const cleanName = user?.name?.trim();
    if (cleanName) {
      if (lang === 'ଓଡ଼ିଆ') return `ଶୁଭ ସକାଳ, ${cleanName} 👋`;
      if (lang === 'हिन्दी') return `नमस्ते, ${cleanName} 👋`;
      return `Good morning, ${cleanName} 👋`;
    }
    if (lang === 'ଓଡ଼ିଆ') return 'ଶୁଭ ସକାଳ 👋';
    if (lang === 'हिन्दी') return 'नमस्ते 👋';
    return 'Good morning 👋';
  };

  // Common Symptoms list (Section 4)
  const SYMPTOM_OPTIONS = [
    { name: 'Fever', icon: '🤒', odia: 'ଜ୍ୱର', hindi: 'बुखार' },
    { name: 'Cold / Cough', icon: '🤧', odia: 'ଥଣ୍ଡା / କାଶ', hindi: 'सर्दी / खांसी' },
    { name: 'Pain', icon: '🤕', odia: 'ଦେହ ବିନ୍ଧା / ଯନ୍ତ୍ରଣା', hindi: 'दर्द / बदन दर्द' },
    { name: 'Breathing problem', icon: '😮‍💨', odia: 'ଶ୍ୱାସକ୍ରିୟା କଷ୍ଟ', hindi: 'सांस लेने में दिक्कत' },
    { name: 'Vomiting', icon: '🤢', odia: 'ବାନ୍ତି', hindi: 'उल्टी' },
    { name: 'Loose motion', icon: '💧', odia: 'ଝାଡ଼ା (ତରଳ ଝାଡ଼ା)', hindi: 'दस्त / पतले दस्त' },
    { name: 'Headache', icon: '🤕', odia: 'ମୁଣ୍ଡ ବିନ୍ଧା', hindi: 'सिरदर्द' },
    { name: 'Weakness', icon: '💪', odia: 'ଦୁର୍ବଳତା', hindi: 'कमजोरी' },
    { name: 'Injury', icon: '🩹', odia: 'କ୍ଷତ / ଆଘାତ', hindi: 'चोट / घाव' },
    { name: 'Mental well-being', icon: '🧠', odia: 'ମାନସିକ ଚିନ୍ତା / ଅଶାନ୍ତି', hindi: 'मानसिक तनाव / घबराहट' },
    { name: 'Something else', icon: '➕', odia: 'ଅନ୍ୟାନ୍ୟ ଅସୁବିଧା', hindi: 'कुछ और' }
  ];

  // Step-by-step Symptom Selection
  const handleSelectSymptom = (sym: { name: string; icon: string }) => {
    setSelectedSymptom(sym.name);
    setSelectedSymptomIcon(sym.icon);
    setSymptomStep(2); // Move to duration
  };

  // Launch Video Consultation with a specific doctor
  const handleStartConsultation = (doctor?: DoctorItem) => {
    if (!isConnected) {
      alert("You're offline. Live teleconsultation requires an internet connection.");
      return;
    }
    if (doctor) {
      setSelectedConsultDoctor(doctor);
    }
    setIsVideoCallOpen(true);
  };

  // Initiate 3-Step Appointment Booking Flow (Section 13)
  const handleInitiateBooking = (doctor: DoctorItem) => {
    setBookingDoctor(doctor);
    setBookingStep(2); // Doctor selected, proceed to Choose Time
    setIsBookingModalOpen(true);
  };

  // Generate Consultation Token on Step 3 Confirmation (Section 13 & 26)
  const handleConfirmBooking = () => {
    if (!bookingDoctor) return;
    const newToken = storage.generateToken(bookingDoctor.name, bookingDoctor.specialty);
    setToken(newToken);
    // Remember which doctor was booked so video call shows the right doctor
    setSelectedConsultDoctor(bookingDoctor);
    setBookingSuccessNotice(getTranslation(lang, 'appointmentBookedSuccess'));
    setIsBookingModalOpen(false);
    setBookingStep(1);
    setTimeout(() => setBookingSuccessNotice(''), 4500);
    setActiveTab('doctor');
  };

  // Quick Book helper
  const handleBookAppointment = (doctor: DoctorItem) => {
    handleInitiateBooking(doctor);
  };

  // Save Care Result to Health Records
  const handleSaveSymptomResult = () => {
    const urgency = symptomWarningSign !== 'no' ? 'urgent' : 'routine';
    const pathway = symptomWarningSign !== 'no' ? 'urgent physical care' : 'clinician consultation';

    storage.saveRecord({
      patientId,
      type: 'symptom',
      symptoms: `${selectedSymptomIcon} ${selectedSymptom}`,
      duration: symptomDuration,
      warningSign: symptomWarningSign !== 'no' ? symptomWarningSign : 'None',
      pathway,
      urgency,
      notes: `Reported ${selectedSymptom} for ${symptomDuration}. Severity: ${symptomSeverity}. Worsening: ${symptomWorsening}.`,
      synced: isConnected
    });

    storage.addAuditLog(`Patient saved symptom result (${selectedSymptom})`, user.name);
    alert('✓ Symptom note saved to your health records!');
    setActiveTab('records');
  };

  // Filtered medicines (matching name, generic, pharmacy, block)
  const filteredMedicines = medicines.filter((m) => {
    const q = medicineSearch.trim().toLowerCase();
    const matchesBlock = selectedBlock === 'All Blocks' || m.block === selectedBlock;
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      (m.genericName && m.genericName.toLowerCase().includes(q)) ||
      (m.pharmacyName && m.pharmacyName.toLowerCase().includes(q)) ||
      m.category.toLowerCase().includes(q);
    return matchesBlock && matchesSearch;
  });

  // Doctor filtering with search, specialty, and facility location (Prompt Section 7)
  const filteredDoctors = allDoctors.filter((doc) => {
    const q = doctorSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      doc.name.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      (doc.facility && doc.facility.toLowerCase().includes(q)) ||
      (doc.hospital && doc.hospital.toLowerCase().includes(q));

    const s = doc.specialty.toLowerCase();
    const matchesCategory =
      doctorCategory === 'All' ||
      (doctorCategory === 'General' && s.includes('general')) ||
      (doctorCategory === 'Child' && (s.includes('paediatric') || s.includes('child'))) ||
      (doctorCategory === 'Internal' && (s.includes('obstetric') || s.includes('gynaec') || s.includes('women') || s.includes('internal'))) ||
      (doctorCategory === 'Skin' && s.includes('derma')) ||
      (doctorCategory === 'Mental' && (s.includes('psych') || s.includes('mental'))) ||
      (doctorCategory === 'Other' && !s.includes('general') && !s.includes('paediatric') && !s.includes('obstetric') && !s.includes('derma') && !s.includes('psych'));

    const matchesLocation =
      doctorLocation === 'All' ||
      (doc.facility && doc.facility.toLowerCase().includes(doctorLocation.toLowerCase())) ||
      (doc.hospital && doc.hospital.toLowerCase().includes(doctorLocation.toLowerCase())) ||
      ((doctorLocation.toLowerCase().includes('dharm') || doctorLocation.toLowerCase().includes('dharam')) &&
        ((doc.facility && (doc.facility.toLowerCase().includes('dharam') || doc.facility.toLowerCase().includes('dharm'))) ||
         (doc.hospital && (doc.hospital.toLowerCase().includes('dharam') || doc.hospital.toLowerCase().includes('dharm')))));

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div
      style={{
        maxWidth: '980px',
        margin: '0 auto',
        paddingBottom: '90px',
        fontSize: textSize === 'extra-large' ? '18px' : textSize === 'large' ? '16px' : '14px',
        filter: highContrast ? 'contrast(125%)' : 'none'
      }}
    >
      {/* ======================================================== */}
      {/* 1. TOP HEADER & CONNECTION STATUS (Prompt Section 2, 7, 21, 22) */}
      {/* ======================================================== */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '16px',
          background: highContrast ? '#ffffff' : '#ffffff',
          borderRadius: '16px',
          border: highContrast ? '2.5px solid #000000' : '1.5px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', color: '#0f172a' }}>
                {lang === 'ଓଡ଼ିଆ' 
                  ? `ନମସ୍କାର, ${user.name} 👋` 
                  : lang === 'हिन्दी' 
                  ? `नमस्ते, ${user.name} 👋` 
                  : `Hello, ${user.name} 👋`}
              </h2>
              <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, fontFamily: 'monospace' }}>
                ID: {user.patientId || patientId}
              </span>
            </div>
            <div style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>
              {user.location || (lang === 'ଓଡ଼ିଆ' ? 'ଗ୍ରାମ: ଛୋରିଆଗଡ଼ • ଭବାନୀପାଟଣା, କଳାହାଣ୍ଡି' : lang === 'हिन्दी' ? 'ग्राम: छोरियागढ़ • भवानीपटना, कालाहांडी' : 'Village Chhoriagarh • Bhawanipatna, Kalahandi')}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Prominent Language Switcher (Prompt Section 7) */}
            {onSelectLang && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '3px 6px', borderRadius: '999px', border: '1px solid #cbd5e1' }}>
                {(['English', 'ଓଡ଼ିଆ', 'हिन्दी'] as Language[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => onSelectLang(l)}
                    style={{
                      background: lang === l ? '#0284c7' : 'transparent',
                      color: lang === l ? '#ffffff' : '#334155',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: lang === l ? 800 : 600,
                      cursor: 'pointer'
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}

            {/* Accessibility Controls: Text Size & High Contrast (Prompt Section 22) */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', background: '#f1f5f9', padding: '2px 4px', borderRadius: '8px', border: '1px solid #cbd5e1' }} title="Text Size: A- A A+">
              <button
                type="button"
                onClick={() => setTextSize('normal')}
                style={{
                  background: textSize === 'normal' ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 7px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: textSize === 'normal' ? '#0284c7' : '#475569'
                }}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setTextSize('large')}
                style={{
                  background: textSize === 'large' ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 7px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: textSize === 'large' ? '#0284c7' : '#475569'
                }}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setTextSize('extra-large')}
                style={{
                  background: textSize === 'extra-large' ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 7px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  color: textSize === 'extra-large' ? '#0284c7' : '#475569'
                }}
              >
                A+
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              style={{
                background: highContrast ? '#0f172a' : '#f8fafc',
                color: highContrast ? '#ffffff' : '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Toggle High Contrast"
            >
              {highContrast ? '🌓 Contrast ON' : '🌓 Contrast'}
            </button>

            {/* Simple Mode Toggle (Prompt Section 23) */}
            <button
              type="button"
              onClick={() => setIsSimpleMode(!isSimpleMode)}
              style={{
                background: isSimpleMode ? '#0284c7' : '#f8fafc',
                color: isSimpleMode ? '#ffffff' : '#0369a1',
                border: isSimpleMode ? '1.5px solid #0284c7' : '1.5px solid #cbd5e1',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Switch to Large-Button Simple Mode"
            >
              <span>👵</span>
              <span>{isSimpleMode ? 'Simple Mode: ON' : 'Simple Mode'}</span>
            </button>

            {/* Always Visible Emergency Help Button (Prompt Section 8 & 9) */}
            <button
              type="button"
              onClick={() => setIsEmergencyHelpOpen(true)}
              style={{
                background: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '999px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(220, 38, 38, 0.3)'
              }}
            >
              <PhoneCall size={16} />
              <span>🆘 {getTranslation(lang, 'emergencyHelp')}</span>
            </button>
          </div>
        </div>

        {/* Human Connection Status (Prompt Section 21) */}
        <div style={{
          marginTop: '12px',
          padding: '8px 14px',
          borderRadius: '10px',
          fontSize: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          background:
            networkQuality === 'good' ? '#f0fdf4' : networkQuality === 'limited' ? '#fffbeb' : '#fef2f2',
          border:
            networkQuality === 'good' ? '1px solid #bbf7d0' : networkQuality === 'limited' ? '1px solid #fef08a' : '1px solid #fecaca',
          color:
            networkQuality === 'good' ? '#166534' : networkQuality === 'limited' ? '#92400e' : '#991b1b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: networkQuality === 'good' ? '#16a34a' : networkQuality === 'limited' ? '#d97706' : '#dc2626'
            }} />
            <strong>
              {networkQuality === 'good' && '🟢 Good Connection • You can use video consultation.'}
              {networkQuality === 'limited' && '🟠 Weak Connection • Audio or text will work better.'}
              {networkQuality === 'offline' && "🔴 No Internet • Your saved health records are available."}
            </strong>
          </div>

          {networkQuality === 'limited' && (
            <button
              type="button"
              onClick={() => handleStartConsultation()}
              style={{
                background: '#d97706',
                color: '#ffffff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Continue with Audio
            </button>
          )}
        </div>
      </div>

      {bookingSuccessNotice && (
        <div className="alert ok" style={{ marginBottom: '14px' }}>
          <Check size={16} /> {bookingSuccessNotice}
        </div>
      )}

      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* 2. ELDERLY-FRIENDLY "SIMPLE MODE" (Prompt Section 6 & 8) */}
      {/* ======================================================== */}
      {isSimpleMode && (
        <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
          {/* Top Banner to switch back or see status */}
          <div style={{
            background: '#e0f2fe',
            padding: '12px 18px',
            borderRadius: '14px',
            color: '#0369a1',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '2px solid #bae6fd'
          }}>
            <span style={{ fontWeight: 700 }}>
              🟢 {lang === 'ଓଡ଼ିଆ' ? 'ସରଳ ମୋଡ୍ ସକ୍ରିୟ (ବଡ଼ ଅକ୍ଷର ଓ ବଟନ୍)' : lang === 'हिन्दी' ? 'सरल मोड सक्रिय (बड़े बटन)' : 'Simple Mode Active (Large Text & Easy Buttons)'}
            </span>
            <button
              type="button"
              onClick={() => setIsSimpleMode(false)}
              style={{
                background: '#ffffff',
                border: '1.5px solid #0284c7',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#0284c7',
                cursor: 'pointer',
                fontWeight: 800
              }}
            >
              {lang === 'ଓଡ଼ିଆ' ? 'ମାନକ ଦୃଶ୍ୟ' : lang === 'हिन्दी' ? 'सामान्य दृश्य' : 'Standard View'}
            </button>
          </div>

          {/* Simple Mode Back Button (when navigating away from home) */}
          {activeTab !== 'home' && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                width: '100%',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: '16px 20px',
                fontSize: '18px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
              }}
            >
              <ArrowLeft size={24} />
              <span>
                {lang === 'ଓଡ଼ିଆ'
                  ? '⬅️ ମୁଖ୍ୟ ପୃଷ୍ଠାକୁ ଫେରନ୍ତୁ'
                  : lang === 'हिन्दी'
                  ? '⬅️ मुख्य पृष्ठ पर वापस जाएं'
                  : '⬅️ BACK TO SIMPLE HOME'}
              </span>
            </button>
          )}

          {/* SIMPLE MODE SCREEN 1: HOME (Prompt Section 6) */}
          {activeTab === 'home' && (
            <div>
              <div style={{
                background: '#ffffff',
                border: '2.5px solid #0284c7',
                borderRadius: '20px',
                padding: '24px',
                textAlign: 'center',
                marginBottom: '16px',
                boxShadow: '0 4px 16px rgba(2, 132, 199, 0.1)'
              }}>
                <h1 style={{ fontSize: '26px', color: '#0f172a', margin: '0 0 8px', fontWeight: 900 }}>
                  {lang === 'ଓଡ଼ିଆ' ? 'ଆପଣ ଆଜି କିପରି ଅନୁଭବ କରୁଛନ୍ତି?' : lang === 'हिन्दी' ? 'आज आप कैसा महसूस कर रहे हैं?' : 'HOW ARE YOU FEELING TODAY?'}
                </h1>
                <p style={{ fontSize: '15px', color: '#475569', margin: 0, fontWeight: 600 }}>
                  {lang === 'ଓଡ଼ିଆ' ? 'ତଳେ ଥିବା ଯେକୌଣସି ବଡ଼ ବଟନ୍ ଦବାନ୍ତୁ:' : lang === 'हिन्दी' ? 'नीचे दिए गए किसी भी बड़े बटन को दबाएं:' : 'Tap any of the 5 large options below to get immediate help:'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {/* 1. I'm not feeling well */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('symptom');
                    setSymptomStep(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    background: '#ffffff',
                    border: '3px solid #0284c7',
                    borderRadius: '20px',
                    padding: '24px 20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(2, 132, 199, 0.12)'
                  }}
                >
                  <div style={{ fontSize: '42px', marginBottom: '8px' }}>🩺</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#0284c7' }}>
                    {lang === 'ଓଡ଼ିଆ' ? 'ମୋ ଦେହ ଭଲ ଲାଗୁନି' : lang === 'हिन्दी' ? 'मेरी तबीयत ठीक नहीं है' : "I'm not feeling well"}
                  </div>
                  <div style={{ fontSize: '14px', color: '#475569', marginTop: '6px', fontWeight: 600 }}>
                    {lang === 'ଓଡ଼ିଆ' ? 'ସରଳ ଉପାୟରେ ଲକ୍ଷଣ ଯାଞ୍ଚ କରନ୍ତୁ' : lang === 'हिन्दी' ? 'सरल चरणों में लक्षण जांचें' : 'Check symptoms in 3 simple steps'}
                  </div>
                </button>

                {/* 2. Talk to a Doctor */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('doctor');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    background: '#ffffff',
                    border: '3px solid #16a34a',
                    borderRadius: '20px',
                    padding: '24px 20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(22, 163, 74, 0.12)'
                  }}
                >
                  <div style={{ fontSize: '42px', marginBottom: '8px' }}>👨‍⚕️</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#16a34a' }}>
                    {lang === 'ଓଡ଼ିଆ' ? 'ଡାକ୍ତରଙ୍କ ସହିତ କଥା ହୁଅନ୍ତୁ' : lang === 'हिन्दी' ? 'डॉक्टर से बात करें' : 'Talk to a Doctor'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#475569', marginTop: '6px', fontWeight: 600 }}>
                    {lang === 'ଓଡ଼ିଆ' ? 'ଡାକ୍ତର ଅନନ୍ୟା ମିଶ୍ର, DHH ଭବାନୀପାଟଣା' : lang === 'हिन्दी' ? 'डॉ. अनन्या मिश्रा, DHH भवानीपटना' : 'Dr. Ananya Mishra at DHH Bhawanipatna'}
                  </div>
                </button>

                {/* 3. Find My Medicine */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('medicines');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    background: '#ffffff',
                    border: '3px solid #0d70d4',
                    borderRadius: '20px',
                    padding: '24px 20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(13, 112, 212, 0.12)'
                  }}
                >
                  <div style={{ fontSize: '42px', marginBottom: '8px' }}>💊</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#0d70d4' }}>
                    {lang === 'ଓଡ଼ିଆ' ? 'ଔଷଧ ଖୋଜନ୍ତୁ' : lang === 'हिन्दी' ? 'दवा खोजें' : 'Find My Medicine'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#475569', marginTop: '6px', fontWeight: 600 }}>
                    {lang === 'ଓଡ଼ିଆ' ? 'ଗାଁ ଦୋକାନରେ ଔଷଧ ଅଛି କି ନାହିଁ ଦେଖନ୍ତୁ' : lang === 'हिन्दी' ? 'स्थानीय दुकान में दवा उपलब्धता जांचें' : 'Check stock before traveling 20km'}
                  </div>
                </button>

                {/* 4. My Health Records */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('records');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    background: '#ffffff',
                    border: '3px solid #475569',
                    borderRadius: '20px',
                    padding: '24px 20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(71, 85, 105, 0.12)'
                  }}
                >
                  <div style={{ fontSize: '42px', marginBottom: '8px' }}>📋</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#334155' }}>
                    {lang === 'ଓଡ଼ିଆ' ? 'ମୋର ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ' : lang === 'हिन्दी' ? 'मेरे स्वास्थ्य रिकॉर्ड' : 'My Health Records'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#475569', marginTop: '6px', fontWeight: 600 }}>
                    {lang === 'ଓଡ଼ିଆ' ? 'ପୁରୁଣା ପ୍ରେସକ୍ରିପସନ୍ ଓ ରିପୋର୍ଟ ଅଫଲାଇନ୍ ଦେଖନ୍ତୁ' : lang === 'हिन्दी' ? 'पुराने पर्चे और रिपोर्ट ऑफ़लाइन देखें' : 'View saved prescriptions & test reports'}
                  </div>
                </button>

                {/* 5. Emergency Help */}
                <button
                  type="button"
                  onClick={() => setIsEmergencyHelpOpen(true)}
                  style={{
                    background: '#fef2f2',
                    border: '3px solid #dc2626',
                    borderRadius: '20px',
                    padding: '24px 20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(220, 38, 38, 0.15)'
                  }}
                >
                  <div style={{ fontSize: '42px', marginBottom: '8px' }}>🆘</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#dc2626' }}>
                    {lang === 'ଓଡ଼ିଆ' ? 'ଜରୁରୀକାଳୀନ ସହାୟତା (୧୦୮)' : lang === 'हिन्दी' ? 'आपातकालीन सहायता (108)' : 'Emergency Help (108)'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#991b1b', marginTop: '6px', fontWeight: 700 }}>
                    {lang === 'ଓଡ଼ିଆ' ? '୧୦୮ ଆମ୍ବୁଲାନ୍ସ କିମ୍ବା ୧୦୪ ସ୍ୱାସ୍ଥ୍ୟ ହେଲ୍ପଲାଇନ୍' : lang === 'हिन्दी' ? '108 एम्बुलेंस या 104 हेल्पलाइन' : 'Immediate ambulance & hospital help'}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* SIMPLE MODE SCREEN 2: SYMPTOM INTAKE */}
          {activeTab === 'symptom' && (
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '2.5px solid #0284c7', padding: '24px', boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 800 }}>
                  STEP {symptomStep} OF 4
                </span>
                <h2 style={{ fontSize: '24px', color: '#0f172a', margin: '10px 0 6px', fontWeight: 900 }}>
                  {symptomStep === 1
                    ? (lang === 'ଓଡ଼ିଆ' ? 'ଆପଣଙ୍କର କଣ ଅସୁବିଧା ହେଉଛି?' : lang === 'हिन्दी' ? 'आपको क्या तकलीफ हो रही है?' : 'What is your main problem?')
                    : symptomStep === 2
                    ? (lang === 'ଓଡ଼ିଆ' ? 'ଏହି ସମସ୍ୟା କେତେ ଦିନରୁ ହେଉଛି?' : lang === 'हिन्दी' ? 'यह समस्या कितने दिनों से है?' : 'How long have you had this problem?')
                    : symptomStep === 3
                    ? (lang === 'ଓଡ଼ିଆ' ? 'କଷ୍ଟ ବା ଯନ୍ତ୍ରଣା କିପରି ଲାଗୁଛି?' : lang === 'हिन्दी' ? 'तकलीफ कितनी ज्यादा महसूस हो रही है?' : 'How severe is your discomfort?')
                    : (lang === 'ଓଡ଼ିଆ' ? 'ଏବେ ଆପଣଙ୍କୁ କଣ କରିବାକୁ ହେବ' : lang === 'हिन्दी' ? 'अब आपको क्या करना चाहिए' : 'Here is what you should do next')}
                </h2>
              </div>

              {symptomStep === 1 && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '18px' }}>
                    {[
                      { name: 'Fever', icon: '🤒', odia: 'ଜ୍ୱର', hindi: 'बुखार' },
                      { name: 'Cold / Cough', icon: '🤧', odia: 'ଥଣ୍ଡା / କାଶ', hindi: 'सर्दी / खांसी' },
                      { name: 'Pain', icon: '🤕', odia: 'ଦେହ ବିନ୍ଧା', hindi: 'बदन दर्द' },
                      { name: 'Breathing problem', icon: '😮‍💨', odia: 'ଶ୍ୱାସକ୍ରିୟା କଷ୍ଟ', hindi: 'सांस लेने में दिक्कत' },
                      { name: 'Vomiting', icon: '🤢', odia: 'ବାନ୍ତି', hindi: 'उल्टी' },
                      { name: 'Loose motion', icon: '💧', odia: 'ଝାଡ଼ା (ତରଳ)', hindi: 'दस्त' },
                      { name: 'Weakness', icon: '💪', odia: 'ଦୁର୍ବଳତା', hindi: 'कमजोरी' },
                      { name: 'Something else', icon: '➕', odia: 'ଅନ୍ୟାନ୍ୟ', hindi: 'कुछ और' }
                    ].map((s) => (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => {
                          setSelectedSymptom(s.name);
                          setSelectedSymptomIcon(s.icon);
                          setSymptomStep(2);
                        }}
                        style={{
                          background: selectedSymptom === s.name ? '#0284c7' : '#f8fafc',
                          color: selectedSymptom === s.name ? '#ffffff' : '#0f172a',
                          border: selectedSymptom === s.name ? '3px solid #0284c7' : '2px solid #cbd5e1',
                          borderRadius: '16px',
                          padding: '18px 14px',
                          fontSize: '18px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <span style={{ fontSize: '32px' }}>{s.icon}</span>
                        <span>{lang === 'ଓଡ଼ିଆ' ? s.odia : lang === 'हिन्दी' ? s.hindi : s.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Voice Button */}
                  <button
                    type="button"
                    onClick={() => setIsVoiceOpen(true)}
                    style={{
                      width: '100%',
                      background: '#eff6ff',
                      color: '#0284c7',
                      border: '2px dashed #0284c7',
                      borderRadius: '16px',
                      padding: '16px',
                      fontSize: '17px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    <Mic size={24} />
                    <span>{lang === 'ଓଡ଼ିଆ' ? 'କହିକି ଜଣାନ୍ତୁ (ଭଏସ୍ ଇନପୁଟ୍)' : lang === 'हिन्दी' ? 'बोलकर बताएं (आवाज रिकॉर्ड करें)' : 'Speak your symptom using voice'}</span>
                  </button>
                </div>
              )}

              {symptomStep === 2 && (
                <div style={{ display: 'grid', gap: '14px' }}>
                  {['Today', '2 to 3 days', 'More than 3 days'].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => {
                        setSymptomDuration(dur);
                        setSymptomStep(3);
                      }}
                      style={{
                        background: '#f8fafc',
                        border: '2px solid #cbd5e1',
                        borderRadius: '16px',
                        padding: '20px',
                        fontSize: '20px',
                        fontWeight: 800,
                        color: '#0f172a',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              )}

              {symptomStep === 3 && (
                <div style={{ display: 'grid', gap: '14px' }}>
                  {[
                    { level: 'Mild', label: 'Mild (ସାମାନ୍ୟ କଷ୍ଟ / हल्का दर्द)' },
                    { level: 'Moderate', label: 'Moderate (ମଧ୍ୟମ କଷ୍ଟ / मध्यम)' },
                    { level: 'Severe', label: 'Severe (ଖୁବ୍ ବେଶୀ କଷ୍ଟ / बहुत तेज दर्द)' }
                  ].map((sev) => (
                    <button
                      key={sev.level}
                      type="button"
                      onClick={() => {
                        setSymptomSeverity(sev.level as any);
                        setSymptomStep(4);
                      }}
                      style={{
                        background: sev.level === 'Severe' ? '#fef2f2' : '#f8fafc',
                        border: sev.level === 'Severe' ? '3px solid #ef4444' : '2px solid #cbd5e1',
                        borderRadius: '16px',
                        padding: '20px',
                        fontSize: '19px',
                        fontWeight: 800,
                        color: sev.level === 'Severe' ? '#b91c1c' : '#0f172a',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {sev.label}
                    </button>
                  ))}
                </div>
              )}

              {symptomStep === 4 && (
                <div>
                  {selectedSymptom.includes('Breathing') || symptomSeverity === 'Severe' ? (
                    <div style={{ background: '#fef2f2', border: '3px solid #dc2626', borderRadius: '18px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
                      <div style={{ fontSize: '48px', marginBottom: '6px' }}>🔴</div>
                      <h3 style={{ fontSize: '24px', color: '#991b1b', margin: '0 0 8px', fontWeight: 900 }}>
                        EMERGENCY — IMMEDIATE PHYSICAL CARE
                      </h3>
                      <p style={{ fontSize: '16px', color: '#7f1d1d', margin: '0 0 16px', fontWeight: 600 }}>
                        Please seek immediate medical attention at the nearest hospital. Do not wait for an online appointment.
                      </p>
                      <a
                        href="tel:108"
                        style={{
                          background: '#dc2626',
                          color: '#ffffff',
                          padding: '16px 28px',
                          borderRadius: '14px',
                          fontSize: '18px',
                          fontWeight: 900,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <PhoneCall size={22} /> CALL 108 AMBULANCE NOW
                      </a>
                    </div>
                  ) : (
                    <div style={{ background: '#f0fdf4', border: '3px solid #16a34a', borderRadius: '18px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
                      <div style={{ fontSize: '48px', marginBottom: '6px' }}>🟢</div>
                      <h3 style={{ fontSize: '24px', color: '#166534', margin: '0 0 8px', fontWeight: 900 }}>
                        {lang === 'ଓଡ଼ିଆ' ? 'ଡାକ୍ତରଙ୍କ ସହିତ ପରାମର୍ଶ କରନ୍ତୁ' : lang === 'हिन्दी' ? 'डॉक्टर से परामर्श करें' : 'CONSULT A DOCTOR'}
                      </h3>
                      <div style={{ background: '#ffffff', border: '1.5px solid #86efac', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', textAlign: 'left' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>
                          Preliminary Triage Summary (AI Assisted • Clinical Review Required)
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                          Reported: {selectedSymptomIcon} {selectedSymptom} • {symptomDuration} ({symptomSeverity})
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          Safety Notice: AI assists. Doctors decide. Dr. Ananya Mishra at DHH Bhawanipatna is on OPD duty.
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            speakText('Connecting to Dr. Ananya Mishra at District Headquarters Hospital');
                            handleStartConsultation(primaryDoctor);
                          }}
                          style={{
                            background: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '14px',
                            padding: '16px 28px',
                            fontSize: '18px',
                            fontWeight: 900,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
                          }}
                        >
                          <Video size={22} />
                          <span>1-TAP CALL DOCTOR NOW ➔</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newToken = storage.generateToken(primaryDoctor.name, primaryDoctor.specialty);
                            setToken(newToken);
                            setSelectedConsultDoctor(primaryDoctor);
                            speakText(`Token generated. Token number ${newToken.tokenNumber}. Wait time approximately ${newToken.estimatedWaitMin} minutes.`);
                            setBookingSuccessNotice(`✓ Token #${newToken.tokenNumber} issued successfully!`);
                            setTimeout(() => setBookingSuccessNotice(''), 4500);
                            setActiveTab('doctor');
                          }}
                          style={{
                            background: '#ffffff',
                            color: '#0284c7',
                            border: '2px solid #0284c7',
                            borderRadius: '14px',
                            padding: '14px 20px',
                            fontSize: '16px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          <Calendar size={18} />
                          <span>GET NEXT APPOINTMENT TOKEN (NO FORMS)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setSymptomStep(1)}
                      style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '15px', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      ↺ Check another symptom
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SIMPLE MODE SCREEN 3: DOCTOR */}
          {activeTab === 'doctor' && (
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '2.5px solid #16a34a', padding: '24px', boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
              {token ? (
                <div style={{ textAlign: 'center', padding: '20px', background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>YOUR ACTIVE APPOINTMENT TOKEN</div>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#15803d', margin: '8px 0' }}>#{token.tokenNumber}</div>
                  <div style={{ fontSize: '16px', color: '#166534', marginBottom: '18px', fontWeight: 700 }}>With Dr. {token.doctorName} • Wait: ~{token.estimatedWaitMin} mins</div>
                  <button
                    type="button"
                    onClick={() => {
                      const tokenDoc = allDoctors.find(d => d.name === token?.doctorName) || selectedConsultDoctor || primaryDoctor;
                      handleStartConsultation(tokenDoc);
                    }}
                    style={{
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '16px 32px',
                      fontSize: '18px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)'
                    }}
                  >
                    <Video size={22} />
                    <span>START DOCTOR CALL NOW</span>
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                    <div style={{ fontSize: '48px' }}>👨‍⚕️</div>
                    <div>
                      <h2 style={{ fontSize: '22px', margin: '0 0 4px', color: '#0f172a', fontWeight: 900 }}>Dr. Ananya Mishra</h2>
                      <div style={{ fontSize: '15px', color: '#16a34a', fontWeight: 800 }}>General Medicine • Available Now</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>District Headquarters Hospital (DHH) Bhawanipatna</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        speakText('Connecting to Dr. Ananya Mishra at District Headquarters Hospital');
                        handleStartConsultation(primaryDoctor);
                      }}
                      style={{
                        width: '100%',
                        background: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '16px',
                        padding: '18px',
                        fontSize: '19px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
                      }}
                    >
                      <Video size={22} />
                      <span>1-TAP CALL DOCTOR NOW (FREE GOVT SERVICE)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newToken = storage.generateToken(primaryDoctor.name, primaryDoctor.specialty);
                        setToken(newToken);
                        setSelectedConsultDoctor(primaryDoctor);
                        speakText(`Your appointment token is generated. Token number ${newToken.tokenNumber}. Wait time approximately ${newToken.estimatedWaitMin} minutes.`);
                        setBookingSuccessNotice(`✓ Token #${newToken.tokenNumber} issued successfully!`);
                        setTimeout(() => setBookingSuccessNotice(''), 4500);
                      }}
                      style={{
                        width: '100%',
                        background: '#ffffff',
                        color: '#0284c7',
                        border: '2.5px solid #0284c7',
                        borderRadius: '16px',
                        padding: '16px',
                        fontSize: '17px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                      }}
                    >
                      <Calendar size={20} />
                      <span>GET NEXT APPOINTMENT TOKEN (NO FORMS)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SIMPLE MODE SCREEN 4: MEDICINES */}
          {activeTab === 'medicines' && (
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '2.5px solid #0d70d4', padding: '24px' }}>
              <h2 style={{ fontSize: '22px', margin: '0 0 14px', color: '#0f172a', fontWeight: 900 }}>
                {lang === 'ଓଡ଼ିଆ' ? 'ଗ୍ରାମୀଣ ଔଷଧ ଉପଲବ୍ଧତା' : lang === 'हिन्दी' ? 'ग्रामीण दवा उपलब्धता' : 'Village Medicine Stock'}
              </h2>

              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search size={22} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={medicineSearch}
                  onChange={(e) => setMedicineSearch(e.target.value)}
                  placeholder="Type medicine name (e.g. Paracetamol)..."
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 44px',
                    borderRadius: '14px',
                    border: '2px solid #cbd5e1',
                    fontSize: '16px',
                    fontWeight: 600
                  }}
                />
              </div>

              <div style={{ display: 'grid', gap: '14px' }}>
                {filteredMedicines.slice(0, 5).map((med) => (
                  <div key={med.id} style={{ padding: '16px', borderRadius: '16px', border: '2px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '18px', color: '#0f172a' }}>{med.name}</strong>
                      <div style={{ fontSize: '13px', color: '#0369a1', fontWeight: 700, marginTop: '2px' }}>
                        {med.pharmacyName} ({med.distanceKm} km)
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        background: med.status === 'AVAILABLE' ? '#dcfce7' : med.status === 'LIMITED STOCK' ? '#fef3c7' : '#fee2e2',
                        color: med.status === 'AVAILABLE' ? '#166534' : med.status === 'LIMITED STOCK' ? '#92400e' : '#991b1b',
                        padding: '6px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 900
                      }}>
                        {med.status === 'AVAILABLE' ? '🟢 AVAILABLE' : med.status === 'LIMITED STOCK' ? '🟠 LIMITED' : '🔴 OUT OF STOCK'}
                      </span>
                      <a href="tel:+919437012345" style={{ background: '#0284c7', color: '#ffffff', padding: '8px 14px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 800 }}>
                        📞 Call Chemist
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SIMPLE MODE SCREEN 5: HEALTH RECORDS */}
          {activeTab === 'records' && (
            <div style={{ background: '#ffffff', borderRadius: '20px', border: '2.5px solid #475569', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '22px', margin: 0, color: '#0f172a', fontWeight: 900 }}>
                  {lang === 'ଓଡ଼ିଆ' ? 'ମୋର ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ' : lang === 'हिन्दी' ? 'मेरे स्वास्थ्य रिकॉर्ड' : 'My Saved Health Records'}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsHealthCardOpen(true)}
                  style={{ background: '#0284c7', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
                >
                  💳 Digital Health Card
                </button>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {prescriptions.map((rx) => (
                  <div key={rx.id} style={{ padding: '16px', borderRadius: '14px', border: '2px solid #cbd5e1', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>{rx.date}</div>
                        <strong style={{ fontSize: '16px', color: '#0f172a' }}>Prescription #{rx.prescriptionNumber}</strong>
                        <div style={{ fontSize: '13px', color: '#475569' }}>{rx.diagnosisSummary}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setViewingPrescription(rx)}
                        style={{ background: '#0284c7', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Open Rx
                      </button>
                    </div>

                    {rx.medicines && rx.medicines.length > 0 && (
                      <div style={{ marginTop: '4px', paddingTop: '8px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>
                          Prescribed Medicines & Village Pharmacy Availability:
                        </div>
                        {rx.medicines.map((m, mIdx) => (
                          <div key={mIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', flexWrap: 'wrap', gap: '6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                              💊 {m.name} ({m.strength}) • {m.frequency}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setMedicineSearch(m.name);
                                setActiveTab('medicines');
                                speakText(`Checking medicine availability for ${m.name}`);
                              }}
                              style={{
                                background: '#0284c7',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              🔍 Find Medicine
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {documents.map((doc) => (
                  <div key={doc.id} style={{ padding: '16px', borderRadius: '14px', border: '2px solid #cbd5e1', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>{doc.date}</div>
                      <strong style={{ fontSize: '16px', color: '#0f172a' }}>{doc.title}</strong>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>{doc.category}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewingDocument(doc)}
                      style={{ background: '#0284c7', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      View Report
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. STANDARD TAB 1: HOME (Prompt Section 2 & 3)           */}
      {/* ======================================================== */}
      {!isSimpleMode && activeTab === 'home' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Main Hero Question: "How are you feeling today?" (Section 2) */}
          <div
            className="card"
            style={{
              padding: '24px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #071c42 0%, #0d3875 100%)',
              color: '#ffffff',
              border: '1px solid rgba(25, 211, 255, 0.25)',
              boxShadow: '0 8px 24px rgba(7, 28, 66, 0.15)'
            }}
          >
            <div style={{ fontSize: '15px', color: '#93c5fd', fontWeight: 600 }}>
              {getPatientGreeting()}
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '26px', margin: '6px 0 16px' }}>
              {getTranslation(lang, 'howAreYouFeeling')}
            </h1>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('symptom');
                  setSymptomStep(1);
                }}
                style={{
                  background: 'linear-gradient(135deg, #168cff, #19d3ff)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 28px',
                  fontSize: '18px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 18px rgba(22, 140, 255, 0.4)'
                }}
              >
                <span>🩺</span>
                <span>{getTranslation(lang, 'checkMySymptoms')}</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => setIsCareFlowOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: '1.5px solid rgba(25, 211, 255, 0.4)',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                title="View complete Swasthya Path Care Navigation diagram"
              >
                <Compass size={18} style={{ color: '#19d3ff' }} />
                <span>🧭 Care Navigation Flow</span>
              </button>
            </div>

            {/* Mini Roadmap / Care Journey Bar */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '11px',
                color: '#cbd5e1'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ color: '#19d3ff', fontWeight: 700 }}>1. Patient &ldquo;How are you feeling?&rdquo;</span>
                <span>➔</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>2. AI Chatbot (Safety Screening)</span>
                <span>➔</span>
                <span style={{ color: '#fde047', fontWeight: 600 }}>3. Urgency (🟢/🟠/🔴)</span>
                <span>➔</span>
                <span style={{ color: '#86efac', fontWeight: 600 }}>4. Doctor Consult</span>
                <span>➔</span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>5. Pharmacy (Store A, B, C)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCareFlowOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#19d3ff',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                Inspect Flow ➔
              </button>
            </div>
          </div>

          {/* Prompt Section 2: Show only the most important actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('doctor')}
              style={{
                background: '#ffffff',
                border: '2px solid #0284c7',
                borderRadius: '14px',
                padding: '16px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 800,
                color: '#0284c7',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)'
              }}
            >
              <span style={{ fontSize: '24px' }}>👨‍⚕️</span>
              <span>{getTranslation(lang, 'talkToDoctor')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('doctor')}
              style={{
                background: '#ffffff',
                border: '2px solid #0d70d4',
                borderRadius: '14px',
                padding: '16px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 800,
                color: '#0d70d4',
                boxShadow: '0 2px 8px rgba(13, 112, 212, 0.08)'
              }}
            >
              <span style={{ fontSize: '24px' }}>📅</span>
              <span>{getTranslation(lang, 'myAppointment')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('medicines')}
              style={{
                background: '#ffffff',
                border: '2px solid #0891b2',
                borderRadius: '14px',
                padding: '16px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 800,
                color: '#0891b2',
                boxShadow: '0 2px 8px rgba(8, 145, 178, 0.08)'
              }}
            >
              <span style={{ fontSize: '24px' }}>💊</span>
              <span>{getTranslation(lang, 'myMedicines')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('records')}
              style={{
                background: '#ffffff',
                border: '2px solid #475569',
                borderRadius: '14px',
                padding: '16px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 800,
                color: '#334155',
                boxShadow: '0 2px 8px rgba(51, 65, 85, 0.08)'
              }}
            >
              <span style={{ fontSize: '24px' }}>📋</span>
              <span>{getTranslation(lang, 'myHealthRecords')}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEmergencyHelpOpen(true)}
              style={{
                background: '#fef2f2',
                border: '2px solid #ef4444',
                borderRadius: '14px',
                padding: '16px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 800,
                color: '#b91c1c',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)'
              }}
            >
              <span style={{ fontSize: '24px' }}>🆘</span>
              <span>{getTranslation(lang, 'emergencyHelp')}</span>
            </button>
          </div>

          {/* Active Consultation Token if user is in queue */}
          {token && (
            <div
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 6px 18px rgba(2, 132, 199, 0.25)'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#bae6fd', fontWeight: 800 }}>
                  Active Consultation Appointment
                </div>
                <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '2px' }}>
                  Token: {token.tokenNumber} • Pos: #{token.queuePosition}
                </div>
                <div style={{ fontSize: '12px', color: '#e0f2fe' }}>
                  With <strong>{token.doctorName}</strong> ({token.requestedSpecialty}) • Est. Wait: <strong>{token.estimatedWaitMin} mins</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const tokenDoc = allDoctors.find(d => d.name === token?.doctorName) || selectedConsultDoctor || primaryDoctor;
                  handleStartConsultation(tokenDoc);
                }}
                style={{
                  background: '#ffffff',
                  color: '#0369a1',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Video size={16} />
                <span>Join Video Room</span>
              </button>
            </div>
          )}

          {/* Prompt Section 3: "WHAT DO YOU NEED?" Large Simple Section */}
          <div>
            <h3 style={{ fontSize: '16px', color: '#071c42', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {getTranslation(lang, 'whatDoYouNeed')}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              <div
                className="card"
                onClick={() => {
                  setActiveTab('symptom');
                  setSymptomStep(1);
                }}
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  border: '1.5px solid #e2e8f0',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '32px' }}>🩺</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                    {getTranslation(lang, 'notFeelingWell')}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Check your symptoms step-by-step
                  </span>
                </div>
              </div>

              <div
                className="card"
                onClick={() => setActiveTab('doctor')}
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  border: '1.5px solid #e2e8f0'
                }}
              >
                <div style={{ fontSize: '32px' }}>👨‍⚕️</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                    {getTranslation(lang, 'talkToDoctor')}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Video or audio call with DHH clinicians
                  </span>
                </div>
              </div>

              <div
                className="card"
                onClick={() => setActiveTab('medicines')}
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  border: '1.5px solid #e2e8f0'
                }}
              >
                <div style={{ fontSize: '32px' }}>💊</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                    {getTranslation(lang, 'needMedicine')}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Check stock in local village pharmacies
                  </span>
                </div>
              </div>

              <div
                className="card"
                onClick={() => setActiveTab('doctor')}
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  border: '1.5px solid #e2e8f0'
                }}
              >
                <div style={{ fontSize: '32px' }}>📅</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                    {getTranslation(lang, 'haveAppointment')}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    View upcoming visits & active tokens
                  </span>
                </div>
              </div>

              <div
                className="card"
                onClick={() => setActiveTab('records')}
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  border: '1.5px solid #e2e8f0'
                }}
              >
                <div style={{ fontSize: '32px' }}>📋</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
                    {getTranslation(lang, 'wantRecords')}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {records.length} saved records available offline
                  </span>
                </div>
              </div>

              <div
                className="card"
                onClick={() => setIsEmergencyHelpOpen(true)}
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: '#fffbfa',
                  border: '1.5px solid #fecaca'
                }}
              >
                <div style={{ fontSize: '32px' }}>🆘</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#dc2626' }}>
                    {getTranslation(lang, 'urgentHelp')}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#991b1b' }}>
                    108 Ambulance & immediate medical help
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Care Status: Upcoming Follow-up (Section 32) */}
          <div style={{ background: '#eff6ff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#1e40af' }}>
                  Next Follow-up Reminder
                </span>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e3a8a', marginTop: '2px' }}>
                  Doctor Review Due in 3 Days (Dr. Ananya Mishra)
                </div>
                <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '2px' }}>
                  Take prescribed medicines and record body temperature daily.
                </div>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveTab('records')}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                View Care Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB 2: SYMPTOM SCREEN (Prompt Section 4, 5, 10, 11)   */}
      {/* ======================================================== */}
      {!isSimpleMode && activeTab === 'symptom' && (
        <div>
          {renderBackButton()}
          <div className="card" style={{ padding: '24px', borderRadius: '20px' }}>
          {/* Swasthya Sathi - AI Care Navigator Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #071c42 0%, #0d3875 100%)',
              color: '#ffffff',
              padding: '14px 18px',
              borderRadius: '14px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(25, 211, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}
              >
                🤖
              </div>
              <div>
                <strong style={{ fontSize: '15px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Swasthya Sathi • AI Care Navigator
                  <span style={{ background: '#22c55e', width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }}></span>
                </strong>
                <div style={{ fontSize: '11px', color: '#93c5fd' }}>
                  Deterministic Safety Screening Active • AI Never Makes a Medical Diagnosis
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCareFlowOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(25, 211, 255, 0.4)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Compass size={14} style={{ color: '#19d3ff' }} />
              <span>🧭 Care Navigation Flow</span>
            </button>
          </div>

          {/* Progress Indicator (Prompt Section 27) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7' }}>
              {symptomStep <= 4 ? `Step ${symptomStep} of 4` : 'Your Care Recommendation'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              YOUR SYMPTOMS: {symptomStep === 1 ? '●━━━○━━━○━━━○' : symptomStep === 2 ? '●━━━●━━━○━━━○' : symptomStep === 3 ? '●━━━●━━━●━━━○' : '●━━━●━━━●━━━●'}
            </div>
          </div>

          {/* STEP 1: What is bothering you? (Section 4) */}
          {symptomStep === 1 && (
            <div>
              {/* Swasthya Sathi Chat Bubble */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  🤖
                </div>
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', borderTopLeftRadius: '4px', padding: '10px 14px', maxWidth: '90%' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Swasthya Sathi
                  </div>
                  <div style={{ fontSize: '14px', color: '#14532d', fontWeight: 600 }}>
                    {lang === 'ଓଡ଼ିଆ' 
                      ? `ନମସ୍କାର ${user.name}! ଆଜି ଆପଣ କିପରି ଅନୁଭବ କରୁଛନ୍ତି? ଆପଣଙ୍କ ଲକ୍ଷଣ ଚୟନ କରନ୍ତୁ କିମ୍ବା କହିବାକୁ ମାଇକ୍ ବଟନ୍ ଦବାନ୍ତୁ:` 
                      : lang === 'हिन्दी' 
                      ? `नमस्ते ${user.name}! आज आप कैसा महसूस कर रहे हैं? कृपया अपने लक्षण चुनें या बोलने के लिए माइक दबाएं:` 
                      : `Namaste ${user.name}! How are you feeling today? Tap what you are experiencing below, or use voice:`}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>
                  What is bothering you?
                </h2>
                <button
                  type="button"
                  onClick={() => setIsVoiceOpen(true)}
                  style={{
                    background: '#eff6ff',
                    color: '#0284c7',
                    border: '1px solid #bfdbfe',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Mic size={15} />
                  <span>🎤 Tell us by voice</span>
                </button>
              </div>

              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
                Choose what you are feeling right now:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                {SYMPTOM_OPTIONS.map((sym) => (
                  <button
                    key={sym.name}
                    type="button"
                    onClick={() => handleSelectSymptom(sym)}
                    style={{
                      background: selectedSymptom === sym.name ? '#eff6ff' : '#ffffff',
                      border: selectedSymptom === sym.name ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '14px 10px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '32px' }}>{sym.icon}</span>
                    <strong style={{ fontSize: '13px', color: '#0f172a' }}>{sym.name}</strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {lang === 'ଓଡ଼ିଆ' ? sym.odia : lang === 'हिन्दी' ? sym.hindi : ''}
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleGoBack}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                >
                  <ArrowLeft size={15} />
                  <span>{lang === 'ଓଡ଼ିଆ' ? '← ପଛକୁ ଫେରନ୍ତୁ (ମୁଖ୍ୟ ପୃଷ୍ଠା)' : lang === 'हिन्दी' ? '← वापस जाएं (मुख्य पृष्ठ)' : '← Back to Home'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Duration (Section 5) */}
          {symptomStep === 2 && (
            <div>
              {/* Swasthya Sathi Chat Bubble */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  🤖
                </div>
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', borderTopLeftRadius: '4px', padding: '10px 14px', maxWidth: '90%' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Swasthya Sathi
                  </div>
                  <div style={{ fontSize: '14px', color: '#14532d', fontWeight: 600 }}>
                    {lang === 'ଓଡ଼ିଆ' ? `ମୁଁ ବୁଝିପାରିଲି: ${selectedSymptomIcon} ${selectedSymptom}। ଏହା କେତେ ଦିନ ହେଲା ଚାଲିଛି?` : lang === 'हिन्दी' ? `मैं समझ गया: ${selectedSymptomIcon} ${selectedSymptom}। यह कितने दिनों से हो रहा है?` : `I see you selected ${selectedSymptomIcon} ${selectedSymptom}. How many days have you been experiencing this?`}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#0284c7', fontWeight: 700, marginBottom: '4px' }}>
                You have selected: {selectedSymptomIcon} {selectedSymptom}
              </div>
              <h2 style={{ margin: '0 0 16px', fontSize: '20px', color: '#0f172a' }}>
                How long have you had it?
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                {['Today', '2–3 days', 'More than 3 days', "I don't know"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSymptomDuration(opt);
                      setSymptomStep(3);
                    }}
                    style={{
                      background: symptomDuration === opt ? '#eff6ff' : '#ffffff',
                      border: symptomDuration === opt ? '2px solid #0284c7' : '1.5px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '16px',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      color: '#0f172a'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSymptomStep(1)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                >
                  <ArrowLeft size={15} />
                  <span>{lang === 'ଓଡ଼ିଆ' ? '← ପୂର୍ବ ପଦକ୍ଷେପ' : lang === 'हिन्दी' ? '← पिछला चरण' : '← Previous Step'}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSymptomStep(3)}
                >
                  Next ➔
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Severity & Worsening (Section 5) */}
          {symptomStep === 3 && (
            <div>
              {/* Swasthya Sathi Chat Bubble */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  🤖
                </div>
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', borderTopLeftRadius: '4px', padding: '10px 14px', maxWidth: '90%' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Swasthya Sathi
                  </div>
                  <div style={{ fontSize: '14px', color: '#14532d', fontWeight: 600 }}>
                    {lang === 'ଓଡ଼ିଆ' ? 'ଏହା କେତେ ଅଧିକ କଷ୍ଟ ଦେଉଛି, ଏବଂ ଏହା କ’ଣ ବଢ଼ୁଛି?' : lang === 'हिन्दी' ? 'यह कितना गंभीर महसूस हो रहा है, और क्या यह समय के साथ बढ़ रहा है?' : 'How intense is the discomfort right now, and is it getting worse over time?'}
                  </div>
                </div>
              </div>

              <h2 style={{ margin: '0 0 16px', fontSize: '20px', color: '#0f172a' }}>
                How bad does it feel?
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {(['Mild', 'Moderate', 'Severe'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSymptomSeverity(sev)}
                    style={{
                      background: symptomSeverity === sev ? '#eff6ff' : '#ffffff',
                      border: symptomSeverity === sev ? '2px solid #0284c7' : '1.5px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '16px 10px',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      color: sev === 'Severe' ? '#b42318' : '#0f172a'
                    }}
                  >
                    {sev}
                  </button>
                ))}
              </div>

              <h2 style={{ margin: '0 0 12px', fontSize: '18px', color: '#0f172a' }}>
                Is it getting worse?
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                {(['Yes', 'No', "I'm not sure"] as const).map((wors) => (
                  <button
                    key={wors}
                    type="button"
                    onClick={() => setSymptomWorsening(wors)}
                    style={{
                      background: symptomWorsening === wors ? '#eff6ff' : '#ffffff',
                      border: symptomWorsening === wors ? '2px solid #0284c7' : '1.5px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '14px 10px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      color: '#0f172a'
                    }}
                  >
                    {wors}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSymptomStep(2)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                >
                  <ArrowLeft size={15} />
                  <span>{lang === 'ଓଡ଼ିଆ' ? '← ପୂର୍ବ ପଦକ୍ଷେପ' : lang === 'हिन्दी' ? '← पिछला चरण' : '← Previous Step'}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSymptomStep(4)}
                >
                  Next ➔
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Emergency Signs Check (Section 9) */}
          {symptomStep === 4 && (
            <div>
              {/* Swasthya Sathi Safety Screening Chat Bubble */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#dc2626', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  🛡️
                </div>
                <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '14px', borderTopLeftRadius: '4px', padding: '10px 14px', maxWidth: '90%' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Deterministic Safety Screening (Emergency Filter)
                  </div>
                  <div style={{ fontSize: '14px', color: '#7f1d1d', fontWeight: 700 }}>
                    {lang === 'ଓଡ଼ିଆ' ? 'ସୁରକ୍ଷା ଯାଞ୍ଚ: ଡାକ୍ତରଙ୍କ ସହ ସଂଯୋଗ କରିବା ପୂର୍ବରୁ, ଆପଣଙ୍କ ପାଖରେ ଏହି ଜରୁରୀ ସଙ୍କେତଗୁଡ଼ିକ ମଧ୍ୟରୁ କୌଣସି ଅଛି କି?' : lang === 'हिन्दी' ? 'सुरक्षा जांच: डॉक्टर से जोड़ने से पहले, क्या आपको इनमें से कोई भी गंभीर आपातकालीन लक्षण हैं?' : 'Safety Screening: Before connecting, do you have any of these urgent danger signs?'}
                  </div>
                </div>
              </div>
              <h2 style={{ margin: '0 0 8px', fontSize: '20px', color: '#991b1b' }}>
                Do you have any of these urgent warning signs?
              </h2>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '14px' }}>
                Select only if you feel these right now:
              </p>

              <div style={{ display: 'grid', gap: '8px', marginBottom: '24px' }}>
                {[
                  { id: 'breathing', label: '😮‍💨 Severe breathing difficulty / gasping' },
                  { id: 'chest', label: '💔 Severe chest pain / heavy pressure' },
                  { id: 'unconscious', label: '😵 Unconsciousness / fainting / unresponsive' },
                  { id: 'bleeding', label: '🩸 Severe or uncontrollable bleeding' },
                  { id: 'stroke', label: '🧠 Sudden face droop / speech slurring' },
                  { id: 'no', label: '✅ None of these warning signs' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSymptomWarningSign(item.id as WarningSignId)}
                    style={{
                      background: symptomWarningSign === item.id ? '#eff6ff' : '#ffffff',
                      border: symptomWarningSign === item.id ? '2px solid #0284c7' : '1.5px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: item.id === 'no' ? '#166534' : '#0f172a'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSymptomStep(3)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSymptomStep(5)}
                  style={{ fontWeight: 800 }}
                >
                  See My Next Step ➔
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Clear Result Screen (Prompt Section 10 & 11) */}
          {symptomStep === 5 && (
            <div>
              {/* Swasthya Sathi Chat Bubble */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '16px', textAlign: 'left' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  🤖
                </div>
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', borderTopLeftRadius: '4px', padding: '10px 14px', maxWidth: '90%' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Swasthya Sathi • Safety Screening Result
                  </div>
                  <div style={{ fontSize: '14px', color: '#14532d', fontWeight: 600 }}>
                    {symptomWarningSign !== 'no'
                      ? '⚠️ Critical danger sign detected. I am routing you immediately to emergency physical care. Do not wait for an online appointment.'
                      : symptomSeverity === 'Severe' || symptomWorsening === 'Yes' || symptomDuration === 'More than 3 days'
                      ? 'I have completed your intake. Based on your symptoms, a Doctor Consultation is recommended. Your summary is prepared.'
                      : 'I have screened your symptoms and found no urgent red flags. You can follow routine home care and monitor.'}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>
                    YOUR NEXT STEP
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCareFlowOpen(true)}
                    style={{
                      background: '#eff6ff',
                      color: '#0284c7',
                      border: '1px solid #bfdbfe',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Compass size={13} />
                    <span>View Care Navigation Diagram</span>
                  </button>
                </div>

                {symptomWarningSign !== 'no' ? (
                  /* Emergency State */
                  <div style={{ background: '#fef2f2', border: '2px solid #f87171', borderRadius: '16px', padding: '20px', marginTop: '10px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b91c1c', marginBottom: '8px' }}>
                      <AlertTriangle size={28} />
                      <h2 style={{ margin: 0, fontSize: '20px', color: '#991b1b' }}>
                        🔴 EMERGENCY: Immediate Physical Care
                      </h2>
                    </div>
                    <p style={{ fontSize: '14px', color: '#7f1d1d', lineHeight: 1.5, marginBottom: '14px' }}>
                      Some of your answers may require immediate medical attention. <strong>Do not wait for a normal online consultation.</strong>
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <a
                        href="tel:108"
                        style={{
                          background: '#dc2626',
                          color: '#ffffff',
                          padding: '12px 20px',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          fontWeight: 800,
                          fontSize: '14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <PhoneCall size={16} /> Call 108 Ambulance
                      </a>
                      <button
                        type="button"
                        onClick={() => setIsEmergencyHelpOpen(true)}
                        style={{
                          background: '#ffffff',
                          color: '#991b1b',
                          border: '1.5px solid #f87171',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Find Emergency Hospital
                      </button>
                    </div>
                  </div>
                ) : symptomSeverity === 'Severe' || symptomWorsening === 'Yes' || symptomDuration === 'More than 3 days' ? (
                  /* Intermediate State */
                  <div style={{ background: '#fffbeb', border: '2px solid #fde047', borderRadius: '16px', padding: '20px', marginTop: '10px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b45309', marginBottom: '8px' }}>
                      <Clock size={28} />
                      <h2 style={{ margin: 0, fontSize: '20px', color: '#92400e' }}>
                        🟠 MODERATE URGENCY: Doctor Consultation
                      </h2>
                    </div>
                    <p style={{ fontSize: '14px', color: '#78350f', lineHeight: 1.5, marginBottom: '12px' }}>
                      Your symptoms should be checked by a healthcare professional. Connect with a doctor via teleconsultation now.
                    </p>
                    <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', color: '#451a03', marginBottom: '16px', border: '1px solid #fef08a' }}>
                      <strong>Why?</strong> You reported: {selectedSymptom} for {symptomDuration}, Severity: {symptomSeverity}, Worsening: {symptomWorsening}.
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setActiveTab('doctor')}
                        style={{
                          background: '#d97706',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 20px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Talk to a Doctor ➔
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSymptomResult}
                        className="btn btn-secondary"
                        style={{ padding: '12px 16px', fontSize: '13px' }}
                      >
                        Save Health Note
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Routine Care State */
                  <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', padding: '20px', marginTop: '10px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#15803d', marginBottom: '8px' }}>
                      <CheckCircle2 size={28} />
                      <h2 style={{ margin: 0, fontSize: '20px', color: '#14532d' }}>
                        🟢 LOW URGENCY: Monitor / Routine Care
                      </h2>
                    </div>
                    <p style={{ fontSize: '14px', color: '#166534', lineHeight: 1.5, marginBottom: '12px' }}>
                      Based on the information entered, no urgent warning flag was identified by this screening. If symptoms worsen or persist over 48 hours, seek medical care.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setActiveTab('doctor')}
                        style={{
                          background: '#16a34a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 20px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Talk to a Doctor
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSymptomResult}
                        className="btn btn-secondary"
                        style={{ padding: '12px 16px', fontSize: '13px' }}
                      >
                        Monitor & Save Note
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '18px', fontSize: '12px', color: '#64748b' }}>
                  Navigation support only — not a medical diagnosis.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '18px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSymptomStep(3)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                >
                  <ArrowLeft size={15} />
                  <span>{lang === 'ଓଡ଼ିଆ' ? '← ପୂର୍ବ ପଦକ୍ଷେପ' : lang === 'हिन्दी' ? '← पिछला चरण' : '← Previous Step'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSymptomStep(1)}
                  style={{ background: 'transparent', border: 'none', color: '#0284c7', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                >
                  ↺ Check different symptoms
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigateToTab('home')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                >
                  <Home size={15} />
                  <span>{lang === 'ଓଡ଼ିଆ' ? 'ମୁଖ୍ୟ ପୃଷ୍ଠା' : lang === 'हिन्दी' ? 'मुख्य पृष्ठ' : 'Back to Home'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )}

      {/* ======================================================== */}
      {/* 5. TAB 3: DOCTOR & APPOINTMENT (Prompt Section 12 & 13)  */}
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* 5. TAB 3: DOCTOR & APPOINTMENT (Prompt Section 12 & 13)  */}
      {/* ======================================================== */}
      {!isSimpleMode && activeTab === 'doctor' && (
        <div style={{ display: 'grid', gap: '18px' }}>
          {renderBackButton()}
          {/* Active Appointment Clean Card (Prompt Section 13) */}
          {token && (
            <div
              className="card"
              style={{
                padding: '22px 24px',
                borderRadius: '18px',
                border: '2px solid #0284c7',
                background: '#f0f9ff',
                boxShadow: '0 4px 16px rgba(2, 132, 199, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0284c7' }}>
                    {getTranslation(lang, 'yourAppointment')}
                  </div>
                  <h2 style={{ fontSize: '22px', margin: '4px 0 2px', color: '#0f172a' }}>
                    {token.doctorName}
                  </h2>
                  <div style={{ color: '#0369a1', fontSize: '13px', fontWeight: 600 }}>
                    {token.requestedSpecialty} • DHH Bhawanipatna
                  </div>
                </div>

                <span
                  style={{
                    background: '#fef3c7',
                    color: '#92400e',
                    border: '1px solid #fde68a',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: 800
                  }}
                >
                  🟡 {getTranslation(lang, 'waitingForDoctor')}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #bae6fd', margin: '14px 0' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Time:</span>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Today • 10:30 AM</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Token:</span>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#0284c7', fontFamily: 'monospace' }}>{token.tokenNumber}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Estimated Wait:</span>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>~{token.estimatedWaitMin} mins</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    const tokenDoc = allDoctors.find(d => d.name === token?.doctorName) || selectedConsultDoctor || primaryDoctor;
                    handleStartConsultation(tokenDoc);
                  }}
                  style={{ padding: '12px 24px', fontSize: '15px', fontWeight: 800, borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Video size={18} /> {getTranslation(lang, 'joinConsultation')}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    storage.clearActiveToken();
                    setToken(null);
                  }}
                  style={{ fontSize: '12px', padding: '10px 16px' }}
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
          )}

          {/* Doctor Finder (Prompt Section 7 & 12) */}
          <div className="card" style={{ padding: '20px', borderRadius: '16px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '20px', color: '#0f172a' }}>
              {getTranslation(lang, 'findADoctor')}
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '14px' }}>
              {getTranslation(lang, 'whatHelpNeed')}
            </p>

            {/* Offline Doctor Availability Notification (Prompt Section 7) */}
            {!isConnected && (
              <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', padding: '12px 16px', borderRadius: '12px', color: '#991b1b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <WifiOff size={20} />
                <div>
                  <strong style={{ fontSize: '14px' }}>Doctor availability could not be updated.</strong>
                  <div style={{ fontSize: '12px', color: '#b91c1c' }}>
                    Showing cached local doctor directory. Live schedules and queue tokens will update when you reconnect.
                  </div>
                </div>
              </div>
            )}

            {/* Doctor Search & Location Filtering */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '14px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  placeholder="Search doctor by name, specialty, or hospital..."
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px'
                  }}
                  id="doctor-search-input"
                />
              </div>

              <div>
                <select
                  value={doctorLocation}
                  onChange={(e) => setDoctorLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#ffffff',
                    color: '#334155'
                  }}
                  id="doctor-location-select"
                >
                  <option value="All">All Locations & Facilities</option>
                  <option value="Bhawanipatna">DHH Bhawanipatna</option>
                  <option value="Mother & Child">Mother & Child Wing</option>
                  <option value="Junagarh">Junagarh CHC</option>
                  <option value="Dharamgarh">Dharamgarh SDH</option>
                  <option value="Kesinga">Kesinga CHC</option>
                </select>
              </div>
            </div>

            {/* Category Filters (Prompt Section 7 & 12) */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
              {[
                { id: 'All', label: 'All Doctors' },
                { id: 'General', label: '🩺 General Doctor' },
                { id: 'Child', label: '👶 Child Doctor' },
                { id: 'Internal', label: '👩 Women\'s Health' },
                { id: 'Skin', label: '🩹 Skin' },
                { id: 'Mental', label: '🧠 Mental Well-being' },
                { id: 'Other', label: '➕ Other' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setDoctorCategory(cat.id)}
                  style={{
                    background: doctorCategory === cat.id ? '#0284c7' : '#f8fafc',
                    color: doctorCategory === cat.id ? '#ffffff' : '#334155',
                    border: doctorCategory === cat.id ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: doctorCategory === cat.id ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Doctor Cards (Section 7 & 14) */}
            <div style={{ display: 'grid', gap: '14px' }}>
              {filteredDoctors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', background: '#f8fafc', borderRadius: '12px' }}>
                  No doctors found matching "{doctorSearch}". Try clearing search filters.
                </div>
              ) : (
                filteredDoctors.map((doc) => {
                  const leaveRecord = doctorLeaves.find(l => l.doctorId === doc.id);
                  const isOnLeave = Boolean(leaveRecord || doc.status === 'On Leave');
                  return (
                    <div
                      key={doc.id}
                      style={{
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                        background: '#ffffff',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ position: 'relative' }}>
                          <img
                            src={(doc.avatarUrl && !doc.avatarUrl.includes('images.unsplash.com')) ? doc.avatarUrl : (doc.gender === 'female' ? '/images/female-doctor-avatar.jpg' : '/images/male-doctor-avatar.jpg')}
                            alt={doc.name}
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #0284c7',
                              flexShrink: 0,
                              display: 'block'
                            }}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = doc.gender === 'female' ? '/images/female-doctor-avatar.jpg' : '/images/male-doctor-avatar.jpg';
                            }}
                          />
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '-2px',
                              right: '-2px',
                              background: doc.gender === 'female' ? '#ec4899' : '#0284c7',
                              color: '#ffffff',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              border: '2px solid #ffffff'
                            }}
                            title={doc.gender === 'female' ? 'Female Clinician' : 'Male Clinician'}
                          >
                            {doc.gender === 'female' ? '♀' : '♂'}
                          </span>
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>{doc.name}</h3>
                            <span style={{
                              background: doc.gender === 'female' ? '#fdf2f8' : '#eff6ff',
                              color: doc.gender === 'female' ? '#be185d' : '#1d4ed8',
                              border: `1px solid ${doc.gender === 'female' ? '#fbcfe8' : '#bfdbfe'}`,
                              padding: '1px 7px',
                              borderRadius: '999px',
                              fontSize: '11px',
                              fontWeight: 700
                            }}>
                              {doc.gender === 'female' ? '👩‍⚕️ Female' : '👨‍⚕️ Male'}
                            </span>
                            <span style={{
                              background: isOnLeave ? '#fef2f2' : doc.available ? '#f0fdf4' : '#fffbeb',
                              color: isOnLeave ? '#991b1b' : doc.available ? '#166534' : '#92400e',
                              border: isOnLeave ? '1px solid #fecaca' : doc.available ? '1px solid #bbf7d0' : '1px solid #fef08a',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '11px',
                              fontWeight: 700
                            }}>
                              {isOnLeave ? '🏖️ On Scheduled Leave' : doc.available ? '🟢 Available' : '🟠 Next Slot Today'}
                            </span>
                          </div>

                        <div style={{ color: '#0284c7', fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
                          {doc.specialty} • {doc.hospital || doc.facility}
                        </div>

                        {isOnLeave ? (
                          <div style={{ marginTop: '6px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', color: '#92400e' }}>
                            <strong>Doctor is unavailable from {leaveRecord?.startDate || '01 Oct'} to {leaveRecord?.endDate || '12 Oct 2026'}.</strong>
                            <div>Reason: {leaveRecord?.reason || 'Scheduled Academic Leave'} • Alternative Doctor: <strong>{leaveRecord?.replacementDoctor || 'Dr. Ananya Mishra'}</strong></div>
                          </div>
                        ) : (
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                            Languages: {doc.languages.join(' • ')} • Est. Wait: ~{doc.estimatedWaitMin || 15} mins
                          </div>
                        )}
                      </div>
                    </div>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => setViewingDoctorProfile(doc)}
                          className="btn btn-secondary"
                          style={{
                            padding: '9px 14px',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#ffffff',
                            borderColor: '#cbd5e1'
                          }}
                        >
                          <Eye size={15} />
                          <span>View Profile</span>
                        </button>
                        {isOnLeave ? (
                          <button
                            type="button"
                            onClick={() => {
                              const replDoc = allDoctors.find(d => d.id === 'doc-01') || doc;
                              handleInitiateBooking(replDoc);
                            }}
                            style={{
                              background: '#f8fafc',
                              color: '#0284c7',
                              border: '1.5px solid #0284c7',
                              padding: '9px 16px',
                              borderRadius: '10px',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Consult Alternative Doctor
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleInitiateBooking(doc)}
                            style={{
                              background: '#0284c7',
                              color: '#ffffff',
                              border: 'none',
                              padding: '10px 18px',
                              borderRadius: '10px',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                            }}
                          >
                            Talk to Doctor
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. TAB 4: HEALTH RECORDS (Prompt Section 15)             */}
      {/* ======================================================== */}
      {!isSimpleMode && activeTab === 'records' && (
        <div style={{ display: 'grid', gap: '18px' }}>
          {renderBackButton()}
          <div className="card" style={{ padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>
                  {getTranslation(lang, 'myHealthRecords')}
                </h2>
                <div style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>
                  Saved in your phone • Accessible offline anytime
                </div>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsHealthCardOpen(true)}
                style={{ fontSize: '13px', padding: '6px 12px' }}
              >
                <CreditCard size={15} />
                <span>Digital Health Card</span>
              </button>
            </div>

            {/* 4 Summary Tiles (Section 15) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '22px' }}>🩺</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>2</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Doctor Visits</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '22px' }}>💊</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{prescriptions.length}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Medicines</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '22px' }}>🧪</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{documents.length}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Test Reports</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '22px' }}>📋</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>1</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Referral</div>
              </div>
            </div>

            {/* Plain-Language Timeline (Section 15) */}
            <h3 style={{ fontSize: '15px', color: '#0f172a', marginBottom: '12px' }}>
              Recent Care Timeline:
            </h3>

            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ padding: '12px 14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>30 SEP 2026</div>
                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>Doctor Consultation</strong>
                  <div style={{ fontSize: '12px', color: '#0284c7' }}>Dr. Ananya Mishra • DHH Bhawanipatna</div>
                </div>
                <span className="badge badge-green">Completed</span>
              </div>

              {prescriptions.map((rx) => (
                <div key={rx.id} style={{ padding: '14px 16px', borderRadius: '12px', background: '#ffffff', border: '1.5px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>{rx.date}</div>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>
                        {lang === 'ଓଡ଼ିଆ' ? `ଇ-ପ୍ରେସକ୍ରିପସନ୍ (${rx.prescriptionNumber})` : lang === 'हिन्दी' ? `ई-प्रिस्क्रिप्शन (${rx.prescriptionNumber})` : `Prescription (${rx.prescriptionNumber})`}
                      </strong>
                      <div style={{ fontSize: '12px', color: '#475569' }}>{rx.diagnosisSummary}</div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setViewingPrescription(rx)}
                      style={{ fontSize: '11px', padding: '4px 10px', fontWeight: 700 }}
                    >
                      {lang === 'ଓଡ଼ିଆ' ? 'ପ୍ରେସକ୍ରିପସନ୍ ଖୋଲନ୍ତୁ' : lang === 'हिन्दी' ? 'पर्चा खोलें' : 'Open Rx'}
                    </button>
                  </div>

                  {/* Prompt Section 17: Find Medicine Directly from Doctor Prescription */}
                  {rx.medicines && rx.medicines.length > 0 && (
                    <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '2px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                        CARE PLAN MEDICINES:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {rx.medicines.map((med, mIdx) => (
                          <div key={mIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                            <div>
                              <strong style={{ fontSize: '13px', color: '#0f172a' }}>{med.name}</strong>
                              <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>{med.dosage} • {med.duration}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setMedicineSearch(med.name.split(' ')[0]);
                                setActiveTab('medicines');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              style={{
                                background: '#e0f2fe',
                                color: '#0369a1',
                                border: '1px solid #bae6fd',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Find which nearby pharmacies have this medicine in stock"
                            >
                              <Pill size={12} />
                              <span>Find Medicine</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {documents.map((doc) => (
                <div key={doc.id} style={{ padding: '14px 16px', borderRadius: '12px', background: '#ffffff', border: '1.5px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>{doc.date} • {doc.labName || 'DHH Central Pathology Lab'}</div>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>{doc.title}</strong>
                      <div style={{ fontSize: '12px', color: '#475569' }}>
                        Investigation Category: <strong>{doc.category}</strong> • Status: <span style={{ color: doc.status === 'Critical Flag' ? '#b91c1c' : '#166534', fontWeight: 700 }}>{doc.status || 'Verified'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setViewingDocument(doc)}
                      style={{ fontSize: '12px', padding: '6px 14px', fontWeight: 700, background: '#f5f3ff', color: '#6d28d9', borderColor: '#ddd6fe' }}
                    >
                      {lang === 'ଓଡ଼ିଆ' ? 'ରିପୋର୍ଟ ଦେଖନ୍ତୁ' : lang === 'हिन्दी' ? 'रिपोर्ट देखें' : 'View Report'}
                    </button>
                  </div>

                  {/* Measured Parameters with LOW, NORMAL, HIGH indicators */}
                  {doc.parameters && doc.parameters.length > 0 && (
                    <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                        LABORATORY MEASURED VALUES:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                        {doc.parameters.slice(0, 4).map((p, pIdx) => (
                          <div key={pIdx} style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}>
                            <div style={{ color: '#475569', fontSize: '11px' }}>{p.name}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                              <strong style={{ color: '#0f172a' }}>{p.result} {p.unit}</strong>
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: p.status === 'High' ? '#fee2e2' : p.status === 'Low' ? '#fef3c7' : '#ecfdf5',
                                color: p.status === 'High' ? '#991b1b' : p.status === 'Low' ? '#92400e' : '#047857'
                              }}>
                                {p.status === 'High' ? '🔺 HIGH' : p.status === 'Low' ? '🔻 LOW' : '✓ NORMAL'}
                              </span>
                            </div>
                            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>Ref: {p.refRange}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ fontSize: '11px', color: '#92400e', background: '#fffbeb', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                    ⚠️ <em>Laboratory results should be interpreted by a qualified healthcare professional.</em>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. TAB 5: MEDICINE AVAILABILITY (Prompt Section 16 & 17) */}
      {/* ======================================================== */}
      {!isSimpleMode && activeTab === 'medicines' && (
        <div style={{ display: 'grid', gap: '18px' }}>
          {renderBackButton()}
          <div className="card" style={{ padding: '20px', borderRadius: '16px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '20px', color: '#0f172a' }}>
              {getTranslation(lang, 'whichMedicineCheck')}
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '14px' }}>
              {lang === 'ଓଡ଼ିଆ' ? 'ସହରକୁ ଯିବା ପୂର୍ବରୁ ସ୍ଥାନୀୟ ଔଷଧ ଦୋକାନରେ ଉପଲବ୍ଧତା ଯାଞ୍ଚ କରନ୍ତୁ।' : lang === 'हिन्दी' ? 'शहर जाने से पहले स्थानीय मेडिकल स्टोर में दवाओं की उपलब्धता जांचें।' : 'Check if medicines are available locally before traveling to town.'}
            </p>

            {/* Offline Medicine Availability Notification (Prompt Section 4 & 16) */}
            {!isConnected && (
              <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', padding: '12px 16px', borderRadius: '12px', color: '#991b1b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <WifiOff size={20} />
                <div>
                  <strong style={{ fontSize: '14px' }}>You are offline.</strong>
                  <div style={{ fontSize: '12px', color: '#b91c1c' }}>
                    Your saved health information is still available. Live doctor schedules and pharmacy stock will update when you reconnect.
                  </div>
                </div>
              </div>
            )}

            {/* Direct Match for Prompt Flow: Doctor Consult -> Care Advice & Medicine -> Find Medicine -> Pharmacy Availability (Store A, Store B, Store C) */}
            <div
              style={{
                background: 'linear-gradient(135deg, #071c42 0%, #0d3875 100%)',
                color: '#ffffff',
                padding: '18px 20px',
                borderRadius: '16px',
                marginBottom: '18px',
                border: '1px solid rgba(25, 211, 255, 0.3)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Store size={20} style={{ color: '#19d3ff' }} />
                  <div>
                    <strong style={{ fontSize: '15px' }}>
                      {lang === 'ଓଡ଼ିଆ' ? 'ଔଷଧ ଉପଲବ୍ଧତା: ପାରାସିଟାମୋଲ୍ ୫୦୦ମିଗ୍ରା' : lang === 'हिन्दी' ? 'दवा उपलब्धता: पैरासिटामोल 500mg' : 'Pharmacy Availability: Paracetamol 500mg'}
                    </strong>
                    <div style={{ fontSize: '11px', color: '#93c5fd' }}>
                      {lang === 'ଓଡ଼ିଆ' ? 'କଳାହାଣ୍ଡିର ଔଷଧ ଦୋକାନଗୁଡ଼ିକରେ ଲାଇଭ୍ ଷ୍ଟକ୍ ତୁଳନା • ଅଦରକାରୀ ୨୦ କିମି ଯାତ୍ରା ବନ୍ଦ କରନ୍ତୁ' : lang === 'हिन्दी' ? 'कालाहांडी के मेडिकल स्टोरों में लाइव स्टॉक तुलना • अनावश्यक 20 किमी यात्रा से बचें' : 'Real-time inventory comparison across Kalahandi chemists • Eliminates unnecessary 20km travel'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCareFlowOpen(true)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🧭 {lang === 'ଓଡ଼ିଆ' ? 'ଚିକିତ୍ସା ପ୍ରବାହ' : lang === 'हिन्दी' ? 'केयर फ्लो' : 'Care Flow'}
                </button>
              </div>

              {/* 3-Store Side-by-Side Comparison */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {/* Store A */}
                <div style={{ background: '#ffffff', color: '#0f172a', padding: '12px', borderRadius: '12px', border: '2px solid #86efac' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px' }}>{lang === 'ଓଡ଼ିଆ' ? 'ଦୋକାନ A' : lang === 'हिन्दी' ? 'स्टोर A' : 'Store A'}</strong>
                    <span style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 800 }}>
                      {lang === 'ଓଡ଼ିଆ' ? '🟢 ଉପଲବ୍ଧ' : lang === 'हिन्दी' ? '🟢 उपलब्ध' : '🟢 AVAILABLE'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Maa Manikeswari Jan Aushadhi</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Bhawanipatna • 1.2 {lang === 'ଓଡ଼ିଆ' ? 'କିମି ଦୂର' : lang === 'हिन्दी' ? 'किमी दूर' : 'km away'}</div>
                  <div style={{ fontSize: '11px', color: '#166534', fontWeight: 700, marginTop: '6px' }}>
                    {lang === 'ଓଡ଼ିଆ' ? '୨୪୦ ଷ୍ଟକ୍ ଅଛି • ₹୧୮ / ପ୍ୟାକେଟ୍' : lang === 'हिन्दी' ? '240 स्टॉक में • ₹18 / पत्ता' : '240 in stock • ₹18 / strip'}
                  </div>
                  <a href="tel:+919437012345" style={{ display: 'inline-block', marginTop: '6px', fontSize: '11px', color: '#0284c7', textDecoration: 'none', fontWeight: 700 }}>
                    {lang === 'ଓଡ଼ିଆ' ? '📞 ଔଷଧ ଦୋକାନକୁ କଲ୍' : lang === 'हिन्दी' ? '📞 मेडिकल को कॉल' : '📞 Call Chemist'}
                  </a>
                </div>

                {/* Store B */}
                <div style={{ background: '#ffffff', color: '#0f172a', padding: '12px', borderRadius: '12px', border: '2px solid #fde047' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px' }}>{lang === 'ଓଡ଼ିଆ' ? 'ଦୋକାନ B' : lang === 'हिन्दी' ? 'स्टोर B' : 'Store B'}</strong>
                    <span style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fef08a', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 800 }}>
                      {lang === 'ଓଡ଼ିଆ' ? '🟠 ସୀମିତ ଷ୍ଟକ୍' : lang === 'हिन्दी' ? '🟠 सीमित स्टॉक' : '🟠 LIMITED'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Junagarh Gramin Pharmacy</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Junagarh Market • 18.5 {lang === 'ଓଡ଼ିଆ' ? 'କିମି ଦୂର' : lang === 'हिन्दी' ? 'किमी दूर' : 'km away'}</div>
                  <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 700, marginTop: '6px' }}>
                    {lang === 'ଓଡ଼ିଆ' ? '୮ ଷ୍ଟକ୍ ଅଛି • ₹୧୮ / ପ୍ୟାକେଟ୍' : lang === 'हिन्दी' ? '8 स्टॉक में • ₹18 / पत्ता' : '8 in stock • ₹18 / strip'}
                  </div>
                  <a href="tel:+919437267890" style={{ display: 'inline-block', marginTop: '6px', fontSize: '11px', color: '#0284c7', textDecoration: 'none', fontWeight: 700 }}>
                    {lang === 'ଓଡ଼ିଆ' ? '📞 ପ୍ୟାକେଟ୍ ସଂରକ୍ଷଣ କରନ୍ତୁ' : lang === 'हिन्दी' ? '📞 पत्ता रिज़र्व करें' : '📞 Reserve Strip'}
                  </a>
                </div>

                {/* Store C */}
                <div style={{ background: '#ffffff', color: '#0f172a', padding: '12px', borderRadius: '12px', border: '2px solid #fca5a5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px' }}>{lang === 'ଓଡ଼ିଆ' ? 'ଦୋକାନ C' : lang === 'हिन्दी' ? 'स्टोर C' : 'Store C'}</strong>
                    <span style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 800 }}>
                      {lang === 'ଓଡ଼ିଆ' ? '🔴 ଷ୍ଟକ୍ ଶେଷ' : lang === 'हिन्दी' ? '🔴 अनुपलब्ध' : '🔴 OUT OF STOCK'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Chhoriagarh Village Chemist</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Village Chowk • 0.5 {lang === 'ଓଡ଼ିଆ' ? 'କିମି ଦୂର' : lang === 'हिन्दी' ? 'किमी दूर' : 'km away'}</div>
                  <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700, marginTop: '6px' }}>
                    {lang === 'ଓଡ଼ିଆ' ? '୦ ଷ୍ଟକ୍ • ଆସନ୍ତାକାଲି ଆସିବ' : lang === 'हिन्दी' ? '0 स्टॉक • कल रीस्टॉक की संभावना' : '0 in stock • Restock expected tomorrow'}
                  </div>
                  <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                    {lang === 'ଓଡ଼ିଆ' ? 'ଫୋନ୍ ନକରି ଯାଆନ୍ତୁ ନାହିଁ' : lang === 'हिन्दी' ? 'बिना कॉल किए न जाएं' : 'Do not travel without calling'}
                  </span>
                </div>
              </div>
            </div>

            {/* Simple Search Input */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }} />
              <input
                type="text"
                value={medicineSearch}
                onChange={(e) => setMedicineSearch(e.target.value)}
                placeholder={getTranslation(lang, 'searchMedicinePlaceholder')}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Warning Note (Section 16) */}
            <div style={{ background: '#fffbeb', border: '1px solid #fef08a', color: '#92400e', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
              ⚠️ <strong>{lang === 'ଓଡ଼ିଆ' ? 'ସୂଚନା:' : lang === 'हिन्दी' ? 'सूचना:' : 'Notice:'}</strong> {getTranslation(lang, 'stockChangeWarning')}
            </div>

            {/* Medicine Cards */}
            <div style={{ display: 'grid', gap: '10px' }}>
              {filteredMedicines.map((med) => (
                <div
                  key={med.id}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    background: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{med.name}</strong>
                    <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '2px' }}>
                      {med.pharmacyName} • {med.block} ({med.distanceKm} {lang === 'ଓଡ଼ିଆ' ? 'କିମି ଦୂର' : lang === 'हिन्दी' ? 'किमी दूर' : 'km away'})
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      {lang === 'ଓଡ଼ିଆ' ? `ମୂଲ୍ୟ: ${med.unitPrice} • ଶେଷ ଅପଡେଟ୍: ${med.lastUpdated}` : lang === 'हिन्दी' ? `कीमत: ${med.unitPrice} • अंतिम अपडेट: ${med.lastUpdated}` : `Price: ${med.unitPrice} • Last updated: ${med.lastUpdated}`}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      background: med.status === 'AVAILABLE' ? '#f0fdf4' : med.status === 'LIMITED STOCK' ? '#fffbeb' : '#fef2f2',
                      color: med.status === 'AVAILABLE' ? '#166534' : med.status === 'LIMITED STOCK' ? '#92400e' : '#991b1b',
                      border: med.status === 'AVAILABLE' ? '1px solid #bbf7d0' : med.status === 'LIMITED STOCK' ? '1px solid #fef08a' : '1px solid #fecaca',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 800
                    }}>
                      {med.status === 'AVAILABLE' ? (lang === 'ଓଡ଼ିଆ' ? '🟢 ଉପଲବ୍ଧ' : lang === 'हिन्दी' ? '🟢 उपलब्ध' : '🟢 AVAILABLE') : med.status === 'LIMITED STOCK' ? (lang === 'ଓଡ଼ିଆ' ? '🟠 ସୀମିତ' : lang === 'हिन्दी' ? '🟠 सीमित' : '🟠 LIMITED') : (lang === 'ଓଡ଼ିଆ' ? '🔴 ଷ୍ଟକ୍ ଶେଷ' : lang === 'हिन्दी' ? '🔴 अनुपलब्ध' : '🔴 OUT OF STOCK')}
                    </span>

                    <a
                      href={`tel:${med.phone}`}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '12px',
                        color: '#0f172a',
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      {lang === 'ଓଡ଼ିଆ' ? '📞 କଲ୍ କରନ୍ତୁ' : lang === 'हिन्दी' ? '📞 कॉल करें' : '📞 Call Chemist'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. TAB 6: PROFILE & HELP (Prompt Section 17 & 18)         */}
      {/* ======================================================== */}
      {!isSimpleMode && activeTab === 'profile' && (
        <div style={{ display: 'grid', gap: '18px' }}>
          {renderBackButton()}
          {/* Simple Profile Card (Section 17) */}
          <div className="card" style={{ padding: '20px', borderRadius: '16px' }}>
            <h2 style={{ margin: '0 0 14px', fontSize: '20px', color: '#0f172a' }}>
              {lang === 'ଓଡ଼ିଆ' ? 'ମୋର ପ୍ରୋଫାଇଲ୍' : lang === 'हिन्दी' ? 'मेरी प्रोफ़ाइल' : 'My Profile'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {lang === 'ଓଡ଼ିଆ' ? 'ସମ୍ପୂର୍ଣ୍ଣ ନାମ:' : lang === 'हिन्दी' ? 'पूरा नाम:' : 'Full Name:'}
                </span>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{user.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {lang === 'ଓଡ଼ିଆ' ? 'ରୋଗୀ ID:' : lang === 'हिन्दी' ? 'रोगी ID:' : 'Patient ID:'}
                </span>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
                  {user.patientId || patientId}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {lang === 'ଓଡ଼ିଆ' ? 'ମୋବାଇଲ୍ ନମ୍ବର:' : lang === 'हिन्दी' ? 'मोबाइल नंबर:' : 'Mobile Number:'}
                </span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{user.mobile}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {lang === 'ଓଡ଼ିଆ' ? 'ଠିକଣା:' : lang === 'हिन्दी' ? 'स्थान:' : 'Location:'}
                </span>
                <div style={{ fontSize: '14px', color: '#0f172a' }}>
                  {user.location || (lang === 'ଓଡ଼ିଆ' ? 'ଗ୍ରାମ: ଛୋରିଆଗଡ଼, କଳାହାଣ୍ଡି' : lang === 'हिन्दी' ? 'ग्राम: छोरियागढ़, कालाहांडी' : 'Village Chhoriagarh, Kalahandi')}
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                ❤️ {lang === 'ଓଡ଼ିଆ' ? 'ସ୍ୱାସ୍ଥ୍ୟ ସୂଚନା:' : lang === 'हिन्दी' ? 'स्वास्थ्य जानकारी:' : 'Health Information:'}
              </div>
              <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                • {lang === 'ଓଡ଼ିଆ' ? 'ରକ୍ତ ବର୍ଗ:' : lang === 'हिन्दी' ? 'रक्त समूह:' : 'Blood Group:'} <strong>{user.bloodGroup || 'B+'}</strong><br />
                • {lang === 'ଓଡ଼ିଆ' ? 'ଏଲର୍ଜି:' : lang === 'हिन्दी' ? 'एलर्जी:' : 'Allergies:'} <strong>{user.allergies || (lang === 'ଓଡ଼ିଆ' ? 'କୌଣସି ଜଣାଶୁଣା ଏଲର୍ଜି ନାହିଁ' : lang === 'हिन्दी' ? 'कोई ज्ञात दवा एलर्जी नहीं' : 'No known drug allergies')}</strong><br />
                • {lang === 'ଓଡ଼ିଆ' ? 'ଜରୁରୀକାଳୀନ ଯୋଗାଯୋଗ:' : lang === 'हिन्दी' ? 'आपातकालीन संपर्क:' : 'Emergency Contact:'} <strong>{user.emergencyContact || 'Family (+91 94370 12345)'}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsHealthCardOpen(true)}
              >
                <CreditCard size={15} /> {lang === 'ଓଡ଼ିଆ' ? 'ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ' : lang === 'हिन्दी' ? 'डिजिटल स्वास्थ्य कार्ड' : 'Digital Health Card'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsConsentManagerOpen(true)}
              >
                <ShieldCheck size={15} /> {lang === 'ଓଡ଼ିଆ' ? 'ତଥ୍ୟ ଓ ସହମତି' : lang === 'हिन्दी' ? 'डेटा और सहमति' : 'My Data & Consent'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsFacilityDirectoryOpen(true)}
              >
                <MapPin size={15} /> {lang === 'ଓଡ଼ିଆ' ? 'ଡାକ୍ତରଖାନା ଖୋଜନ୍ତୁ' : lang === 'हिन्दी' ? 'अस्पताल खोजें' : 'Find Health Facility'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsPrimaryCareOpen(true)}
              >
                <HeartPulse size={15} /> {lang === 'ଓଡ଼ିଆ' ? 'ଆୟୁଷ୍ମାନ ଆରୋଗ୍ୟ ସେବା' : lang === 'हिन्दी' ? 'आयुष्मान आरोग्य सेवाएं' : 'Ayushman Arogya Services'}
              </button>
            </div>
          </div>

          {/* Prompt Section 18: "NEED HELP?" Large Illustrated Options */}
          <div className="card" style={{ padding: '20px', borderRadius: '16px' }}>
            <h2 style={{ margin: '0 0 6px', fontSize: '18px', color: '#0f172a' }}>
              {getTranslation(lang, 'needHelpTitle')}
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '14px' }}>
              Simple guides to help you use Swasthya Path:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {[
                {
                  title: 'How to use the app',
                  icon: '🎤',
                  desc: 'Tap symptom check, speak your symptoms, or tap picture cards in Odia or Hindi.',
                  steps: [
                    'Tap "Check My Symptoms" on your home screen.',
                    'Tap 🎤 "Tell us by voice" or choose a picture that matches what is bothering you.',
                    'Answer 3 quick questions about duration, severity, and worsening.',
                    'Swasthya Path immediately recommends the right next step.'
                  ]
                },
                {
                  title: 'How to talk to a doctor',
                  icon: '👨‍⚕️',
                  desc: 'Book a free teleconsultation with DHH Bhawanipatna doctors without traveling.',
                  steps: [
                    'Tap "Talk to a Doctor" from your home screen.',
                    'Choose a General Doctor, Child Doctor, or Specialist.',
                    'Pick a convenient time slot and confirm.',
                    'Join the video or audio room when your token is ready.'
                  ]
                },
                {
                  title: 'How appointments work',
                  icon: '📅',
                  desc: 'You receive an easy token number (e.g. A-024) and live queue wait time.',
                  steps: [
                    'Your appointment gives you a digital token number like A-024.',
                    'Your home screen shows your position in the digital queue.',
                    'When the doctor calls, tap "Join Consultation" with 1 tap.',
                    'Prescriptions are saved directly into your offline records.'
                  ]
                },
                {
                  title: 'How to check medicine',
                  icon: '💊',
                  desc: 'Check local village chemist stock before making long journeys.',
                  steps: [
                    'Tap "My Medicines" from the bottom navigation.',
                    'Search for your medicine (e.g. Paracetamol, ORS).',
                    'Look for the green 🟢 AVAILABLE badge.',
                    'Tap "📞 Call Chemist" to confirm stock or reserve your medicine.'
                  ]
                },
                {
                  title: 'When internet is weak',
                  icon: '📶',
                  desc: 'Swasthya Path automatically saves data and works on low-cost phones.',
                  steps: [
                    'If internet speed drops, video reduces resolution automatically.',
                    'Tap "Switch to Audio" to save bandwidth and preserve clear sound.',
                    'All your saved health cards and past records stay available offline.',
                    'You will never see confusing technical error codes.'
                  ]
                },
                {
                  title: 'Emergency help guide',
                  icon: '🆘',
                  desc: 'If anyone in your family has urgent warning signs, get immediate help.',
                  steps: [
                    'Check for signs: severe chest pain, unable to breathe, fainting, or sudden face drooping.',
                    'Tap the big red 🆘 EMERGENCY button on any screen.',
                    'Dial 108 directly for an ambulance or 104 for the Odisha Health Helpline.',
                    'Show your Digital Health Card to the paramedics when they arrive.'
                  ]
                }
              ].map((guide) => (
                <div
                  key={guide.title}
                  onClick={() => setActiveHelpTopic(guide)}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '24px' }}>{guide.icon}</span>
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>{guide.title}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, marginBottom: '8px' }}>
                    {guide.desc}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7' }}>
                    Tap to open guide ➔
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. MOBILE BOTTOM NAVIGATION (Prompt Section 8)            */}
      {/* Only 5 items: Home, Doctor, Records, Medicines, Profile  */}
      {/* ======================================================== */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#ffffff',
          borderTop: '1.5px solid #cbd5e1',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '8px 0',
          zIndex: 800,
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.06)'
        }}
        aria-label="Patient Bottom Navigation"
      >
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: activeTab === 'home' ? '#0284c7' : '#64748b',
            fontSize: '11px',
            fontWeight: activeTab === 'home' ? 800 : 500,
            cursor: 'pointer'
          }}
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('doctor')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: activeTab === 'doctor' ? '#0284c7' : '#64748b',
            fontSize: '11px',
            fontWeight: activeTab === 'doctor' ? 800 : 500,
            cursor: 'pointer'
          }}
        >
          <Stethoscope size={20} />
          <span>Doctor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('records')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: activeTab === 'records' ? '#0284c7' : '#64748b',
            fontSize: '11px',
            fontWeight: activeTab === 'records' ? 800 : 500,
            cursor: 'pointer'
          }}
        >
          <FileText size={20} />
          <span>Records</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('medicines')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: activeTab === 'medicines' ? '#0284c7' : '#64748b',
            fontSize: '11px',
            fontWeight: activeTab === 'medicines' ? 800 : 500,
            cursor: 'pointer'
          }}
        >
          <Pill size={20} />
          <span>Medicines</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: activeTab === 'profile' ? '#0284c7' : '#64748b',
            fontSize: '11px',
            fontWeight: activeTab === 'profile' ? 800 : 500,
            cursor: 'pointer'
          }}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>

      {/* ======================================================== */}
      {/* 10. MODALS & SUB-COMPONENTS                              */}
      {/* ======================================================== */}

      {/* Voice Intake Modal with Confirmation (Prompt Section 6) */}
      <VoiceModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onTranscript={(text) => {
          setSelectedSymptom(text);
          setSelectedSymptomIcon('🎤');
          setSymptomStep(2);
        }}
        lang={lang}
      />

      {/* Video / Audio Consultation Room (Prompt Section 14) */}
      <VideoConsultationRoom
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        doctor={selectedConsultDoctor || primaryDoctor}
        patient={user}
        networkQuality={networkQuality}
        onNetworkChange={onNetworkChange}
        userRole="patient"
        lang={lang}
        onCheckPharmacy={() => {
          setIsVideoCallOpen(false);
          setActiveTab('medicines');
          setMedicineSearch('Paracetamol');
        }}
      />

      {/* Digital Health Card (Prompt Section 17) */}
      <DigitalHealthCardModal
        isOpen={isHealthCardOpen}
        onClose={() => setIsHealthCardOpen(false)}
        user={user}
        onViewFullRecord={() => setActiveTab('records')}
        lang={lang}
      />

      {/* Diagnostic Document Viewer (Prompt Section 15) */}
      <DocumentViewerModal
        isOpen={!!viewingDocument}
        onClose={() => setViewingDocument(null)}
        document={viewingDocument}
        lang={lang}
      />

      {/* E-Prescription Viewer (Prompt Section 15) */}
      <EPrescriptionModal
        isOpen={!!viewingPrescription}
        onClose={() => setViewingPrescription(null)}
        prescription={viewingPrescription}
        mode="view"
        patientName={user.name}
        patientId={patientId}
        lang={lang}
        onCheckStock={(medName) => {
          setActiveTab('medicines');
          setMedicineSearch(medName);
        }}
      />

      {/* Emergency Help Modal (Prompt Section 9) */}
      <EmergencyHelpModal
        isOpen={isEmergencyHelpOpen}
        onClose={() => setIsEmergencyHelpOpen(false)}
        lang={lang}
        patientName={user.name}
        patientId={user.patientId || patientId}
      />

      {/* Facility Directory Modal (Prompt Section 17) */}
      <FacilityDirectoryModal
        isOpen={isFacilityDirectoryOpen}
        onClose={() => setIsFacilityDirectoryOpen(false)}
        lang={lang}
      />

      {/* Consent Management Modal (Prompt Section 17) */}
      <ConsentManagementModal
        isOpen={isConsentManagerOpen}
        onClose={() => setIsConsentManagerOpen(false)}
        patientName={user.name}
        patientId={patientId}
        lang={lang}
      />

      {/* Primary Care & AAM Services Modal (Prompt Section 17) */}
      <PrimaryCareServicesModal
        isOpen={isPrimaryCareOpen}
        onClose={() => setIsPrimaryCareOpen(false)}
        onNavigateToQueue={() => setActiveTab('doctor')}
        lang={lang}
      />

      {/* Doctor Profile Modal (Prompt Section 7 & 14) */}
      {viewingDoctorProfile && (
        <div className="modal-overlay" role="dialog" aria-modal="true" style={{ zIndex: 1100 }}>
          <div className="modal-dialog" style={{ maxWidth: '520px', background: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={(viewingDoctorProfile.avatarUrl && !viewingDoctorProfile.avatarUrl.includes('images.unsplash.com')) ? viewingDoctorProfile.avatarUrl : (viewingDoctorProfile.gender === 'female' ? '/images/female-doctor-avatar.jpg' : '/images/male-doctor-avatar.jpg')}
                    alt={viewingDoctorProfile.name}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0284c7', display: 'block' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = viewingDoctorProfile.gender === 'female' ? '/images/female-doctor-avatar.jpg' : '/images/male-doctor-avatar.jpg';
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      background: viewingDoctorProfile.gender === 'female' ? '#ec4899' : '#0284c7',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      border: '2px solid #ffffff'
                    }}
                    title={viewingDoctorProfile.gender === 'female' ? 'Female Clinician' : 'Male Clinician'}
                  >
                    {viewingDoctorProfile.gender === 'female' ? '♀' : '♂'}
                  </span>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 900 }}>{viewingDoctorProfile.name}</h3>
                    <span title="Verified Clinician" style={{ color: '#0284c7', fontSize: '18px' }}>✓</span>
                    <span
                      style={{
                        background: viewingDoctorProfile.gender === 'female' ? '#fdf2f8' : '#eff6ff',
                        color: viewingDoctorProfile.gender === 'female' ? '#be185d' : '#1d4ed8',
                        border: `1px solid ${viewingDoctorProfile.gender === 'female' ? '#fbcfe8' : '#bfdbfe'}`,
                        padding: '1px 8px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      {viewingDoctorProfile.gender === 'female' ? '👩‍⚕️ Female Clinician' : '👨‍⚕️ Male Clinician'}
                    </span>
                  </div>
                  <div style={{ color: '#0284c7', fontSize: '14px', fontWeight: 700 }}>
                    {viewingDoctorProfile.specialty}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>
                    {viewingDoctorProfile.hospital || viewingDoctorProfile.facility}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingDoctorProfile(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            {/* Clinician Badges & Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Experience & Degrees</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{viewingDoctorProfile.experience || '8+ yrs exp • MBBS, MD'}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>OPD Consultation Fee</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#16a34a' }}>{viewingDoctorProfile.fees || 'Free (Govt Telehealth Initiative)'}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Languages Spoken</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{viewingDoctorProfile.languages.join(', ')}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Current OPD Status</span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: viewingDoctorProfile.available ? '#16a34a' : '#92400e' }}>
                  {viewingDoctorProfile.available ? '🟢 Available Now' : '🟠 Next Slot Scheduled'}
                </div>
              </div>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '12px 14px', marginBottom: '18px' }}>
              <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: 700, marginBottom: '2px' }}>
                Clinical Focus & Teleconsultation Guidelines
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#1e3a8a', lineHeight: 1.5 }}>
                Authorized tele-specialist at District Headquarters Hospital (DHH) Bhawanipatna. Evaluates non-emergency chronic conditions, reviews diagnostic reports, issues digital e-prescriptions, and advises rural CHCs.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  const doc = viewingDoctorProfile;
                  setViewingDoctorProfile(null);
                  handleInitiateBooking(doc);
                }}
                className="btn btn-secondary"
                style={{ padding: '10px 18px', fontSize: '13px', fontWeight: 700, borderRadius: '10px' }}
              >
                Book Appointment Slot
              </button>
              <button
                type="button"
                onClick={() => {
                  const doc = viewingDoctorProfile;
                  setViewingDoctorProfile(null);
                  handleStartConsultation(doc);
                }}
                className="btn btn-primary"
                style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 800, borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Video size={16} />
                <span>Start Consultation Call</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3-Step Appointment Booking Modal (Prompt Section 13 & 24) */}
      {isBookingModalOpen && bookingDoctor && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-dialog" style={{ maxWidth: '540px', background: '#ffffff', padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                {bookingStep === 1 && getTranslation(lang, 'step1Doctor')}
                {bookingStep === 2 && getTranslation(lang, 'step2Time')}
                {bookingStep === 3 && getTranslation(lang, 'step3Confirm')}
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsBookingModalOpen(false);
                  setBookingStep(1);
                }}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            {/* STEP 1: Choose Doctor */}
            {bookingStep === 1 && (
              <div>
                <h3 style={{ margin: '0 0 12px', fontSize: '18px', color: '#0f172a' }}>
                  {lang === 'ଓଡ଼ିଆ' ? 'ଡାକ୍ତର ବାଛନ୍ତୁ:' : lang === 'हिन्दी' ? 'डॉक्टर चुनें:' : 'Choose Doctor:'}
                </h3>
                <div style={{ display: 'grid', gap: '10px', maxHeight: '340px', overflowY: 'auto', marginBottom: '16px' }}>
                  {allDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setBookingDoctor(doc);
                        setBookingStep(2);
                      }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: bookingDoctor.id === doc.id ? '2px solid #0284c7' : '1px solid #e2e8f0',
                        background: bookingDoctor.id === doc.id ? '#f0f9ff' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '15px', color: '#0f172a' }}>{doc.name}</strong>
                        <div style={{ fontSize: '12px', color: '#0284c7' }}>{doc.specialty}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {lang === 'ଓଡ଼ିଆ' ? 'ଭାଷା:' : lang === 'हिन्दी' ? 'भाषा:' : 'Languages:'} {doc.languages.join(', ')}
                        </div>
                      </div>
                      <button type="button" className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                        {lang === 'ଓଡ଼ିଆ' ? 'ବାଛନ୍ତୁ ➔' : lang === 'हिन्दी' ? 'चुनें ➔' : 'Select ➔'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Choose Time */}
            {bookingStep === 2 && (
              <div>
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {lang === 'ଓଡ଼ିଆ' ? 'ମନୋନୀତ ଡାକ୍ତର:' : lang === 'हिन्दी' ? 'चयनित डॉक्टर:' : 'Selected Doctor:'}
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{bookingDoctor.name}</div>
                  <div style={{ fontSize: '12px', color: '#0284c7' }}>{bookingDoctor.specialty} • {bookingDoctor.hospital}</div>
                </div>

                <h3 style={{ margin: '0 0 12px', fontSize: '17px', color: '#0f172a' }}>
                  {lang === 'ଓଡ଼ିଆ' ? 'ପରାମର୍ଶ ସମୟ ବାଛନ୍ତୁ:' : lang === 'हिन्दी' ? 'परामर्श का समय चुनें:' : 'Choose Consultation Time:'}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  {[
                    lang === 'ଓଡ଼ିଆ' ? 'ଆଜି • ୧୦:୩୦ AM' : lang === 'हिन्दी' ? 'आज • 10:30 AM' : 'Today • 10:30 AM',
                    lang === 'ଓଡ଼ିଆ' ? 'ଆଜି • ୧୧:୩୦ AM' : lang === 'हिन्दी' ? 'आज • 11:30 AM' : 'Today • 11:30 AM',
                    lang === 'ଓଡ଼ିଆ' ? 'ଆଜି • ୦୨:୦୦ PM' : lang === 'हिन्दी' ? 'आज • 02:00 PM' : 'Today • 02:00 PM',
                    lang === 'ଓଡ଼ିଆ' ? 'ଆସନ୍ତାକାଲି • ୦୯:୩୦ AM' : lang === 'हिन्दी' ? 'कल • 09:30 AM' : 'Tomorrow • 09:30 AM'
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingSlot(slot)}
                      style={{
                        background: bookingSlot === slot ? '#0284c7' : '#ffffff',
                        color: bookingSlot === slot ? '#ffffff' : '#0f172a',
                        border: bookingSlot === slot ? '2px solid #0284c7' : '1.5px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '14px 10px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setBookingStep(1)}
                  >
                    {lang === 'ଓଡ଼ିଆ' ? 'ଡାକ୍ତର ବଦଳାନ୍ତୁ' : lang === 'हिन्दी' ? 'डॉक्टर बदलें' : 'Change Doctor'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setBookingStep(3)}
                    style={{ fontWeight: 800 }}
                  >
                    {lang === 'ଓଡ଼ିଆ' ? 'ଆଗକୁ: ନିଶ୍ଚିତ କରନ୍ତୁ ➔' : lang === 'हिन्दी' ? 'आगे: पुष्टि करें ➔' : 'Next: Confirm ➔'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Confirm (Section 24) */}
            {bookingStep === 3 && (
              <div>
                <h3 style={{ margin: '0 0 14px', fontSize: '18px', color: '#0f172a' }}>
                  {getTranslation(lang, 'confirmAppointment')}
                </h3>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {lang === 'ଓଡ଼ିଆ' ? 'ଡାକ୍ତର:' : lang === 'हिन्दी' ? 'डॉक्टर:' : 'Doctor:'}
                      </span>
                      <strong style={{ display: 'block', color: '#0f172a' }}>{bookingDoctor.name} ({bookingDoctor.specialty})</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {lang === 'ଓଡ଼ିଆ' ? 'ଡାକ୍ତରଖାନା:' : lang === 'हिन्दी' ? 'अस्पताल:' : 'Hospital:'}
                      </span>
                      <div style={{ color: '#475569' }}>{bookingDoctor.hospital}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {lang === 'ଓଡ଼ିଆ' ? 'ନିର୍ଦ୍ଧାରିତ ସମୟ:' : lang === 'हिन्दी' ? 'निर्धारित समय:' : 'Scheduled Time:'}
                      </span>
                      <strong style={{ display: 'block', color: '#0284c7' }}>{bookingSlot}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {lang === 'ଓଡ଼ିଆ' ? 'ପରାମର୍ଶ ଫି:' : lang === 'हिन्दी' ? 'परामर्श शुल्क:' : 'Consultation Fee:'}
                      </span>
                      <div style={{ color: '#166534', fontWeight: 700 }}>
                        {lang === 'ଓଡ଼ିଆ' ? 'ମାଗଣା (ଓଡ଼ିଶା ଗ୍ରାମୀଣ ଟେଲି-ହେଲ୍ଥ)' : lang === 'हिन्दी' ? 'मुफ्त (ओडिशा ग्रामीण टेलीहेल्थ)' : 'Free (Odisha Rural Telehealth)'}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleConfirmBooking}
                    style={{ flex: 1, padding: '14px', fontSize: '15px', fontWeight: 800 }}
                  >
                    {getTranslation(lang, 'yesContinue')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setBookingStep(2)}
                    style={{ padding: '14px 20px', fontSize: '14px' }}
                  >
                    {getTranslation(lang, 'goBack')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Illustrated Help Modal (Prompt Section 18) */}
      {activeHelpTopic && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-dialog" style={{ maxWidth: '520px', background: '#ffffff', padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '30px' }}>{activeHelpTopic.icon}</span>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{activeHelpTopic.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveHelpTopic(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
              {activeHelpTopic.desc}
            </p>

            <div style={{ display: 'grid', gap: '10px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              {activeHelpTopic.steps.map((st, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#1e293b' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0 }}>
                    {idx + 1}
                  </span>
                  <span style={{ lineHeight: 1.5 }}>{st}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <button
                type="button"
                onClick={() => speakText(`${activeHelpTopic.title}. ${activeHelpTopic.desc}. Steps: ${activeHelpTopic.steps.join('. ')}`)}
                style={{
                  background: '#eff6ff',
                  color: '#0284c7',
                  border: '1.5px solid #bfdbfe',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Volume2 size={16} /> <span>{lang === 'ଓଡ଼ିଆ' ? 'ଗାଇଡ୍ ଶୁଣନ୍ତୁ' : lang === 'हिन्दी' ? 'गाइड सुनें' : 'Listen to Guide'}</span>
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveHelpTopic(null)}
                style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 700 }}
              >
                {lang === 'ଓଡ଼ିଆ' ? 'ବୁଝିଲି, ଧନ୍ୟବାଦ!' : lang === 'हिन्दी' ? 'समझ गया, धन्यवाद!' : 'Got It, Thanks!'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SWASTHYA PATH Care Navigation Flow Modal */}
      <CareNavigationFlowModal
        isOpen={isCareFlowOpen}
        onClose={() => setIsCareFlowOpen(false)}
        onSelectPath={handleFlowSelectPath}
        lang={lang}
      />
    </div>
  );
};
