import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Video,
  FileText,
  AlertOctagon,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  User,
  History,
  Pill,
  UserPlus,
  Eye,
  Activity,
  Plus,
  Printer,
  Share2,
  Save,
  MapPin,
  ClipboardList,
  Edit3,
  FlaskConical
} from 'lucide-react';
import {
  DemoUser,
  Language,
  TriageQueueItem,
  AppointmentItem,
  NetworkQuality,
  DoctorItem,
  DoctorLeave,
  FullPrescription,
  DiagnosticDocument,
  PhysiologicalVitals,
  SpecialistRequest
} from '../types';
import { storage } from '../utils/storage';
import { getTranslation } from '../utils/translations';
import { VideoConsultationRoom } from '../components/VideoConsultationRoom';
import { DocumentViewerModal } from '../components/DocumentViewerModal';
import { EPrescriptionModal } from '../components/EPrescriptionModal';
import { SpecialistRequestModal } from '../components/SpecialistRequestModal';
import { CarePlanModal } from '../components/CarePlanModal';

interface DoctorPortalProps {
  user: DemoUser;
  networkQuality: NetworkQuality;
  onNetworkChange?: (quality: NetworkQuality) => void;
  lang: Language;
  onSelectLang?: (lang: Language) => void;
}

const DOCTOR_I18N = {
  English: {
    specialistBtn: 'Request Specialist Opinion',
    createRxBtn: 'Create E-Prescription',
    soleAuth: 'Doctor retains sole diagnostic authority',
    tabHome: 'Home',
    tabQueue: (count: number) => `Triage Queue (${count})`,
    tabEval: 'Patient Evaluation & Vitals',
    tabSchedule: (count: number) => `Appointments (${count})`,
    tabRx: (count: number) => `Prescriptions (${count})`,
    tabSpecialist: (count: number) => `Specialist Requests (${count})`,
    tabHistory: 'Consultation History',
    heroTitle: 'Clinician Workspace & Tele-Triage Hub',
    heroSubtitle: 'Review AI-assisted intake summaries, verify clinical safety flags, conduct low-bandwidth teleconsultations, and make authoritative medical care decisions.',
    openQueueBtn: 'Open Triage Queue',
    startTeleconsultBtn: 'Start Teleconsultation',
    issueRxBtn: 'Issue E-Prescription',
    requestSpecialistBtn: 'Request Specialist Opinion',
    doctorCarePlanBtn: 'Doctor Care Plan',
    // Mobile Nav
    navHome: 'Dashboard',
    navQueue: 'Queue',
    navPatients: 'Patients',
    navConsult: 'Consult',
    navSpecialist: 'Specialist'
  },
  'ଓଡ଼ିଆ': {
    specialistBtn: 'ବିଶେଷଜ୍ଞ ମତାମତ ମାଗନ୍ତୁ',
    createRxBtn: 'ଇ-ପ୍ରେସକ୍ରିପସନ୍ ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
    soleAuth: 'କେବଳ ଡାକ୍ତରଙ୍କର ହିଁ ଚିକିତ୍ସା ନିଷ୍ପତ୍ତି ଅଧିକାର ଅଛି',
    tabHome: 'ଡ୍ୟାସବୋର୍ଡ',
    tabQueue: (count: number) => `ଟ୍ରାଇଏଜ୍ କତାର (${count})`,
    tabEval: 'ରୋଗୀ ମୂଲ୍ୟାଙ୍କନ ଓ ଭାଇଟାଲ୍ସ',
    tabSchedule: (count: number) => `ଅପଏଣ୍ଟମେଣ୍ଟ (${count})`,
    tabRx: (count: number) => `ପ୍ରେସକ୍ରିପସନ୍ (${count})`,
    tabSpecialist: (count: number) => `ବିଶେଷଜ୍ଞ ଅନୁରୋଧ (${count})`,
    tabHistory: 'ପରାମର୍ଶ ଇତିହାସ',
    heroTitle: 'ଚିକିତ୍ସକ କାର୍ଯ୍ୟକ୍ଷେତ୍ର ଓ ଟେଲି-ଟ୍ରାଇଏଜ୍ କେନ୍ଦ୍ର',
    heroSubtitle: 'AI-ସହାୟକ ଲକ୍ଷଣ ସାରାଂଶ ସମୀକ୍ଷା କରନ୍ତୁ, ନିରାପତ୍ତା ଯାଞ୍ଚ କରନ୍ତୁ, ସ୍ୱଳ୍ପ ଡାଟାରେ ଟେଲିକନସଲ୍ଟେସନ୍ କରନ୍ତୁ ଏବଂ ଅନ୍ତିମ ଚିକିତ୍ସା ନିଷ୍ପତ୍ତି ନିଅନ୍ତୁ।',
    openQueueBtn: 'ଟ୍ରାଇଏଜ୍ କତାର ଖୋଲନ୍ତୁ',
    startTeleconsultBtn: 'ଟେଲିକନସଲ୍ଟେସନ୍ ଆରମ୍ଭ କରନ୍ତୁ',
    issueRxBtn: 'ପ୍ରେସକ୍ରିପସନ୍ ଦିଅନ୍ତୁ',
    requestSpecialistBtn: 'ବିଶେଷଜ୍ଞ ମତାମତ ମାଗନ୍ତୁ',
    doctorCarePlanBtn: 'ଚିକିତ୍ସା ଯତ୍ନ ଯୋଜନା',
    navHome: 'ଡ୍ୟାସବୋର୍ଡ',
    navQueue: 'କତାର',
    navPatients: 'ରୋଗୀ',
    navConsult: 'ପରାମର୍ଶ',
    navSpecialist: 'ବିଶେଷଜ୍ଞ'
  },
  'हिन्दी': {
    specialistBtn: 'विशेषज्ञ परामर्श का अनुरोध करें',
    createRxBtn: 'ई-प्रिस्क्रिप्शन बनाएं',
    soleAuth: 'केवल चिकित्सक के पास नैदानिक निर्णय का अधिकार है',
    tabHome: 'डैशबोर्ड',
    tabQueue: (count: number) => `ट्राइएज कतार (${count})`,
    tabEval: 'रोगी मूल्यांकन एवं वाइटल्स',
    tabSchedule: (count: number) => `अपॉइंटमेंट्स (${count})`,
    tabRx: (count: number) => `प्रिस्क्रिप्शन (${count})`,
    tabSpecialist: (count: number) => `विशेषज्ञ अनुरोध (${count})`,
    tabHistory: 'परामर्श इतिहास',
    heroTitle: 'चिकित्सक कार्यस्थल एवं टेली-ट्राइएज हब',
    heroSubtitle: 'एआई-सहायक लक्षण सारांश की समीक्षा करें, सुरक्षा अलर्ट जांचें, कम बैंडविड्थ पर टेलीपरामर्श करें और आधिकारिक चिकित्सा निर्णय लें।',
    openQueueBtn: 'ट्राइएज कतार खोलें',
    startTeleconsultBtn: 'टेलीपरामर्श प्रारंभ करें',
    issueRxBtn: 'प्रिस्क्रिप्शन जारी करें',
    requestSpecialistBtn: 'विशेषज्ञ राय मांगें',
    doctorCarePlanBtn: 'डॉक्टर केयर प्लान',
    navHome: 'डैशबोर्ड',
    navQueue: 'कतार',
    navPatients: 'रोगी',
    navConsult: 'परामर्श',
    navSpecialist: 'विशेषज्ञ'
  }
};

export const DoctorPortal: React.FC<DoctorPortalProps> = ({
  user,
  networkQuality,
  onNetworkChange,
  lang,
  onSelectLang
}) => {
  // Clinician workspace is strictly conducted in standard clinical English
  const t = DOCTOR_I18N.English;
  const [activeTab, setActiveTab] = useState<'home' | 'queue' | 'evaluation' | 'schedule' | 'prescriptions' | 'specialist' | 'history' | 'leave'>('home');
  const [tabHistory, setTabHistory] = useState<('home' | 'queue' | 'evaluation' | 'schedule' | 'prescriptions' | 'specialist' | 'history' | 'leave')[]>(['home']);

  const navigateToTab = (tab: 'home' | 'queue' | 'evaluation' | 'schedule' | 'prescriptions' | 'specialist' | 'history' | 'leave') => {
    setTabHistory(prev => (prev[prev.length - 1] === tab ? prev : [...prev, tab]));
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (tabHistory.length > 1) {
      const nextHist = [...tabHistory];
      nextHist.pop();
      const prev = nextHist[nextHist.length - 1];
      setTabHistory(nextHist);
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
          {customLabel || '← Back to Previous Page'}
        </span>
      </button>

      {activeTab === 'evaluation' && (
        <button
          type="button"
          onClick={() => navigateToTab('queue')}
          className="btn btn-ghost-light"
          style={{ fontSize: '13px', color: '#0284c7' }}
        >
          Return to Triage Queue
        </button>
      )}

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
          <span>Back to Dashboard</span>
        </button>
      )}
    </div>
  );

  const [selectedQueueItem, setSelectedQueueItem] = useState<TriageQueueItem | null>(null);
  const [doctorActionNote, setDoctorActionNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

  // Modals
  const [viewingDocument, setViewingDocument] = useState<DiagnosticDocument | null>(null);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [rxModalMode, setRxModalMode] = useState<'view' | 'create' | 'edit'>('create');
  const [activeRxForView, setActiveRxForView] = useState<FullPrescription | null>(null);
  const [isSpecialistModalOpen, setIsSpecialistModalOpen] = useState(false);
  const [isCarePlanModalOpen, setIsCarePlanModalOpen] = useState(false);

  // Storage states
  const [queue, setQueue] = useState<TriageQueueItem[]>(storage.getTriageQueue());
  const [appointments, setAppointments] = useState<AppointmentItem[]>(storage.getAppointments());
  const [records, setRecords] = useState(storage.getRecords());
  const [prescriptions, setPrescriptions] = useState<FullPrescription[]>(storage.getPrescriptions());
  const [documents, setDocuments] = useState<DiagnosticDocument[]>(storage.getDocuments());
  const [vitals, setVitals] = useState<PhysiologicalVitals>(storage.getVitals());
  const [specialistRequests, setSpecialistRequests] = useState<SpecialistRequest[]>(storage.getSpecialistRequests());
  const [doctorLeaves, setDoctorLeaves] = useState<DoctorLeave[]>(storage.getDoctorLeaves());
  const [leaveStart, setLeaveStart] = useState('2026-10-15');
  const [leaveEnd, setLeaveEnd] = useState('2026-10-22');
  const [leaveReason, setLeaveReason] = useState('Academic Training & Rural Outreach Duty');
  const [replacementDoctor, setReplacementDoctor] = useState('Dr. S. K. Patnaik');
  const [leaveNotice, setLeaveNotice] = useState('');
  const [queuePriorityFilter, setQueuePriorityFilter] = useState<'all' | 'emergency' | 'high' | 'routine'>('all');
  const medicines = storage.getMedicines();

  useEffect(() => {
    setQueue(storage.getTriageQueue());
    setAppointments(storage.getAppointments());
    setPrescriptions(storage.getPrescriptions());
    setDocuments(storage.getDocuments());
    setVitals(storage.getVitals());
    setSpecialistRequests(storage.getSpecialistRequests());
    setDoctorLeaves(storage.getDoctorLeaves());
  }, [activeTab]);

  const handleSaveLeave = () => {
    storage.saveDoctorLeave({
      doctorId: 'doc-01',
      doctorName: user.name,
      startDate: leaveStart,
      endDate: leaveEnd,
      reason: leaveReason,
      replacementDoctor: replacementDoctor,
      status: 'Scheduled'
    });
    setDoctorLeaves(storage.getDoctorLeaves());
    setLeaveNotice('Scheduled leave recorded! Alternative doctor routing activated for patients.');
    setTimeout(() => setLeaveNotice(''), 3500);
  };

  const handleOpenReview = (item: TriageQueueItem) => {
    setSelectedQueueItem(item);
    setDoctorActionNote(item.doctorNotes || '');
    setActionSuccess('');
    navigateToTab('evaluation');
    storage.addAuditLog(`Doctor opened patient record (${item.patientName})`, user.name);
  };

  const handleDecision = (decisionStatus: 'reviewed' | 'escalated' | 'completed') => {
    if (!selectedQueueItem) return;

    storage.updateTriageStatus(selectedQueueItem.id, decisionStatus, doctorActionNote);

    // Save consultation record
    storage.saveRecord({
      patientId: selectedQueueItem.patientId || 'RHB-OD-KLH-0941',
      type: 'consultation',
      doctorName: user.name,
      notes: `Clinician Review by ${user.name}: Marked as ${decisionStatus.toUpperCase()}. Clinical note: ${
        doctorActionNote || 'Patient triaged according to standard clinical protocol.'
      }`,
      pathway: decisionStatus === 'escalated' ? 'urgent physical care' : 'clinician consultation',
      urgency: decisionStatus === 'escalated' ? 'urgent' : 'routine',
      synced: networkQuality !== 'offline'
    });

    storage.addAuditLog(`Clinician decision recorded: ${decisionStatus.toUpperCase()} for ${selectedQueueItem.patientName}`, user.name);

    setActionSuccess(`Decision recorded! Patient status updated to ${decisionStatus.toUpperCase()}.`);
    setTimeout(() => {
      setActionSuccess('');
      navigateToTab('queue');
    }, 1500);
  };

  const mockDoctorItem: DoctorItem = {
    id: 'doc-01',
    name: user.name,
    specialty: 'General Medicine & Tele-Triage',
    hospital: user.location,
    nextSlot: 'Now',
    languages: ['Odia', 'Hindi', 'English'],
    rating: 4.9,
    available: true,
    experience: '9 yrs',
    fees: 'Govt Free Service'
  };

  const mockPatient: DemoUser = {
    name: selectedQueueItem ? selectedQueueItem.patientName : 'Keshab Rout',
    email: 'patient@swasthyapath.demo',
    mobile: '+91 90000 10001',
    role: 'patient',
    portalTitle: 'Patient Portal',
    badge: 'Rural Citizen • Kalahandi',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    location: 'Kalahandi, Odisha',
    patientId: selectedQueueItem?.patientId || 'RHB-OD-KLH-0941',
    age: selectedQueueItem?.age || 26,
    gender: selectedQueueItem?.gender || 'Male',
    bloodGroup: 'B+',
    allergies: 'No known drug allergies'
  };

  const isFemaleDoc = user.gender === 'female' || (!user.gender && /ananya|meenakshi|subhashree|mishra|sahu|dash/i.test(user.name));
  const docAvatar = (user.avatar && !user.avatar.includes('images.unsplash.com'))
    ? user.avatar
    : (isFemaleDoc ? '/images/female-doctor-avatar.jpg' : '/images/male-doctor-avatar.jpg');

  return (
    <div style={{ paddingBottom: '70px' }}>
      {/* Clinician Profile Bar */}
      <div className="user-bar" style={{ borderRadius: '14px', marginBottom: '18px' }}>
        <div className="user-profile">
          <div style={{ position: 'relative' }}>
            <img
              src={docAvatar}
              alt={user.name}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2.5px solid #0284c7',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
                display: 'block'
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = isFemaleDoc ? '/images/female-doctor-avatar.jpg' : '/images/male-doctor-avatar.jpg';
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                background: isFemaleDoc ? '#ec4899' : '#0284c7',
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
              title={isFemaleDoc ? 'Female Clinician' : 'Male Clinician'}
            >
              {isFemaleDoc ? '♀' : '♂'}
            </span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>{user.name}</div>
              <span style={{
                background: isFemaleDoc ? '#fdf2f8' : '#eff6ff',
                color: isFemaleDoc ? '#be185d' : '#1d4ed8',
                border: `1px solid ${isFemaleDoc ? '#fbcfe8' : '#bfdbfe'}`,
                padding: '1px 8px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                {isFemaleDoc ? '👩‍⚕️ Female Medical Officer' : '👨‍⚕️ Male Medical Officer'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              {user.healthFacility || user.location || 'DHH Bhawanipatna'} (Telehealth Unit)
            </div>
            <span className="user-badge" style={{ background: '#ecfdf3', color: '#027a48' }}>
              {user.specialty || 'Licensed Medical Officer'} • Reg: {user.registrationNumber || 'OSMC-OD-8492'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Clinical Workspace Language Standard */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '4px 10px', borderRadius: '999px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857' }}>
              English (Clinical Standard)
            </span>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsSpecialistModalOpen(true)}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <UserPlus size={14} /> {t.specialistBtn}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setRxModalMode('create');
              setIsRxModalOpen(true);
            }}
            style={{ fontSize: '12px', padding: '6px 12px', fontWeight: 700 }}
          >
            <Plus size={14} /> {t.createRxBtn}
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#0369a1',
              background: '#e0f2fe',
              padding: '6px 12px',
              borderRadius: '999px',
              fontWeight: 600
            }}
          >
            <ShieldCheck size={14} />
            <span>{t.soleAuth}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <nav className="tabs-scroll-wrap" aria-label="Doctor navigation">
        <button
          className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => navigateToTab('home')}
        >
          {t.tabHome}
        </button>
        <button
          className={`tab-btn ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => navigateToTab('queue')}
        >
          {t.tabQueue(queue.filter((q) => q.status === 'pending' || q.status === 'escalated').length)}
        </button>
        <button
          className={`tab-btn ${activeTab === 'evaluation' ? 'active' : ''}`}
          onClick={() => navigateToTab('evaluation')}
        >
          {t.tabEval}
        </button>
        <button
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => navigateToTab('schedule')}
        >
          {t.tabSchedule(appointments.length)}
        </button>
        <button
          className={`tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`}
          onClick={() => navigateToTab('prescriptions')}
        >
          {t.tabRx(prescriptions.length)}
        </button>
        <button
          className={`tab-btn ${activeTab === 'specialist' ? 'active' : ''}`}
          onClick={() => navigateToTab('specialist')}
        >
          {t.tabSpecialist(specialistRequests.length)}
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => navigateToTab('history')}
        >
          {t.tabHistory}
        </button>
        <button
          className={`tab-btn ${activeTab === 'leave' ? 'active' : ''}`}
          onClick={() => navigateToTab('leave')}
        >
          {`Scheduled Leave (${doctorLeaves.length})`}
        </button>
      </nav>

      {/* ======================================================== */}
      {/* TAB 1: CLINICIAN DASHBOARD & TODAY'S OVERVIEW (Section 20) */}
      {/* ======================================================== */}
      {activeTab === 'home' && (
        <div>
          <div className="hero-card" style={{ borderRadius: '16px', marginBottom: '20px' }}>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroSubtitle}</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => navigateToTab('queue')}
              >
                <Stethoscope size={16} />
                <span>{t.openQueueBtn}</span>
              </button>
              <button
                className="btn btn-ghost-light"
                onClick={() => setIsVideoCallOpen(true)}
              >
                <Video size={16} />
                <span>{t.startTeleconsultBtn}</span>
              </button>
              <button
                className="btn btn-ghost-light"
                onClick={() => {
                  setRxModalMode('create');
                  setIsRxModalOpen(true);
                }}
              >
                <Pill size={16} />
                <span>{t.issueRxBtn}</span>
              </button>
              <button
                className="btn btn-ghost-light"
                onClick={() => setIsSpecialistModalOpen(true)}
              >
                <UserPlus size={16} />
                <span>{t.requestSpecialistBtn}</span>
              </button>
              <button
                className="btn btn-ghost-light"
                onClick={() => setIsCarePlanModalOpen(true)}
              >
                <ClipboardList size={16} />
                <span>{t.doctorCarePlanBtn}</span>
              </button>
            </div>
          </div>

          {/* Prompt Section 20 Exact Required KPIs */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--navy-mid)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
              TODAY'S CLINICAL SUMMARY (District Hospital Kalahandi)
            </h3>
            <div className="kpis-grid">
              <div className="kpi-card">
                <span className="kpi-label">Patients Waiting</span>
                <div className="kpi-val" style={{ color: '#0284c7' }}>4</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Active in triage queue
                </span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Urgent Flags</span>
                <div className="kpi-val" style={{ color: '#b42318' }}>1</div>
                <span style={{ fontSize: '12px', color: '#b42318' }}>
                  Critical CHC escalation
                </span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Appointments</span>
                <div className="kpi-val" style={{ color: '#0d70d4' }}>6</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Telehealth scheduled
                </span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Completed</span>
                <div className="kpi-val" style={{ color: '#027a48' }}>3</div>
                <span style={{ fontSize: '12px', color: '#027a48' }}>
                  Consultations finished
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: TRIAGE QUEUE (Section 21) */}
      {/* ======================================================== */}
      {activeTab === 'queue' && (
        <div>
          {renderBackButton()}
          <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2>AI-Assisted Triage Queue</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                AI structures intake and detects safety warning signs. The doctor reviews each case and holds ultimate decision authority.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="badge badge-red">🚨 1 Emergency / Warning</span>
              <span className="badge badge-orange">⚠️ {queue.filter(q => q.urgency === 'urgent').length} High Priority</span>
              <span className="badge badge-blue">🟢 {queue.filter(q => q.urgency === 'routine').length} Routine Review</span>
            </div>
          </div>

          {/* Priority Queue Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Filter Queue:</span>
            <button
              type="button"
              onClick={() => setQueuePriorityFilter('all')}
              className={`btn ${queuePriorityFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '20px' }}
            >
              All Patients ({queue.length})
            </button>
            <button
              type="button"
              onClick={() => setQueuePriorityFilter('emergency')}
              className={`btn ${queuePriorityFilter === 'emergency' ? 'btn-danger' : 'btn-secondary'}`}
              style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '20px' }}
            >
              🚨 Emergency & Warning Signs ({queue.filter(q => q.urgency === 'emergency' || (q.warningSign && q.warningSign !== 'None' && q.warningSign !== 'no' && q.warningSign !== 'None selected')).length})
            </button>
            <button
              type="button"
              onClick={() => setQueuePriorityFilter('high')}
              className={`btn ${queuePriorityFilter === 'high' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '20px', background: queuePriorityFilter === 'high' ? '#b45309' : undefined, borderColor: queuePriorityFilter === 'high' ? '#b45309' : undefined }}
            >
              ⚠️ High Priority ({queue.filter(q => q.urgency === 'urgent').length})
            </button>
            <button
              type="button"
              onClick={() => setQueuePriorityFilter('routine')}
              className={`btn ${queuePriorityFilter === 'routine' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '20px', background: queuePriorityFilter === 'routine' ? '#047857' : undefined, borderColor: queuePriorityFilter === 'routine' ? '#047857' : undefined }}
            >
              🟢 Routine ({queue.filter(q => q.urgency === 'routine').length})
            </button>
          </div>

          <div className="data-list">
            {queue
              .filter(item => {
                if (queuePriorityFilter === 'all') return true;
                if (queuePriorityFilter === 'emergency') {
                  return item.urgency === 'emergency' || (item.warningSign && item.warningSign !== 'None' && item.warningSign !== 'no' && item.warningSign !== 'None selected');
                }
                if (queuePriorityFilter === 'high') {
                  return item.urgency === 'urgent';
                }
                if (queuePriorityFilter === 'routine') {
                  return item.urgency === 'routine';
                }
                return true;
              })
              .map((item) => {
                const isEmergency = item.urgency === 'emergency' || (item.warningSign && item.warningSign !== 'None' && item.warningSign !== 'no' && item.warningSign !== 'None selected');
                const isHigh = item.urgency === 'urgent';

                return (
                  <div
                    key={item.id}
                    className="data-item"
                    style={{
                      borderLeft: isEmergency ? '5px solid #b42318' : isHigh ? '5px solid #d97706' : '1px solid var(--line)',
                      background: isEmergency ? '#fffbfa' : isHigh ? '#fffbeb' : '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1 }}>
                      <img
                        src="/images/patient-feed.jpg"
                        alt={item.patientName}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: isEmergency ? '2px solid #b42318' : '2px solid #0284c7',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '16px' }}>{item.patientName}</strong>
                          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#0284c7', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>
                            {item.patientId || 'RHB-OD-KLH-0941'}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                            Age: {item.age} yrs • {item.gender} • {item.village}
                          </span>
                          <span className="badge badge-gray">Waiting: {item.waitingTimeMin} min</span>
                        </div>

                        <div style={{ fontSize: '14px', color: 'var(--ink)', marginBottom: '4px' }}>
                          <strong>Reported Complaint:</strong> {item.symptoms} ({item.duration})
                        </div>

                        {item.warningSign !== 'None' && item.warningSign !== 'no' && item.warningSign !== 'None selected' && (
                          <div style={{ color: '#b42318', fontSize: '13px', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <AlertOctagon size={15} />
                            <span>Warning Sign: {item.warningSign}</span>
                          </div>
                        )}

                        <div style={{ fontSize: '12px', color: '#0369a1', background: '#f0f9ff', padding: '8px 12px', borderRadius: '8px', marginTop: '6px', border: '1px solid #bae6fd' }}>
                          <strong>AI-ASSISTED PRELIMINARY SUMMARY:</strong> {item.aiSummary}
                          <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>
                            * Doctor must verify before making a clinical decision.
                          </div>
                        </div>

                        {item.doctorNotes && (
                          <div style={{ fontSize: '12px', color: '#059669', marginTop: '6px', fontWeight: 600 }}>
                            ✓ Saved Doctor Assessment: {item.doctorNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span
                        className={`badge ${
                          isEmergency
                            ? 'badge-red'
                            : isHigh
                            ? 'badge-orange'
                            : item.status === 'reviewed'
                            ? 'badge-green'
                            : 'badge-blue'
                        }`}
                        style={{ fontWeight: 700 }}
                      >
                        {isEmergency
                          ? '🚨 CRITICAL EMERGENCY'
                          : isHigh
                          ? '⚠️ HIGH PRIORITY'
                          : item.status === 'reviewed'
                          ? '✓ REVIEWED'
                          : '🟢 ROUTINE REVIEW'}
                      </span>

                      <button
                        className={`btn ${isEmergency ? 'btn-danger' : isHigh ? 'btn-primary' : 'btn-primary'}`}
                        onClick={() => handleOpenReview(item)}
                        style={{ fontSize: '13px', padding: '8px 16px', fontWeight: 700 }}
                      >
                        {isEmergency ? 'Open Urgent Patient' : 'Open Patient'}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PATIENT EVALUATION SCREEN (Section 22, 23, 24) */}
      {/* ======================================================== */}
      {activeTab === 'evaluation' && (
        <div>
          {renderBackButton()}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '20px' }}>
          {/* Left Column: Full Patient Clinical File */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src="/images/patient-feed.jpg"
                  alt={selectedQueueItem ? selectedQueueItem.patientName : 'Keshab Rout'}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #0284c7',
                    flexShrink: 0
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px' }}>
                      {selectedQueueItem ? selectedQueueItem.patientName : 'Keshab Rout'}
                    </h2>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#0284c7', background: '#e0f2fe', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      {selectedQueueItem?.patientId || 'RHB-OD-KLH-0941'}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                    Age: {selectedQueueItem?.age || 26} yrs • {selectedQueueItem?.gender || 'Male'} • Location: Kalahandi, Odisha
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsVideoCallOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}
              >
                <Video size={16} /> Launch Video Bridge
              </button>
            </div>

            {/* Physiological Vitals (Section 23 from Prompt) */}
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '13px', color: '#071c42', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  PHYSIOLOGICAL PARAMETERS (VITALS)
                </strong>
                <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                  *{vitals.enteredBy}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '12px' }}>
                <div style={{ background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <span style={{ color: '#64748b' }}>Temp:</span> <strong>{vitals.temperatureF || 99.8} °F</strong>
                </div>
                <div style={{ background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <span style={{ color: '#64748b' }}>Pulse:</span> <strong>{vitals.pulseBpm || 82} bpm</strong>
                </div>
                <div style={{ background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <span style={{ color: '#64748b' }}>BP:</span> <strong>{vitals.bpSystolic || 120}/{vitals.bpDiastolic || 80}</strong>
                </div>
                <div style={{ background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <span style={{ color: '#64748b' }}>SpO2:</span> <strong>{vitals.spO2Percent || 98}%</strong>
                </div>
                <div style={{ background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <span style={{ color: '#64748b' }}>Resp:</span> <strong>{vitals.respRate || 18} /min</strong>
                </div>
                <div style={{ background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <span style={{ color: '#64748b' }}>Weight:</span> <strong>{vitals.weightKg || 52} kg</strong>
                </div>
              </div>
            </div>

            {/* AI Intake Summary Verification */}
            <div style={{ background: '#f0f9ff', padding: '12px 14px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #bae6fd', fontSize: '13px' }}>
              <div style={{ fontWeight: 700, color: '#0369a1', marginBottom: '4px' }}>
                Reported Complaint & AI-Assisted Summary:
              </div>
              <div style={{ color: '#0f172a' }}>
                {selectedQueueItem ? selectedQueueItem.symptoms : 'Fever and body weakness for two days'} ({selectedQueueItem ? selectedQueueItem.duration : '2–3 days'})
              </div>
              <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '6px' }}>
                {selectedQueueItem ? selectedQueueItem.aiSummary : 'Low-risk viral/respiratory symptom pattern. Appropriate for routine clinician teleconsultation review.'}
              </div>
            </div>

            {/* Diagnostic Reports & Documents (Section 24) */}
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '13px', color: '#071c42', display: 'block', marginBottom: '8px' }}>
                Uploaded Diagnostic Reports & Imaging (Chest X-Ray, Lab)
              </strong>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '12px' }}>{doc.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{doc.category} • {doc.date}</div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setViewingDocument(doc)}
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                    >
                      <Eye size={12} /> Inspect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor's Clinical Notes (Section 22) */}
            <div className="field">
              <label style={{ fontSize: '13px', fontWeight: 700 }}>
                Doctor's Clinical Notes & Decision Record
              </label>
              <textarea
                rows={4}
                value={doctorActionNote}
                onChange={(e) => setDoctorActionNote(e.target.value)}
                placeholder="Enter diagnostic assessment, clinical reasoning, physical advice, or referral notes..."
              />
            </div>

            {actionSuccess && (
              <div className="alert ok" style={{ marginBottom: '12px' }}>
                <Check size={16} /> {actionSuccess}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsCarePlanModalOpen(true)}
                style={{ background: '#f0fdf4', borderColor: '#86efac', color: '#166534', fontWeight: 700 }}
              >
                <ClipboardList size={15} /> Create Care Plan & Follow-up
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsSpecialistModalOpen(true)}
              >
                <UserPlus size={15} /> Request Specialist Opinion
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const testChoice = prompt(
                    'Select Diagnostic Test to Request:\n1. Complete Blood Count (CBC)\n2. Sputum TrueNat MTB / AFB\n3. Peripheral Blood Smear for Malaria (MP)\n4. Blood Glucose Panel (F & PP)\n5. Liver Function Test (LFT)\n6. Kidney Function Test (KFT)\n7. Urine Routine & Microscopic (U/R/M)\n\nEnter test name or choice:',
                    'Complete Blood Count (CBC)'
                  );
                  if (testChoice) {
                    const pName = selectedQueueItem ? selectedQueueItem.patientName : 'Keshab Rout';
                    const pId = selectedQueueItem?.patientId || 'RHB-OD-KLH-0941';
                    storage.addLabOrder({
                      patientId: pId,
                      patientName: pName,
                      patientAge: selectedQueueItem?.age || 45,
                      patientGender: selectedQueueItem?.gender || 'Male',
                      doctorId: (user as any).id || 'doc-1',
                      doctorName: user.name,
                      testId: 'test-requested',
                      testName: testChoice.length < 3 ? 'Complete Blood Count (CBC)' : testChoice,
                      category: 'Hematology',
                      urgency: selectedQueueItem?.urgency === 'urgent' ? 'Urgent' : 'Routine'
                    });
                    setDocuments(storage.getDocuments());
                    alert(`Diagnostic test order for "${testChoice}" created and dispatched to DHH Central Pathology Hub!`);
                  }
                }}
                style={{ background: '#f5f3ff', borderColor: '#ddd6fe', color: '#6d28d9', fontWeight: 700 }}
              >
                <FlaskConical size={15} /> Request Pathology Lab Test
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setRxModalMode('create');
                  setIsRxModalOpen(true);
                }}
              >
                <Pill size={15} /> Create E-Prescription
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleDecision('reviewed')}
                style={{ fontWeight: 800 }}
              >
                <Save size={15} /> Save & Approve Review
              </button>
            </div>
          </div>

          {/* Right Column: Longitudinal Consultation & Prescription History */}
          <div>
            <div className="card" style={{ marginBottom: '16px' }}>
              <h3>Patient Allergies & History</h3>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                <div><strong>Known Allergies:</strong> <span style={{ color: '#059669' }}>No known drug allergies</span></div>
                <div><strong>Chronic Conditions:</strong> None reported</div>
                <div><strong>Blood Group:</strong> B+</div>
                <div><strong>Location:</strong> Kalahandi District (Bhawanipatna Block)</div>
              </div>
            </div>

            <div className="card">
              <h3>Previous Prescriptions & Consultations</h3>
              <div className="data-list" style={{ marginTop: '10px' }}>
                {prescriptions.map((rx) => (
                  <div key={rx.id} style={{ padding: '10px', borderBottom: '1px solid #f1f5f9', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, flexWrap: 'wrap', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{rx.prescriptionNumber}</span>
                        {rx.syncStatus === 'offline-cached' ? (
                          <span style={{ fontSize: '10px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '1px 6px', borderRadius: '4px' }}>
                            💾 Saved locally
                          </span>
                        ) : rx.syncStatus === 'pending' ? (
                          <span style={{ fontSize: '10px', background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '1px 6px', borderRadius: '4px' }}>
                            ⏳ Waiting to sync
                          </span>
                        ) : (
                          <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', border: '1px solid #86efac', padding: '1px 6px', borderRadius: '4px' }}>
                            ☁️ Synced successfully
                          </span>
                        )}
                      </div>
                      <span style={{ color: '#64748b' }}>{rx.date}</span>
                    </div>
                    <div style={{ color: '#0369a1', marginTop: '2px' }}>
                      {rx.doctorName}
                    </div>
                    <div style={{ color: '#475569', marginTop: '2px' }}>
                      {rx.diagnosisSummary}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <button
                        type="button"
                        className="btn btn-ghost-light"
                        onClick={() => {
                          setActiveRxForView(rx);
                          setRxModalMode('view');
                          setIsRxModalOpen(true);
                        }}
                        style={{ padding: '3px 8px', fontSize: '11px', color: '#0284c7' }}
                      >
                        <Eye size={12} /> View
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setActiveRxForView(rx);
                          setRxModalMode('edit');
                          setIsRxModalOpen(true);
                        }}
                        style={{ padding: '3px 8px', fontSize: '11px', background: '#eff6ff', borderColor: '#93c5fd', color: '#1d4ed8', fontWeight: 600 }}
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Laboratory Reports & Released Results */}
            <div className="card" style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '15px' }}>Diagnostic Lab Reports & Scans</h3>
                <span className="badge badge-purple" style={{ fontSize: '11px' }}>{documents.length} Released</span>
              </div>
              <div className="data-list" style={{ marginTop: '10px' }}>
                {documents.slice(0, 6).map((doc) => (
                  <div key={doc.id} style={{ padding: '10px', borderBottom: '1px solid #f1f5f9', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>{doc.title}</span>
                      <span style={{ color: doc.status === 'Critical Flag' ? '#b91c1c' : '#166534' }}>
                        {doc.status}
                      </span>
                    </div>
                    <div style={{ color: '#0369a1', marginTop: '2px' }}>
                      Lab: {doc.labName || 'DHH Central Lab'} • Verifier: {doc.authorizedVerifier || 'Pathologist'}
                    </div>
                    {doc.parameters && doc.parameters.length > 0 && (
                      <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px', background: '#f8fafc', padding: '4px 6px', borderRadius: '4px' }}>
                        {doc.parameters.slice(0, 3).map(p => `${p.name}: ${p.result} ${p.unit} [${p.status || (p.isAbnormal ? 'High' : 'Normal')}]`).join(' • ')}
                      </div>
                    )}
                    <div style={{ marginTop: '6px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setViewingDocument(doc)}
                        style={{ padding: '3px 8px', fontSize: '11px', color: '#7c3aed', borderColor: '#ddd6fe' }}
                      >
                        <Eye size={12} /> View Full Report & Scan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: SCHEDULE */}
      {/* ======================================================== */}
      {activeTab === 'schedule' && (
        <div>
          {renderBackButton()}
          <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2>Today's Teleconsultation Schedule</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                eSanjeevani-inspired tele-OPD queue for Kalahandi rural blocks
              </p>
            </div>
            <span className="badge badge-blue">Today: {appointments.length} Slots</span>
          </div>

          <div className="data-list">
            {appointments.map((apt) => (
              <div key={apt.id} className="data-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      background: '#eef6ff',
                      color: '#0d70d4',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px'
                    }}
                  >
                    <Clock size={16} />
                    <span>{apt.time}</span>
                  </div>
                  <div>
                    <strong style={{ fontSize: '15px' }}>{apt.patientName}</strong>
                    <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                      {apt.type} • {apt.channel}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className={`badge ${
                      apt.status === 'In Progress' ? 'badge-amber' : 'badge-green'
                    }`}
                  >
                    {apt.status}
                  </span>

                  <button
                    className="btn btn-primary"
                    onClick={() => setIsVideoCallOpen(true)}
                    style={{ fontSize: '13px', padding: '6px 14px', fontWeight: 700 }}
                  >
                    <Video size={14} /> Join Tele-Bridge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: PRESCRIPTIONS LIST & LOCAL PHARMACY AVAILABILITY */}
      {/* ======================================================== */}
      {activeTab === 'prescriptions' && (
        <div>
          {renderBackButton()}
          <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2>Clinician E-Prescriptions & Local Drug Availability</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                Doctor-authorized digital prescriptions linked to Kalahandi block pharmacy inventory
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setRxModalMode('create');
                setIsRxModalOpen(true);
              }}
            >
              <Plus size={15} /> Create New E-Prescription
            </button>
          </div>

          <div className="data-list">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="data-item">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '16px', color: '#071c42' }}>{rx.prescriptionNumber}</strong>
                    <span className="badge badge-green">Authorized</span>
                    {rx.syncStatus === 'offline-cached' ? (
                      <span className="badge" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}>
                        💾 Saved locally
                      </span>
                    ) : rx.syncStatus === 'pending' ? (
                      <span className="badge" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                        ⏳ Waiting to sync
                      </span>
                    ) : (
                      <span className="badge" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
                        ☁️ Synced successfully
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Date: {rx.date}</span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#0369a1', fontWeight: 600 }}>
                    Patient: {rx.patientName} ({rx.patientId})
                  </div>

                  <div style={{ fontSize: '13px', color: '#334155', marginTop: '4px' }}>
                    <strong>Impression:</strong> {rx.diagnosisSummary}
                  </div>

                  <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {rx.medicines.map((m, mIdx) => (
                      <span key={mIdx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '6px', fontSize: '12px' }}>
                        💊 {m.name} ({m.strength}) • {m.frequency}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setActiveRxForView(rx);
                      setRxModalMode('edit');
                      setIsRxModalOpen(true);
                    }}
                    style={{ fontSize: '12px', padding: '6px 12px', background: '#eff6ff', borderColor: '#93c5fd', color: '#1d4ed8', fontWeight: 700 }}
                  >
                    <Edit3 size={13} /> Edit Prescription
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setActiveRxForView(rx);
                      setRxModalMode('view');
                      setIsRxModalOpen(true);
                    }}
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                  >
                    Open Details & Stock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: SPECIALIST REQUESTS (Doctor-to-Doctor Telemedicine) */}
      {/* ======================================================== */}
      {activeTab === 'specialist' && (
        <div>
          {renderBackButton()}
          <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2>Doctor-to-Doctor Telemedicine Escalations</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                Secondary clinical opinion requests with district and medical college specialists (Prompt Section 19)
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsSpecialistModalOpen(true)}
            >
              <UserPlus size={15} /> Request Specialist Opinion
            </button>
          </div>

          <div className="data-list">
            {specialistRequests.map((req) => (
              <div key={req.id} className="data-item">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '15px' }}>{req.requestedSpecialist}</strong>
                    <span className="badge badge-amber">{req.urgency}</span>
                    <span className="badge badge-blue">{req.status}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{req.timestamp}</span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#0369a1' }}>
                    Patient: <strong>{req.patientName}</strong> ({req.patientId}) • Referring Clinician: {req.referringDoctor}
                  </div>

                  <div style={{ fontSize: '13px', color: '#334155', marginTop: '4px' }}>
                    <strong>Clinical Reason:</strong> {req.reason}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => alert(`Opening tele-bridge with ${req.requestedSpecialist} for case ${req.patientName}...`)}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    Open Tele-Case
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: CONSULTATION HISTORY */}
      {/* ======================================================== */}
      {activeTab === 'history' && (
        <div>
          {renderBackButton()}
          <div className="card">
          <h2>Completed Teleconsultation History</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>
            Archived teleconsultation sessions and patient encounter notes
          </p>

          <div className="data-list">
            <div className="data-item">
              <div>
                <strong>Keshab Rout (RHB-OD-KLH-0941) — Teleconsultation Session</strong>
                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                  Duration: 12 min 34 sec • Completed today • DHH Bhawanipatna
                </div>
                <div style={{ fontSize: '12px', color: '#059669', marginTop: '2px' }}>
                  Clinical Note: Oral hydration, rest, Tab Paracetamol 500mg SOS.
                </div>
              </div>
              <span className="badge badge-green">Completed</span>
            </div>

            <div className="data-item">
              <div>
                <strong>Saraswati Naik (RHB-OD-KLH-0412) — Chronic Care Tele-Review</strong>
                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                  Duration: 8 min 20 sec • Completed 02/09/2026 • CHC Junagarh
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted-light)', marginTop: '2px' }}>
                  Clinical Note: Warm compress, routine monitoring.
                </div>
              </div>
              <span className="badge badge-gray">Archived</span>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: SCHEDULED LEAVE MANAGEMENT (Section 12) */}
      {/* ======================================================== */}
      {activeTab === 'leave' && (
        <div>
          {renderBackButton()}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
              <div>
                <h2>
                  Clinician Leave & Patient Rerouting Management
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                  Record scheduled leaves so the Patient Portal immediately alerts patients, disables deadlocked bookings, and seamlessly reroutes to replacement clinicians or CHCs.
                </p>
              </div>
              <span className="badge badge-blue">
                {doctorLeaves.length} {doctorLeaves.length === 1 ? 'Recorded Schedule' : 'Recorded Schedules'}
              </span>
            </div>

            {leaveNotice && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: '#f0fdf4',
                  border: '1.5px solid #86efac',
                  color: '#166534',
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <CheckCircle2 size={18} />
                <span>{leaveNotice}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Form: Record Leave */}
              <div
                style={{
                  background: '#f8fafc',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <h3 style={{ fontSize: '16px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="#0284c7" />
                  <span>
                    Schedule New Leave Period
                  </span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={leaveStart}
                        onChange={(e) => setLeaveStart(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        End Date
                      </label>
                      <input
                        type="date"
                        value={leaveEnd}
                        onChange={(e) => setLeaveEnd(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Clinical Duty / Reason for Leave
                    </label>
                    <input
                      type="text"
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="e.g. Rural outreach camp, CME training, Medical emergency"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Handover / Replacement Doctor
                    </label>
                    <input
                      type="text"
                      value={replacementDoctor}
                      onChange={(e) => setReplacementDoctor(e.target.value)}
                      placeholder="e.g. Dr. S. K. Patnaik, DHH Bhawanipatna"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <div style={{ background: '#e0f2fe', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#0369a1' }}>
                    <strong>Automated Safeguard:</strong> Patients seeking care during this window will be presented with the replacement clinician and PHC emergency hotline.
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveLeave}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      fontWeight: 700,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Save size={16} />
                    <span>
                      Save Scheduled Leave & Activate Rerouting
                    </span>
                  </button>
                </div>
              </div>

              {/* List: Recorded Leaves */}
              <div
                style={{
                  background: '#ffffff',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <h3 style={{ fontSize: '16px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#059669" />
                  <span>
                    Active & Upcoming Leave Schedules
                  </span>
                </h3>

                {doctorLeaves.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)', fontSize: '13px' }}>
                    No scheduled leaves recorded. You are marked available for rural teleconsultations.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {doctorLeaves.map((leave, idx) => (
                      <div
                        key={leave.id || idx}
                        style={{
                          padding: '14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          background: '#f8fafc'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <strong style={{ fontSize: '14px', color: '#0f172a' }}>
                            {leave.doctorName || user.name}
                          </strong>
                          <span className="badge badge-orange" style={{ fontWeight: 700, fontSize: '11px' }}>
                            SCHEDULED LEAVE
                          </span>
                        </div>

                        <div style={{ fontSize: '13px', color: '#334155', marginBottom: '4px' }}>
                          📅 <strong>Period:</strong> {leave.startDate} to {leave.endDate}
                        </div>

                        <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                          📝 <strong>Reason:</strong> {leave.reason}
                        </div>

                        {leave.replacementDoctor && (
                          <div style={{ fontSize: '12px', color: '#0369a1', background: '#e0f2fe', padding: '6px 10px', borderRadius: '6px', marginTop: '6px' }}>
                            🔄 <strong>Covering Clinician:</strong> {leave.replacementDoctor}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODALS */}
      {/* ======================================================== */}

      {/* Video Consultation Room */}
      <VideoConsultationRoom
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        doctor={mockDoctorItem}
        patient={mockPatient}
        networkQuality={networkQuality}
        onNetworkChange={onNetworkChange}
        userRole="doctor"
        lang="English"
      />

      {/* Diagnostic Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={!!viewingDocument}
        onClose={() => setViewingDocument(null)}
        document={viewingDocument}
        lang="English"
      />

      {/* E-Prescription Modal */}
      <EPrescriptionModal
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
        prescription={activeRxForView}
        mode={rxModalMode}
        doctorName={user.name}
        patientName={selectedQueueItem ? selectedQueueItem.patientName : 'Keshab Rout'}
        patientId={selectedQueueItem?.patientId || 'RHB-OD-KLH-0941'}
        lang="English"
        onPrescriptionSaved={(newRx) => {
          setPrescriptions(storage.getPrescriptions());
          setRecords(storage.getRecords());
          alert(`E-Prescription (${newRx.prescriptionNumber}) successfully saved & updated in patient record!`);
        }}
      />

      {/* Specialist Request Modal (Doctor-to-Doctor) */}
      <SpecialistRequestModal
        isOpen={isSpecialistModalOpen}
        onClose={() => setIsSpecialistModalOpen(false)}
        referringDoctor={user.name}
        patientName={selectedQueueItem ? selectedQueueItem.patientName : 'Keshab Rout'}
        patientId={selectedQueueItem?.patientId || 'RHB-OD-KLH-0941'}
        lang="English"
        onRequestSubmitted={(req) => {
          setSpecialistRequests(storage.getSpecialistRequests());
        }}
      />

      {/* Care Plan Modal (Prompt Section 32) */}
      <CarePlanModal
        isOpen={isCarePlanModalOpen}
        onClose={() => setIsCarePlanModalOpen(false)}
        doctorName={user.name}
        patientName={selectedQueueItem ? selectedQueueItem.patientName : 'Keshab Rout'}
        patientId={selectedQueueItem?.patientId || 'RHB-OD-KLH-0941'}
        lang="English"
        onSaved={(plan) => {
          alert(`Care plan saved! Follow-up scheduled for ${plan.followUpDate} (${plan.followUpMode}).`);
        }}
      />

      {/* Mobile Bottom Navigation for Doctor (Prompt Section 45) */}
      <div className="mobile-bottom-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        borderTop: '1px solid #cbd5e1',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '6px 0',
        zIndex: 900
      }}>
        <button
          onClick={() => setActiveTab('home')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'home' ? '#0284c7' : '#64748b', fontSize: '10px', cursor: 'pointer' }}
        >
          <ClipboardList size={18} />
          <span>{t.navHome}</span>
        </button>
        <button
          onClick={() => setActiveTab('queue')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'queue' ? '#0284c7' : '#64748b', fontSize: '10px', cursor: 'pointer' }}
        >
          <Clock size={18} />
          <span>{t.navQueue}</span>
        </button>
        <button
          onClick={() => setActiveTab('evaluation')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'evaluation' ? '#0284c7' : '#64748b', fontSize: '10px', cursor: 'pointer' }}
        >
          <User size={18} />
          <span>{t.navPatients}</span>
        </button>
        <button
          onClick={() => setIsVideoCallOpen(true)}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#0284c7', fontSize: '10px', cursor: 'pointer' }}
        >
          <Video size={18} />
          <span>{t.navConsult}</span>
        </button>
        <button
          onClick={() => setActiveTab('specialist')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'specialist' ? '#0284c7' : '#64748b', fontSize: '10px', cursor: 'pointer' }}
        >
          <UserPlus size={18} />
          <span>{t.navSpecialist}</span>
        </button>
      </div>
    </div>
  );
};
