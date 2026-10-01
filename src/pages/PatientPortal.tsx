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
  Store
} from 'lucide-react';
import {
  DemoUser,
  Language,
  HealthRecord,
  DoctorItem,
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
  const medicines = storage.getMedicines();

  // Search & Filter for medicines
  const [medicineSearch, setMedicineSearch] = useState<string>('');
  const [selectedBlock, setSelectedBlock] = useState<KalahandiBlock>('All Blocks');
  const [medicineHoldNotice, setMedicineHoldNotice] = useState<string>('');

  const isConnected = networkQuality !== 'offline';
  const patientId = user.patientId || 'RHB-OD-KLH-0941';

  // Primary Doctor
  const primaryDoctor: DoctorItem = {
    id: 'doc-01',
    name: 'Dr. Ananya Mishra',
    specialty: 'General Medicine',
    hospital: 'District Headquarters Hospital (DHH) Bhawanipatna',
    nextSlot: 'Today • Available Now',
    languages: ['English', 'ଓଡ଼ିଆ (Odia)', 'हिन्दी (Hindi)'],
    rating: 4.9,
    available: true,
    experience: '9 yrs exp • MBBS, MD',
    fees: 'Free (Govt Telehealth Initiative)',
    estimatedWaitMin: 10
  };

  const paediatricsDoctor: DoctorItem = {
    id: 'doc-03',
    name: 'Dr. S. K. Patnaik',
    specialty: 'Paediatrics (Child Doctor)',
    hospital: 'DHH Bhawanipatna Mother & Child Wing',
    nextSlot: 'Today • Available Now',
    languages: ['ଓଡ଼ିଆ (Odia)', 'English'],
    rating: 4.8,
    available: true,
    experience: '11 yrs exp • MD (Ped)',
    fees: 'Free (Govt Telehealth Initiative)',
    estimatedWaitMin: 15
  };

  const internalMedicineDoctor: DoctorItem = {
    id: 'doc-02',
    name: 'Dr. Demo Specialist',
    specialty: 'Internal Medicine',
    hospital: 'MKCG Medical College / Telehealth Sub-Center',
    nextSlot: 'Today • 10:30 AM',
    languages: ['English', 'ଓଡ଼ିଆ', 'हिन्दी'],
    rating: 4.7,
    available: false,
    experience: '14 yrs exp • MD, FACP',
    fees: 'Free (Govt Telehealth Initiative)',
    estimatedWaitMin: 35
  };

  const allDoctors = [primaryDoctor, paediatricsDoctor, internalMedicineDoctor];

  // Refresh records and tokens when switching tabs
  useEffect(() => {
    setRecords(storage.getRecords());
    setPrescriptions(storage.getPrescriptions());
    setDocuments(storage.getDocuments());
    setToken(storage.getActiveToken());
  }, [activeTab]);

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

  // Launch Video Consultation
  const handleStartConsultation = () => {
    if (!isConnected) {
      alert("You're offline. Live teleconsultation requires an internet connection.");
      return;
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

  // Filtered medicines
  const filteredMedicines = medicines.filter((m) => {
    const matchesBlock = selectedBlock === 'All Blocks' || m.block === selectedBlock;
    const matchesSearch =
      !medicineSearch ||
      m.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
      m.category.toLowerCase().includes(medicineSearch.toLowerCase());
    return matchesBlock && matchesSearch;
  });

  // Doctor filtering
  const filteredDoctors = allDoctors.filter((doc) => {
    if (doctorCategory === 'All') return true;
    if (doctorCategory === 'General' && doc.specialty.includes('General')) return true;
    if (doctorCategory === 'Child' && doc.specialty.includes('Paediatrics')) return true;
    if (doctorCategory === 'Internal' && doc.specialty.includes('Internal')) return true;
    return true;
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
                {getTranslation(lang, 'greetingPatient')}
              </h2>
              <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, fontFamily: 'monospace' }}>
                ID: {patientId}
              </span>
            </div>
            <div style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>
              Village Chhoriagarh • Bhawanipatna, Kalahandi
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
              onClick={handleStartConsultation}
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
      {/* 2. ELDERLY-FRIENDLY "SIMPLE MODE" (Prompt Section 23)    */}
      {/* ======================================================== */}
      {isSimpleMode && (
        <div style={{ display: 'grid', gap: '14px', marginBottom: '20px' }}>
          <div style={{
            background: '#e0f2fe',
            padding: '12px 16px',
            borderRadius: '12px',
            color: '#0369a1',
            fontSize: '13px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span><strong>Simple Large View Active:</strong> Tap any large box below to get help.</span>
            <button
              type="button"
              onClick={() => setIsSimpleMode(false)}
              style={{ background: '#ffffff', border: '1px solid #bae6fd', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#0284c7', cursor: 'pointer', fontWeight: 700 }}
            >
              Standard View
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <button
              type="button"
              onClick={() => {
                setActiveTab('symptom');
                setSymptomStep(1);
              }}
              style={{
                background: '#ffffff',
                border: '3px solid #0284c7',
                borderRadius: '18px',
                padding: '24px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(2, 132, 199, 0.12)'
              }}
            >
              <div style={{ fontSize: '38px', marginBottom: '8px' }}>🩺</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#0284c7' }}>
                I AM NOT FEELING WELL
              </div>
              <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                Check what to do next in simple steps
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('doctor')}
              style={{
                background: '#ffffff',
                border: '3px solid #16a34a',
                borderRadius: '18px',
                padding: '24px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(22, 163, 74, 0.12)'
              }}
            >
              <div style={{ fontSize: '38px', marginBottom: '8px' }}>👨‍⚕️</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#16a34a' }}>
                TALK TO DOCTOR
              </div>
              <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                Dr. Ananya Mishra at DHH Bhawanipatna
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('medicines')}
              style={{
                background: '#ffffff',
                border: '3px solid #0d70d4',
                borderRadius: '18px',
                padding: '24px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(13, 112, 212, 0.12)'
              }}
            >
              <div style={{ fontSize: '38px', marginBottom: '8px' }}>💊</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#0d70d4' }}>
                MEDICINE AVAILABILITY
              </div>
              <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                Check if medicines are in your village store
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsEmergencyHelpOpen(true)}
              style={{
                background: '#fef2f2',
                border: '3px solid #dc2626',
                borderRadius: '18px',
                padding: '24px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(220, 38, 38, 0.15)'
              }}
            >
              <div style={{ fontSize: '38px', marginBottom: '8px' }}>🆘</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#dc2626' }}>
                EMERGENCY (108)
              </div>
              <div style={{ fontSize: '13px', color: '#991b1b', marginTop: '4px' }}>
                Call 108 Ambulance or 104 Health Helpline
              </div>
            </button>
          </div>
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
              {getTranslation(lang, 'greetingPatient')}
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
                onClick={handleStartConsultation}
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
      {activeTab === 'symptom' && (
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
                    {lang === 'ଓଡ଼ିଆ' ? 'ନମସ୍କାର କେଶବ! ଆଜି ଆପଣ କିପରି ଅନୁଭବ କରୁଛନ୍ତି? ଆପଣଙ୍କ ଲକ୍ଷଣ ଚୟନ କରନ୍ତୁ କିମ୍ବା କହିବାକୁ ମାଇକ୍ ବଟନ୍ ଦବାନ୍ତୁ:' : lang === 'हिन्दी' ? 'नमस्ते केशव! आज आप कैसा महसूस कर रहे हैं? कृपया अपने लक्षण चुनें या बोलने के लिए माइक दबाएं:' : 'Namaste Keshab! How are you feeling today? Tap what you are experiencing below, or use voice:'}
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
                >
                  Back
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
                >
                  Back
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

              <div style={{ textAlign: 'center', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setSymptomStep(1)}
                  style={{ background: 'transparent', border: 'none', color: '#0284c7', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                >
                  ↺ Check different symptoms
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. TAB 3: DOCTOR & APPOINTMENT (Prompt Section 12 & 13)  */}
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* 5. TAB 3: DOCTOR & APPOINTMENT (Prompt Section 12 & 13)  */}
      {/* ======================================================== */}
      {activeTab === 'doctor' && (
        <div style={{ display: 'grid', gap: '18px' }}>
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
                  onClick={handleStartConsultation}
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

          {/* Doctor Finder (Prompt Section 12) */}
          <div className="card" style={{ padding: '20px', borderRadius: '16px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '20px', color: '#0f172a' }}>
              {getTranslation(lang, 'findADoctor')}
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '14px' }}>
              {getTranslation(lang, 'whatHelpNeed')}
            </p>

            {/* Category Filters (Prompt Section 12) */}
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

            {/* Doctor Cards (Section 12) */}
            <div style={{ display: 'grid', gap: '14px' }}>
              {filteredDoctors.map((doc) => (
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
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>{doc.name}</h3>
                      <span style={{
                        background: doc.available ? '#f0fdf4' : '#fffbeb',
                        color: doc.available ? '#166534' : '#92400e',
                        border: doc.available ? '1px solid #bbf7d0' : '1px solid #fef08a',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        {doc.available ? '🟢 Available' : '🟠 Next Slot 10:30 AM'}
                      </span>
                    </div>

                    <div style={{ color: '#0284c7', fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
                      {doc.specialty} • {doc.hospital}
                    </div>

                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      Languages: {doc.languages.join(' • ')} • Est. Wait: ~{doc.estimatedWaitMin} mins
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. TAB 4: HEALTH RECORDS (Prompt Section 15)             */}
      {/* ======================================================== */}
      {activeTab === 'records' && (
        <div style={{ display: 'grid', gap: '18px' }}>
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
                <div key={rx.id} style={{ padding: '12px 14px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>{rx.date}</div>
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>Prescription ({rx.prescriptionNumber})</strong>
                    <div style={{ fontSize: '12px', color: '#475569' }}>{rx.diagnosisSummary}</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setViewingPrescription(rx)}
                    style={{ fontSize: '11px', padding: '4px 10px' }}
                  >
                    Open Rx
                  </button>
                </div>
              ))}

              {documents.map((doc) => (
                <div key={doc.id} style={{ padding: '12px 14px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>{doc.date}</div>
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>{doc.title}</strong>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{doc.category}</div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setViewingDocument(doc)}
                    style={{ fontSize: '11px', padding: '4px 10px' }}
                  >
                    View Report
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. TAB 5: MEDICINE AVAILABILITY (Prompt Section 16)      */}
      {/* ======================================================== */}
      {activeTab === 'medicines' && (
        <div style={{ display: 'grid', gap: '18px' }}>
          <div className="card" style={{ padding: '20px', borderRadius: '16px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '20px', color: '#0f172a' }}>
              {getTranslation(lang, 'whichMedicineCheck')}
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '14px' }}>
              Check if medicines are available locally before traveling to town.
            </p>

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
                    <strong style={{ fontSize: '15px' }}>Pharmacy Availability: Paracetamol 500mg</strong>
                    <div style={{ fontSize: '11px', color: '#93c5fd' }}>
                      Real-time inventory comparison across Kalahandi chemists • Eliminates unnecessary 20km travel
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
                  🧭 Care Flow
                </button>
              </div>

              {/* 3-Store Side-by-Side Comparison */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {/* Store A */}
                <div style={{ background: '#ffffff', color: '#0f172a', padding: '12px', borderRadius: '12px', border: '2px solid #86efac' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px' }}>Store A</strong>
                    <span style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 800 }}>
                      🟢 AVAILABLE
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Maa Manikeswari Jan Aushadhi</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Bhawanipatna • 1.2 km away</div>
                  <div style={{ fontSize: '11px', color: '#166534', fontWeight: 700, marginTop: '6px' }}>240 in stock • ₹18 / strip</div>
                  <a href="tel:+919437012345" style={{ display: 'inline-block', marginTop: '6px', fontSize: '11px', color: '#0284c7', textDecoration: 'none', fontWeight: 700 }}>
                    📞 Call Chemist
                  </a>
                </div>

                {/* Store B */}
                <div style={{ background: '#ffffff', color: '#0f172a', padding: '12px', borderRadius: '12px', border: '2px solid #fde047' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px' }}>Store B</strong>
                    <span style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fef08a', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 800 }}>
                      🟠 LIMITED
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Junagarh Gramin Pharmacy</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Junagarh Market • 18.5 km away</div>
                  <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 700, marginTop: '6px' }}>8 in stock • ₹18 / strip</div>
                  <a href="tel:+919437267890" style={{ display: 'inline-block', marginTop: '6px', fontSize: '11px', color: '#0284c7', textDecoration: 'none', fontWeight: 700 }}>
                    📞 Reserve Strip
                  </a>
                </div>

                {/* Store C */}
                <div style={{ background: '#ffffff', color: '#0f172a', padding: '12px', borderRadius: '12px', border: '2px solid #fca5a5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px' }}>Store C</strong>
                    <span style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 800 }}>
                      🔴 OUT OF STOCK
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Chhoriagarh Village Chemist</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Village Chowk • 0.5 km away</div>
                  <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700, marginTop: '6px' }}>0 in stock • Restock expected tomorrow</div>
                  <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                    Do not travel without calling
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
              ⚠️ <strong>Notice:</strong> {getTranslation(lang, 'stockChangeWarning')}
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
                      {med.pharmacyName} • {med.block} ({med.distanceKm} km away)
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      Price: {med.unitPrice} • Last updated: {med.lastUpdated}
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
                      {med.status === 'AVAILABLE' ? '🟢 AVAILABLE' : med.status === 'LIMITED STOCK' ? '🟠 LIMITED' : '🔴 OUT OF STOCK'}
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
                      📞 Call Chemist
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
      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gap: '18px' }}>
          {/* Simple Profile Card (Section 17) */}
          <div className="card" style={{ padding: '20px', borderRadius: '16px' }}>
            <h2 style={{ margin: '0 0 14px', fontSize: '20px', color: '#0f172a' }}>
              My Profile
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Full Name:</span>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{user.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Patient ID:</span>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>{patientId}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Mobile Number:</span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{user.mobile}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Location:</span>
                <div style={{ fontSize: '14px', color: '#0f172a' }}>Village Chhoriagarh, Kalahandi</div>
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                ❤️ Health Information:
              </div>
              <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                • Blood Group: <strong>B+</strong><br />
                • Allergies: <strong>No known drug allergies</strong><br />
                • Emergency Contact: <strong>Sunita Das (+91 94370 12345)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsHealthCardOpen(true)}
              >
                <CreditCard size={15} /> Digital Health Card
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsConsentManagerOpen(true)}
              >
                <ShieldCheck size={15} /> My Data & Consent
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsFacilityDirectoryOpen(true)}
              >
                <MapPin size={15} /> Find Health Facility
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsPrimaryCareOpen(true)}
              >
                <HeartPulse size={15} /> Ayushman Arogya Services
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
        doctor={primaryDoctor}
        patient={user}
        networkQuality={networkQuality}
        onNetworkChange={onNetworkChange}
        userRole="patient"
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
      />

      {/* Diagnostic Document Viewer (Prompt Section 15) */}
      <DocumentViewerModal
        isOpen={!!viewingDocument}
        onClose={() => setViewingDocument(null)}
        document={viewingDocument}
      />

      {/* E-Prescription Viewer (Prompt Section 15) */}
      <EPrescriptionModal
        isOpen={!!viewingPrescription}
        onClose={() => setViewingPrescription(null)}
        prescription={viewingPrescription}
        mode="view"
        patientName={user.name}
        patientId={patientId}
        onCheckStock={(medName) => {
          setActiveTab('medicines');
          setMedicineSearch(medName);
        }}
      />

      {/* Emergency Help Modal (Prompt Section 9) */}
      <EmergencyHelpModal
        isOpen={isEmergencyHelpOpen}
        onClose={() => setIsEmergencyHelpOpen(false)}
      />

      {/* Facility Directory Modal (Prompt Section 17) */}
      <FacilityDirectoryModal
        isOpen={isFacilityDirectoryOpen}
        onClose={() => setIsFacilityDirectoryOpen(false)}
      />

      {/* Consent Management Modal (Prompt Section 17) */}
      <ConsentManagementModal
        isOpen={isConsentManagerOpen}
        onClose={() => setIsConsentManagerOpen(false)}
        patientName={user.name}
        patientId={patientId}
      />

      {/* Primary Care & AAM Services Modal (Prompt Section 17) */}
      <PrimaryCareServicesModal
        isOpen={isPrimaryCareOpen}
        onClose={() => setIsPrimaryCareOpen(false)}
        onNavigateToQueue={() => setActiveTab('doctor')}
      />

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
                  Choose Doctor:
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
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Languages: {doc.languages.join(', ')}</div>
                      </div>
                      <button type="button" className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                        Select ➔
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
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Selected Doctor:</span>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{bookingDoctor.name}</div>
                  <div style={{ fontSize: '12px', color: '#0284c7' }}>{bookingDoctor.specialty} • {bookingDoctor.hospital}</div>
                </div>

                <h3 style={{ margin: '0 0 12px', fontSize: '17px', color: '#0f172a' }}>
                  Choose Consultation Time:
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  {[
                    'Today • 10:30 AM',
                    'Today • 11:30 AM',
                    'Today • 02:00 PM',
                    'Tomorrow • 09:30 AM'
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
                    Change Doctor
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setBookingStep(3)}
                    style={{ fontWeight: 800 }}
                  >
                    Next: Confirm ➔
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
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Doctor:</span>
                      <strong style={{ display: 'block', color: '#0f172a' }}>{bookingDoctor.name} ({bookingDoctor.specialty})</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Hospital:</span>
                      <div style={{ color: '#475569' }}>{bookingDoctor.hospital}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Scheduled Time:</span>
                      <strong style={{ display: 'block', color: '#0284c7' }}>{bookingSlot}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Consultation Fee:</span>
                      <div style={{ color: '#166534', fontWeight: 700 }}>Free (Odisha Rural Telehealth)</div>
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
                <Volume2 size={16} /> <span>Listen to Guide</span>
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveHelpTopic(null)}
                style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 700 }}
              >
                Got It, Thanks!
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
