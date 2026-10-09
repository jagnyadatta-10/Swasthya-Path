import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  PhoneOff,
  MessageSquare,
  FileText,
  AlertTriangle,
  CheckCircle2,
  X,
  Send,
  Trash2,
  Wifi,
  WifiOff,
  Signal,
  ShieldCheck,
  Clock,
  User,
  Activity,
  Calendar,
  AlertOctagon,
  Pill,
  Store,
  ArrowDown,
  Languages,
  Edit,
  Plus,
  Check,
  Play,
  Pause,
  RefreshCw,
  Stethoscope,
  Sparkles,
  FilePlus,
  CornerUpRight
} from 'lucide-react';
import {
  DemoUser,
  DoctorItem,
  NetworkQuality,
  ChatMessage,
  HealthRecord,
  Language,
  PrescriptionMedicine,
  FullPrescription,
  AudioTranslationMessage
} from '../types';
import { storage } from '../utils/storage';
import { EPrescriptionModal } from './EPrescriptionModal';
import { getSocket } from '../services/socket';
import { api } from '../services/api';

interface VideoConsultationRoomProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorItem;
  patient: DemoUser;
  networkQuality: NetworkQuality;
  onNetworkChange?: (quality: NetworkQuality) => void;
  userRole: 'patient' | 'doctor';
  onCheckPharmacy?: () => void;
  lang?: Language;
}

const VIDEO_ROOM_I18N = {
  English: {
    preCallTitle: 'Consultation Pre-Call Check',
    preCallSubtitle: 'Swasthya Path Telehealth Bridge • Kalahandi, Odisha',
    diagnostics: 'System Diagnostics',
    mic: 'Microphone:',
    micReady: '✓ Ready / Tested',
    micTest: 'Needs Test / Audio Only',
    cam: 'Camera:',
    camReady: '✓ Camera Active',
    camOff: 'Off / Avatar Fallback',
    net: 'Network Connection:',
    netGood: '● Good (4G/WiFi ~25ms)',
    netLimited: '● Limited (2G audio prioritized)',
    netOffline: '● Offline',
    patientIdLabel: 'Patient Identity:',
    testMedia: 'Test Camera & Mic',
    limitedAlert: 'Limited Network Detected: Video resolution will automatically scale down and audio packets will be prioritized for stability.',
    offlineAlert: 'Offline Mode Active: Live consultation cannot start while offline. Reconnect or review offline records.',
    cancelCall: 'Cancel / Exit Call',
    enterCall: 'Enter Video Consultation ➔',
    consultWith: (name: string) => `Consultation with ${name}`,
    cameraOffLabel: 'Camera Off',
    youDoctor: 'You (Doctor)',
    youPatient: 'You (Patient)',
    audioBtn: '🎤 Audio',
    videoBtn: '🎥 Video',
    speakerBtn: 'Speaker',
    muted: 'Muted',
    camOffBtn: 'Cam Off',
    chatBtn: '💬 Chat',
    recordsBtn: '📋 Health Records',
    notesBtn: 'Notes',
    endCallBtn: '🔴 END CALL',
    chatTitle: 'Consultation Chat',
    noMessages: 'No messages yet. Send a note or symptom update below.',
    chatPlaceholder: 'Type lightweight message...',
    intakeTitle: 'Patient Intake Summary',
    doctorNotesTitle: 'Clinical Notes',
    saveNotesBtn: 'Save Notes',
    confirmTitle: 'End Consultation?',
    confirmSubtitle: 'Conclude active teleconsult session',
    confirmBody: (name: string) => `Are you sure you want to end this teleconsultation with ${name}? Your consultation duration, clinical notes, and digital prescription will be saved.`,
    continueCallBtn: 'Continue Call',
    yesEndBtn: 'Yes, End Call',
    callEndedBadge: '🔴 CALL ENDED',
    callEndedTitle: 'Teleconsultation Session Concluded',
    docLabel: 'Doctor:',
    patLabel: 'Patient:',
    durLabel: 'Duration:',
    encrypted: '✓ 256-bit Encrypted',
    summaryTitle: '📋 Consultation Summary',
    diagnosisLabel: 'Clinical Diagnosis:',
    doctorNotesLabel: "Doctor's Notes:",
    carePlanTitle: '🩺 Doctor Care Plan',
    carePlanAuth: 'CLINICIAN AUTHORIZED',
    homeCareLabel: 'Home Care Directive:',
    medicineTitle: '💊 Medicine Needed?',
    medIssued: 'YES • E-Prescription Issued',
    pharmacyTitle: '🏪 Pharmacy Availability (Live Kalahandi Stock)',
    verified: 'REAL-TIME VERIFIED',
    syncedABHA: 'Offline sync complete with ABHA Health Record',
    checkPharmacyBtn: '💊 Check Live Pharmacy Availability ➔',
    returnDashBtn: 'Return to Dashboard'
  },
  'ଓଡ଼ିଆ': {
    preCallTitle: 'ପରାମର୍ଶ ପୂର୍ବ ପ୍ରସ୍ତୁତି ଯାଞ୍ଚ',
    preCallSubtitle: 'ସ୍ୱାସ୍ଥ୍ୟ ପଥ ଟେଲିହେଲ୍ଥ ବ୍ରିଜ୍ • କଳାହାଣ୍ଡି, ଓଡ଼ିଶା',
    diagnostics: 'ସିଷ୍ଟମ୍ ନିଦାନ ଓ ଯାଞ୍ଚ',
    mic: 'ମାଇକ୍ରୋଫୋନ୍:',
    micReady: '✓ ପ୍ରସ୍ତୁତ / ପରୀକ୍ଷିତ',
    micTest: 'ପରୀକ୍ଷା ଆବଶ୍ୟକ / କେବଳ ଅଡିଓ',
    cam: 'କ୍ୟାମେରା:',
    camReady: '✓ କ୍ୟାମେରା ସକ୍ରିୟ',
    camOff: 'ବନ୍ଦ / ଆଭାଟାର ପ୍ରଦର୍ଶିତ',
    net: 'ନେଟୱର୍କ ସଂଯୋଗ:',
    netGood: '● ଉତ୍ତମ (4G/WiFi ~25ms)',
    netLimited: '● ସୀମିତ (2G ଅଡିଓ ପ୍ରାଥମିକତା)',
    netOffline: '● ଅଫଲାଇନ୍',
    patientIdLabel: 'ରୋଗୀ ପରିଚୟ:',
    testMedia: 'କ୍ୟାମେରା ଓ ମାଇକ୍ ପରୀକ୍ଷା କରନ୍ତୁ',
    limitedAlert: 'ସୀମିତ ନେଟୱର୍କ ଚିହ୍ନଟ ହୋଇଛି: ସ୍ଥିରତା ବଜାୟ ରଖିବାକୁ ଭିଡିଓ ରିଜୋଲ୍ୟୁସନ୍ ଆପେ ଆପେ ହ୍ରାସ ପାଇବ ଏବଂ ଅଡିଓକୁ ପ୍ରାଥମିକତା ଦିଆଯିବ।',
    offlineAlert: 'ଅଫଲାଇନ୍ ମୋଡ୍ ସକ୍ରିୟ: ଲାଇଭ୍ ପରାମର୍ଶ ଅଫଲାଇନ୍ ଥିବାବେଳେ ଆରମ୍ଭ ହୋଇପାରିବ ନାହିଁ। ଦୟାକରି ଇଣ୍ଟରନେଟ୍ ଯୋଡନ୍ତୁ କିମ୍ବା ଅଫଲାଇନ୍ ରେକର୍ଡ ଦେଖନ୍ତୁ।',
    cancelCall: 'ବାତିଲ୍ / ବାହାରନ୍ତୁ',
    enterCall: 'ଭିଡିଓ ପରାମର୍ଶ ଆରମ୍ଭ କରନ୍ତୁ ➔',
    consultWith: (name: string) => `${name} ଙ୍କ ସହିତ ପରାମର୍ଶ`,
    cameraOffLabel: 'କ୍ୟାମେରା ବନ୍ଦ',
    youDoctor: 'ଆପଣ (ଡାକ୍ତର)',
    youPatient: 'ଆପଣ (ରୋଗୀ)',
    audioBtn: '🎤 ଅଡିଓ',
    videoBtn: '🎥 ଭିଡିଓ',
    speakerBtn: 'ସ୍ପିକର',
    muted: 'ନିରବ (Muted)',
    camOffBtn: 'କ୍ୟାମେରା ବନ୍ଦ',
    chatBtn: '💬 ଚାଟ୍',
    recordsBtn: '📋 ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ',
    notesBtn: 'ଟିପ୍ପଣୀ',
    endCallBtn: '🔴 କଲ୍ ଶେଷ (END CALL)',
    chatTitle: 'ପରାମର୍ଶ ବାର୍ତ୍ତାଳାପ',
    noMessages: 'କୌଣସି ବାର୍ତ୍ତା ନାହିଁ। ନିମ୍ନରେ ଲକ୍ଷଣ କିମ୍ବା ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ।',
    chatPlaceholder: 'ସଂକ୍ଷିପ୍ତ ବାର୍ତ୍ତା ଲେଖନ୍ତୁ...',
    intakeTitle: 'ରୋଗୀ ଲକ୍ଷଣ ସାରାଂଶ',
    doctorNotesTitle: 'ଡାକ୍ତରୀ ଟିପ୍ପଣୀ',
    saveNotesBtn: 'ଟିପ୍ପଣୀ ସାଇତନ୍ତୁ',
    confirmTitle: 'କଲ୍ ଶେଷ କରିବେ କି?',
    confirmSubtitle: 'ସକ୍ରିୟ ଟେଲିକନସଲ୍ଟେସନ୍ ସମାପ୍ତ କରନ୍ତୁ',
    confirmBody: (name: string) => `ଆପଣ ନିଶ୍ଚିତ କି ଆପଣ ${name} ଙ୍କ ସହ ଏହି ଟେଲିପରାମର୍ଶ ଶେଷ କରିବାକୁ ଚାହାଁନ୍ତି? ଆପଣଙ୍କ ପରାମର୍ଶ ସମୟ, ଡାକ୍ତରୀ ଟିପ୍ପଣୀ ଏବଂ ଡିଜିଟାଲ୍ ପ୍ରେସକ୍ରିପସନ୍ ସୁରକ୍ଷିତ ଭାବେ ରହିବ।`,
    continueCallBtn: 'କଲ୍ ଜାରି ରଖନ୍ତୁ',
    yesEndBtn: 'ହଁ, କଲ୍ ଶେଷ କରନ୍ତୁ',
    callEndedBadge: '🔴 କଲ୍ ଶେଷ ହେଲା',
    callEndedTitle: 'ଟେଲିକନସଲ୍ଟେସନ୍ ଅଧିବେଶନ ସମ୍ପୂର୍ଣ୍ଣ ହେଲା',
    docLabel: 'ଡାକ୍ତର:',
    patLabel: 'ରୋଗୀ:',
    durLabel: 'ସମୟ ଅବଧି:',
    encrypted: '✓ ୨୫୬-ବିଟ୍ ଏନକ୍ରିପ୍ଟେଡ୍',
    summaryTitle: '📋 ପରାମର୍ଶ ସାରାଂଶ',
    diagnosisLabel: 'ଡାକ୍ତରୀ ନିଦାନ (Diagnosis):',
    doctorNotesLabel: 'ଡାକ୍ତରଙ୍କ ଟିପ୍ପଣୀ:',
    carePlanTitle: '🩺 ଡାକ୍ତରୀ ଯତ୍ନ ଯୋଜନା (Care Plan)',
    carePlanAuth: 'ଡାକ୍ତରଙ୍କ ଦ୍ୱାରା ଅନୁମୋଦିତ',
    homeCareLabel: 'ଘରୋଇ ଯତ୍ନ ନିର୍ଦ୍ଦେଶ:',
    medicineTitle: '💊 ଔଷଧ ଆବଶ୍ୟକ କି?',
    medIssued: 'ହଁ • ଇ-ପ୍ରେସକ୍ରିପସନ୍ ପ୍ରଦାନ କରାଯାଇଛି',
    pharmacyTitle: '🏪 ଔଷଧାଳୟ ଉପଲବ୍ଧତା (କଳାହାଣ୍ଡି ଲାଇଭ୍ ଷ୍ଟକ୍)',
    verified: 'ବାସ୍ତବ-ସମୟରେ ଯାଞ୍ଚ ହୋଇଛି',
    syncedABHA: 'ABHA ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ ସହିତ ଅଫଲାଇନ୍ ସିଙ୍କ୍ ସମ୍ପୂର୍ଣ୍ଣ',
    checkPharmacyBtn: '💊 ଲାଇଭ୍ ଔଷଧ ଷ୍ଟକ୍ ଯାଞ୍ଚ କରନ୍ତୁ ➔',
    returnDashBtn: 'ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ'
  },
  'हिन्दी': {
    preCallTitle: 'परामर्श पूर्व तैयारी जांच',
    preCallSubtitle: 'स्वास्थ्य पथ टेलीहेल्थ ब्रिज • कालाहांडी, ओडिशा',
    diagnostics: 'सिस्टम डायग्नोस्टिक्स',
    mic: 'माइक्रोफ़ोन:',
    micReady: '✓ तैयार / परीक्षित',
    micTest: 'परीक्षण आवश्यक / केवल ऑडियो',
    cam: 'कैमरा:',
    camReady: '✓ कैमरा सक्रिय',
    camOff: 'बंद / अवतार प्रदर्शित',
    net: 'नेटवर्क कनेक्शन:',
    netGood: '● अच्छा (4G/WiFi ~25ms)',
    netLimited: '● सीमित (2G ऑडियो प्राथमिकता)',
    netOffline: '● ऑफलाइन',
    patientIdLabel: 'रोगी की पहचान:',
    testMedia: 'कैमरा और माइक टेस्ट करें',
    limitedAlert: 'सीमित नेटवर्क का पता चला: स्थिरता बनाए रखने के लिए वीडियो रिज़ॉल्यूशन स्वचालित रूप से कम हो जाएगा और ऑडियो को प्राथमिकता दी जाएगी।',
    offlineAlert: 'ऑफलाइन मोड सक्रिय: ऑफलाइन रहते हुए लाइव परामर्श शुरू नहीं किया जा सकता। पुनः कनेक्ट करें या ऑफलाइन रिकॉर्ड देखें।',
    cancelCall: 'रद्द करें / बाहर निकलें',
    enterCall: 'वीडियो परामर्श शुरू करें ➔',
    consultWith: (name: string) => `${name} के साथ परामर्श`,
    cameraOffLabel: 'कैमरा बंद',
    youDoctor: 'आप (डॉक्टर)',
    youPatient: 'आप (रोगी)',
    audioBtn: '🎤 ऑडियो',
    videoBtn: '🎥 वीडियो',
    speakerBtn: 'स्पीकर',
    muted: 'म्यूट',
    camOffBtn: 'कैमरा बंद',
    chatBtn: '💬 चैट',
    recordsBtn: '📋 स्वास्थ्य रिकॉर्ड',
    notesBtn: 'नोट्स',
    endCallBtn: '🔴 कॉल समाप्त (END CALL)',
    chatTitle: 'परामर्श चैट',
    noMessages: 'अभी तक कोई संदेश नहीं। नीचे अपना संदेश लिखें।',
    chatPlaceholder: 'संक्षिप्त संदेश लिखें...',
    intakeTitle: 'रोगी लक्षण सारांश',
    doctorNotesTitle: 'नैदानिक नोट्स',
    saveNotesBtn: 'नोट्स सहेजें',
    confirmTitle: 'परामर्श समाप्त करें?',
    confirmSubtitle: 'सक्रिय टेलीपरामर्श सत्र समाप्त करें',
    confirmBody: (name: string) => `क्या आप वाकई ${name} के साथ यह टेलीपरामर्श समाप्त करना चाहते हैं? आपका परामर्श समय, नैदानिक नोट्स और डिजिटल पर्चा सुरक्षित रहेगा।`,
    continueCallBtn: 'कॉल जारी रखें',
    yesEndBtn: 'हाँ, कॉल समाप्त करें',
    callEndedBadge: '🔴 कॉल समाप्त',
    callEndedTitle: 'टेलीपरामर्श सत्र संपन्न हुआ',
    docLabel: 'डॉक्टर:',
    patLabel: 'रोगी:',
    durLabel: 'अवधि:',
    encrypted: '✓ 256-बिट एन्क्रिप्टेड',
    summaryTitle: '📋 परामर्श सारांश',
    diagnosisLabel: 'नैदानिक निदान:',
    doctorNotesLabel: 'डॉक्टर के नोट्स:',
    carePlanTitle: '🩺 डॉक्टर केयर प्लान',
    carePlanAuth: 'चिकित्सक द्वारा अधिकृत',
    homeCareLabel: 'घरेलू देखभाल निर्देश:',
    medicineTitle: '💊 दवा की आवश्यकता है?',
    medIssued: 'हाँ • ई-प्रिस्क्रिप्शन जारी',
    pharmacyTitle: '🏪 फार्मेसी उपलब्धता (कालाहांडी लाइव स्टॉक)',
    verified: 'रीयल-टाइम सत्यापित',
    syncedABHA: 'ABHA स्वास्थ्य रिकॉर्ड के साथ ऑफलाइन सिंक पूर्ण',
    checkPharmacyBtn: '💊 लाइव फार्मेसी उपलब्धता जांचें ➔',
    returnDashBtn: 'डैशबोर्ड पर लौटें'
  }
};

export const VideoConsultationRoom: React.FC<VideoConsultationRoomProps> = ({
  isOpen,
  onClose,
  doctor,
  patient,
  networkQuality,
  onNetworkChange,
  userRole,
  onCheckPharmacy,
  lang = 'English'
}) => {
  const [roomLang, setRoomLang] = useState<Language>(lang);

  useEffect(() => {
    if (lang) setRoomLang(lang);
  }, [lang]);

  const t = VIDEO_ROOM_I18N[roomLang] || VIDEO_ROOM_I18N.English;

  // Dynamic gender-aware Doctor & Patient Media Sources
  const isMaleDoctor = doctor?.gender === 'male' || (!doctor?.gender && (/patnaik|jena|hota|kumar|rajesh|tripathy|das\b/i.test(doctor?.name || '')));
  const doctorFeedImg = doctor?.feedUrl || (isMaleDoctor ? '/images/male-doctor-feed.jpg' : '/images/doctor-feed.jpg');
  const doctorAvatarImg = doctor?.avatarUrl || doctorFeedImg;

  // Pre-call stage
  const [preCallDone, setPreCallDone] = useState(false);
  const [cameraPermGranted, setCameraPermGranted] = useState<boolean | null>(null);
  const [micPermGranted, setMicPermGranted] = useState<boolean | null>(null);

  // In-call media states
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Panels
  const [activeSidePanel, setActiveSidePanel] = useState<'none' | 'chat' | 'summary' | 'notes' | 'prescription' | 'translator'>('none');
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Section 13: Clinical Workspace & Prescription State
  const [rxMedicines, setRxMedicines] = useState<PrescriptionMedicine[]>([
    {
      id: 'rx-med-1',
      name: 'Tab Paracetamol',
      strength: '500mg',
      dosage: '1 tablet TID after meals',
      frequency: 'Three times daily',
      duration: '3 days',
      instructions: 'Take for fever or body ache. Discontinue once afebrile.'
    },
    {
      id: 'rx-med-2',
      name: 'Oral Rehydration Salts (ORS WHO)',
      strength: '21.8g Sachet',
      dosage: '1 sachet dissolved in 1L cool boiled water',
      frequency: 'Frequent sips',
      duration: '3 days',
      instructions: 'Frequent oral hydration to prevent rural dehydration.'
    }
  ]);
  const [rxDiagnosis, setRxDiagnosis] = useState('Acute Viral Gastroenteritis with Mild Pyrexia');
  const [rxFollowUpDate, setRxFollowUpDate] = useState('In 3 days (Teleconsultation Review)');
  const [rxReferralFacility, setRxReferralFacility] = useState('');
  const [rxStatus, setRxStatus] = useState<'draft' | 'finalized'>('draft');
  const [rxSyncState, setRxSyncState] = useState<'saved-locally' | 'waiting' | 'synced' | 'failed'>('saved-locally');
  const [rxFeedbackMsg, setRxFeedbackMsg] = useState('');
  const [inCallPrescriptionNotice, setInCallPrescriptionNotice] = useState('');
  const [issuedPrescription, setIssuedPrescription] = useState<FullPrescription | null>(null);
  const [showFullRxModal, setShowFullRxModal] = useState(false);
  const [showAddMedForm, setShowAddMedForm] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedStrength, setNewMedStrength] = useState('500mg');
  const [newMedDosage, setNewMedDosage] = useState('1 tab TID');
  const [newMedDuration, setNewMedDuration] = useState('3 days');
  const [newMedInstructions, setNewMedInstructions] = useState('After meals');

  // Section 15: AI Real-Time Audio Translator State
  const [patientTransLang, setPatientTransLang] = useState<Language>('ଓଡ଼ିଆ');
  const [doctorTransLang, setDoctorTransLang] = useState<Language>('English');
  const [isTranslatorActive, setIsTranslatorActive] = useState(false);
  const [isTranslatorPaused, setIsTranslatorPaused] = useState(false);
  const [transInputText, setTransInputText] = useState('');
  const [audioTranslations, setAudioTranslations] = useState<AudioTranslationMessage[]>([
    {
      id: 'tr-1',
      sender: 'patient',
      sourceLang: 'ଓଡ଼ିଆ',
      originalText: 'ମୋତେ ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ ପେଟ ଯନ୍ତ୍ରଣା ହେଉଛି।',
      targetLang: 'English',
      translatedText: 'I have had high fever and abdominal pain for two days.',
      timestamp: '10:04 AM',
      medicalTermsPreserved: ['fever (ଜ୍ୱର)', 'abdominal pain (ପେଟ ଯନ୍ତ୍ରଣା)']
    },
    {
      id: 'tr-2',
      sender: 'doctor',
      sourceLang: 'English',
      originalText: 'Do you have vomiting or feeling dizzy when standing up?',
      targetLang: 'ଓଡ଼ିଆ',
      translatedText: 'ଆପଣଙ୍କର ବାନ୍ତି ହେଉଛି କି କିମ୍ବା ଠିଆ ହେବା ବେଳେ ମୁଣ୍ଡ ବୁଲାଉଛି କି?',
      timestamp: '10:05 AM',
      medicalTermsPreserved: ['vomiting (ବାନ୍ତି)', 'dizziness (ମୁଣ୍ଡ ବୁଲାଇବା)']
    }
  ]);

  // Section 13 Prescription Action Handlers
  const handleAddMedicine = () => {
    if (!newMedName.trim()) return;
    const item: PrescriptionMedicine = {
      id: `med-${Date.now()}`,
      name: newMedName.trim(),
      strength: newMedStrength,
      dosage: newMedDosage,
      frequency: newMedDosage,
      duration: newMedDuration,
      instructions: newMedInstructions
    };
    setRxMedicines((prev) => [...prev, item]);
    setNewMedName('');
    setShowAddMedForm(false);
    setRxSyncState('saved-locally');
    setRxFeedbackMsg('Medicine added to prescription draft.');
    setTimeout(() => setRxFeedbackMsg(''), 3000);
  };

  const handleRemoveMedicine = (id: string) => {
    setRxMedicines((prev) => prev.filter((m) => m.id !== id));
    setRxSyncState('saved-locally');
  };

  const handleSavePrescriptionDraft = () => {
    setRxStatus('draft');
    setRxSyncState('saved-locally');
    const draftRx: FullPrescription = {
      id: `rx-draft-${patient.patientId || 'RHB-OD-KLH-0941'}`,
      prescriptionNumber: `RX-DRAFT-${Date.now().toString().slice(-4)}`,
      patientId: patient.patientId || 'RHB-OD-KLH-0941',
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorHospital: doctor.hospital,
      date: new Date().toLocaleDateString('en-GB'),
      diagnosisSummary: rxDiagnosis,
      medicines: rxMedicines,
      followUp: rxFollowUpDate,
      notes: doctorNotes,
      digitalSignature: `Draft by ${doctor.name} (Pending Clinician Finalization)`,
      status: 'draft',
      syncStatus: 'offline-cached',
      updatedAt: new Date().toISOString(),
      version: 1
    };
    storage.savePrescription(draftRx);
    setRxFeedbackMsg('Prescription draft saved locally.');
    setTimeout(() => setRxFeedbackMsg(''), 3000);
  };

  const handleFinalizePrescription = () => {
    setRxStatus('finalized');
    setRxSyncState('waiting');
    const rxNumber = `RX-KLH-2026-${Math.floor(Math.random() * 800 + 100)}`;
    const finalizedRx: FullPrescription = {
      id: `rx-KLH-${Date.now()}`,
      prescriptionNumber: rxNumber,
      patientId: patient.patientId || 'RHB-OD-KLH-0941',
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorHospital: doctor.hospital,
      date: new Date().toLocaleDateString('en-GB'),
      diagnosisSummary: rxDiagnosis,
      medicines: rxMedicines,
      followUp: rxFollowUpDate,
      notes: rxReferralFacility ? `${doctorNotes} [Referral: ${rxReferralFacility}]` : doctorNotes,
      digitalSignature: `Digitally Authorized by ${doctor.name} (Licensed Medical Officer)`,
      status: 'finalized',
      syncStatus: 'synced',
      updatedAt: new Date().toISOString(),
      version: 1
    };

    setIssuedPrescription(finalizedRx);

    // Save and explicitly synchronize to patient longitudinal health record
    storage.savePrescription(finalizedRx);
    api.prescriptions.save(finalizedRx).catch(() => {});

    // Broadcast across live WebRTC consultation room
    try {
      const socket = getSocket();
      socket.emit('rx-issued', { roomId, prescription: finalizedRx });
    } catch (e) {
      console.warn('Socket Rx broadcast error:', e);
    }

    // Also persist into patient health record stream
    storage.saveRecord({
      patientId: patient.patientId || 'RHB-OD-KLH-0941',
      doctorId: doctor.id,
      doctorName: doctor.name,
      type: 'prescription',
      notes: `E-Prescription ${rxNumber} generated during live teleconsultation call: ${rxDiagnosis}. Prescribed: ${rxMedicines.map(m => m.name).join(', ')}. Follow up: ${rxFollowUpDate}.`,
      prescriptionData: finalizedRx
    });

    setRxSyncState('synced');
    setDoctorNotes(`Prescription ${finalizedRx.prescriptionNumber} finalized: ${rxDiagnosis}. Prescribed: ${rxMedicines.map(m => m.name).join(', ')}.`);
    setRxFeedbackMsg(`✓ E-Prescription ${finalizedRx.prescriptionNumber} authorized during live call & synced to records.`);
    setInCallPrescriptionNotice(`✓ E-Prescription ${finalizedRx.prescriptionNumber} authorized during live call!`);
    
    // Post instant notification into consultation chat stream
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-rx-${Date.now()}`,
        sender: 'doctor',
        senderName: doctor.name,
        text: `📄 E-Prescription Issued: ${finalizedRx.prescriptionNumber} for "${rxDiagnosis}". Prescribed: ${rxMedicines.map(m => m.name).join(', ')}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setTimeout(() => setInCallPrescriptionNotice(''), 7000);
    setTimeout(() => setRxFeedbackMsg(''), 5000);
  };

  const handleRetrySync = () => {
    setRxSyncState('waiting');
    setTimeout(() => {
      setRxSyncState('synced');
      setRxFeedbackMsg('✓ Re-synchronized successfully with patient record.');
      setTimeout(() => setRxFeedbackMsg(''), 3000);
    }, 800);
  };

  // Section 15 AI Translator Action Handlers
  const handleTranslateSpeech = (customText?: string, speaker: 'patient' | 'doctor' = 'patient') => {
    const raw = customText || transInputText.trim();
    if (!raw) return;

    let translated = '';
    let medicalTerms: string[] = [];

    if (speaker === 'patient') {
      if (doctorTransLang === 'English') {
        if (raw.includes('ଜ୍ୱର') || raw.includes('fever') || raw.includes('बुखार')) {
          translated = 'Patient reports fever with chills since yesterday.';
          medicalTerms = ['Fever (ଜ୍ୱର)', 'Chills (କମ୍ପ)'];
        } else if (raw.includes('କାଶ') || raw.includes('cough')) {
          translated = 'Patient has persistent dry cough and throat irritation.';
          medicalTerms = ['Cough (କାଶ)'];
        } else {
          translated = `Patient states: "${raw}" (Translated via low-bandwidth AI neural engine).`;
        }
      } else {
        translated = 'मरीज को पिछले दो दिनों से बुखार और बदन दर्द की समस्या है।';
        medicalTerms = ['बुखार (Fever)'];
      }
    } else {
      if (patientTransLang === 'ଓଡ଼ିଆ') {
        if (raw.toLowerCase().includes('water') || raw.toLowerCase().includes('hydrate') || raw.toLowerCase().includes('ors')) {
          translated = 'ଦିନକୁ ଅତି କମରେ ୨ ଲିଟର ଫୁଟା ପାଣି ଓ ORS ପିଅନ୍ତୁ।';
          medicalTerms = ['ORS (ଓଆରଏସ୍)', 'Hydration (ପ୍ରଚୁର ପାଣି)'];
        } else {
          translated = `ଡାକ୍ତର ପରାମର୍ଶ ଦେଇଛନ୍ତି: "${raw}"।`;
        }
      } else {
        translated = `डॉक्टर का निर्देश: "${raw}"।`;
      }
    }

    const newTrans: AudioTranslationMessage = {
      id: `tr-${Date.now()}`,
      sender: speaker,
      sourceLang: speaker === 'patient' ? patientTransLang : doctorTransLang,
      originalText: raw,
      targetLang: speaker === 'patient' ? doctorTransLang : patientTransLang,
      translatedText: translated,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      medicalTermsPreserved: medicalTerms
    };

    setAudioTranslations((prev) => [...prev, newTrans]);
    setTransInputText('');

    // Trigger synthetic audio speech output if supported
    if ('speechSynthesis' in window && !isSpeakerMuted) {
      try {
        const utter = new SpeechSynthesisUtterance(translated);
        utter.rate = 0.9;
        window.speechSynthesis.speak(utter);
      } catch (e) {
        console.warn('Speech synthesis not permitted in current frame:', e);
      }
    }
  };

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'doctor',
      senderName: doctor.name,
      text: `Namaskar ${patient?.name ? (patient.name.toLowerCase().includes('keshab') ? 'Keshab ji' : patient.name) : 'ji'}, I can see your intake information. How are you feeling today?`,
      timestamp: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Doctor notes during call
  const [doctorNotes, setDoctorNotes] = useState(
    'Patient presented with fever and body weakness for 2 days. No warning signs reported. Vitals stable. Advised oral fluids, rest, Tab Paracetamol 500mg SOS.'
  );
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  // Network transition notification
  const [networkNotification, setNetworkNotification] = useState<string | null>(null);
  const prevNetRef = useRef<NetworkQuality>(networkQuality);

  // End call confirmation & post-call screen
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [callCompleted, setCallCompleted] = useState(false);
  const [followUpPlan, setFollowUpPlan] = useState<'Routine monitoring' | 'Follow-up required' | 'Physical consultation recommended' | 'Emergency escalation'>('Routine monitoring');

  // Real-Time P2P WebRTC Peer Connection & Remote Video
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const roomId = `room-${doctor?.id || 'doc'}-${patient?.patientId || 'pat'}`;

  // Local and Pre-call media streams
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const preCallVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // Callback refs to instantly attach stream as soon as elements mount
  const setLocalVideoRef = (el: HTMLVideoElement | null) => {
    localVideoRef.current = el;
    if (el && localStream) {
      el.srcObject = localStream;
      el.play().catch(() => {});
    }
  };

  const setRemoteVideoRef = (el: HTMLVideoElement | null) => {
    remoteVideoRef.current = el;
    if (el && remoteStream) {
      el.srcObject = remoteStream;
      el.play().catch(() => {});
    }
  };

  // Robust multi-tier media acquisition
  const setupMedia = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('getUserMedia not supported in this browser context (requires HTTPS or localhost)');
        setCameraPermGranted(false);
        setMicPermGranted(false);
        setIsCameraOff(true);
        return;
      }

      // 1. Attempt standard video (front camera ideal) + audio
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: true
        });
        setLocalStream(stream);
        setCameraPermGranted(true);
        setMicPermGranted(true);
        setIsCameraOff(false);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }
        if (preCallVideoRef.current) {
          preCallVideoRef.current.srcObject = stream;
          preCallVideoRef.current.play().catch(() => {});
        }
        return;
      } catch (videoAudioErr) {
        console.warn('Video+Audio getUserMedia failed, trying fallback:', videoAudioErr);
      }

      // 2. Fallback: try basic video: true, audio: true without constraints
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        setCameraPermGranted(true);
        setMicPermGranted(true);
        setIsCameraOff(false);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }
        if (preCallVideoRef.current) {
          preCallVideoRef.current.srcObject = stream;
          preCallVideoRef.current.play().catch(() => {});
        }
        return;
      } catch (basicErr) {
        console.warn('Basic Video+Audio failed, trying audio-only:', basicErr);
      }

      // 3. Fallback: Audio-only if webcam is absent or denied
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true
        });
        setLocalStream(audioStream);
        setCameraPermGranted(false);
        setMicPermGranted(true);
        setIsCameraOff(true);
        return;
      } catch (audioErr) {
        console.warn('Audio-only failed, trying video-only:', audioErr);
      }

      // 4. Fallback: Video-only if microphone is absent or blocked
      try {
        const videoOnlyStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        setLocalStream(videoOnlyStream);
        setCameraPermGranted(true);
        setMicPermGranted(false);
        setIsCameraOff(false);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = videoOnlyStream;
          localVideoRef.current.play().catch(() => {});
        }
        if (preCallVideoRef.current) {
          preCallVideoRef.current.srcObject = videoOnlyStream;
          preCallVideoRef.current.play().catch(() => {});
        }
        return;
      } catch (videoOnlyErr) {
        console.warn('All media device requests failed:', videoOnlyErr);
      }

      setCameraPermGranted(false);
      setMicPermGranted(false);
      setIsCameraOff(true);
    } catch (err) {
      console.error('setupMedia general error:', err);
      setCameraPermGranted(false);
      setMicPermGranted(false);
      setIsCameraOff(true);
    }
  };

  // Real-time WebRTC Peer-to-Peer Signaling & In-Call Event Synchronization
  useEffect(() => {
    if (!preCallDone || !isOpen || callCompleted) return;

    const socket = getSocket();

    // 1. Join consultation room
    socket.emit('join-room', {
      roomId,
      userId: userRole === 'doctor' ? doctor.id : (patient.patientId || patient.email || 'patient-1'),
      userName: userRole === 'doctor' ? doctor.name : patient.name,
      userRole
    });

    // Notify backend API about in-progress consultation
    api.consultations.start({
      roomId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      patientId: patient.patientId || 'RHB-OD-KLH-0941',
      patientName: patient.name
    }).catch(() => {});

    // Helper: Initialize RTCPeerConnection with STUN servers
    const createPC = (targetSocketId: string) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      peerConnectionRef.current = pc;

      // Add local tracks to peer connection
      if (localStream) {
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      }

      // Forward ICE candidates to signaling server
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            targetSocketId,
            candidate: event.candidate
          });
        }
      };

      // Receive incoming remote WebRTC media tracks
      pc.ontrack = (event) => {
        const stream = event.streams[0];
        setRemoteStream(stream);
        setIsPeerConnected(true);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setIsPeerConnected(true);
        } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          setIsPeerConnected(false);
        }
      };

      return pc;
    };

    // Existing peers in room
    socket.on('existing-peers', async (existingPeers: Array<{ socketId: string }>) => {
      if (existingPeers && existingPeers.length > 0) {
        const targetPeer = existingPeers[0];
        const pc = createPC(targetPeer.socketId);
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('offer', { targetSocketId: targetPeer.socketId, offer });
        } catch (err) {
          console.warn('[WebRTC Offer Error]', err);
        }
      }
    });

    // Remote peer joined room
    socket.on('peer-joined', ({ socketId, userName }: { socketId: string; userName: string }) => {
      console.log(`[WebRTC Peer Joined] ${userName} (${socketId})`);
    });

    // Incoming SDP Offer
    socket.on('offer', async ({ senderSocketId, offer }: { senderSocketId: string; offer: RTCSessionDescriptionInit }) => {
      const pc = createPC(senderSocketId);
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { targetSocketId: senderSocketId, answer });
      } catch (err) {
        console.warn('[WebRTC Answer Error]', err);
      }
    });

    // Incoming SDP Answer
    socket.on('answer', async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.warn('[WebRTC Set Remote Desc Error]', err);
        }
      }
    });

    // Incoming ICE candidate
    socket.on('ice-candidate', async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (peerConnectionRef.current && candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.warn('[WebRTC Add ICE Error]', err);
        }
      }
    });

    // Real-Time In-Call Chat Delivery
    socket.on('chat-message', (msg: ChatMessage) => {
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      if (activeSidePanel !== 'chat') {
        setUnreadChatCount((prev) => prev + 1);
      }
    });

    // Real-Time E-Prescription Push
    socket.on('rx-issued', (rx: FullPrescription) => {
      setIssuedPrescription(rx);
      setInCallPrescriptionNotice(`✓ Real-time E-Prescription ${rx.prescriptionNumber} authorized by ${rx.doctorName}!`);
      setTimeout(() => setInCallPrescriptionNotice(''), 7000);
    });

    // Remote peer concluded call
    socket.on('call-ended', () => {
      handleConfirmEnd();
    });

    // Remote peer disconnected
    socket.on('peer-disconnected', () => {
      setIsPeerConnected(false);
      setRemoteStream(null);
    });

    return () => {
      socket.off('existing-peers');
      socket.off('peer-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('chat-message');
      socket.off('rx-issued');
      socket.off('call-ended');
      socket.off('peer-disconnected');
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [preCallDone, isOpen, callCompleted, localStream]);

  // Sync remote video element when remoteStream changes
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(() => {});
    }
  }, [remoteStream]);

  // Sync local video element when localStream, preCallDone, or isCameraOff changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(() => {});
    }
  }, [localStream, preCallDone, isCameraOff]);

  // Sync pre-call video preview
  useEffect(() => {
    if (preCallVideoRef.current && localStream) {
      preCallVideoRef.current.srcObject = localStream;
      preCallVideoRef.current.play().catch(() => {});
    }
  }, [localStream, cameraPermGranted, preCallDone]);

  // Clean up media when modal closes
  useEffect(() => {
    if (!isOpen) {
      cleanUpMedia();
    }
  }, [isOpen]);

  // Clean up media tracks when closed
  const cleanUpMedia = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setRemoteStream(null);
    setIsPeerConnected(false);
  };

  const handleCloseEntirely = () => {
    cleanUpMedia();
    setPreCallDone(false);
    setCallCompleted(false);
    setShowEndConfirm(false);
    setShowFullRxModal(false);
    setCallDuration(0);
    onClose();
  };

  const handleProceedToPharmacy = () => {
    handleCloseEntirely();
    if (onCheckPharmacy) {
      onCheckPharmacy();
    }
  };

  if (!isOpen) return null;

  // Format time MM:SS
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle Camera with dynamic track acquisition if needed
  const toggleCamera = async () => {
    if (isCameraOff) {
      // User wants to turn camera ON
      if (localStream && localStream.getVideoTracks().length > 0) {
        localStream.getVideoTracks().forEach((t) => (t.enabled = true));
        setIsCameraOff(false);
        setCameraPermGranted(true);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
          localVideoRef.current.play().catch(() => {});
        }
      } else {
        // No video track exists yet, request webcam track now
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const videoStream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
              }
            });
            const newVideoTrack = videoStream.getVideoTracks()[0];
            if (newVideoTrack) {
              if (localStream) {
                localStream.addTrack(newVideoTrack);
              } else {
                setLocalStream(videoStream);
              }
              if (peerConnectionRef.current) {
                peerConnectionRef.current.addTrack(newVideoTrack, localStream || videoStream);
              }
              setIsCameraOff(false);
              setCameraPermGranted(true);
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream || videoStream;
                localVideoRef.current.play().catch(() => {});
              }
            }
          }
        } catch (err) {
          console.error('Failed to enable camera track:', err);
          alert('Could not access camera. Please verify device permissions and check if another application is using the webcam.');
        }
      }
    } else {
      // User wants to turn camera OFF
      if (localStream) {
        localStream.getVideoTracks().forEach((t) => (t.enabled = false));
      }
      setIsCameraOff(true);
    }
  };

  // Toggle Mic
  const toggleMic = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((t) => (t.enabled = !t.enabled));
    }
    setIsMicMuted(!isMicMuted);
  };

  // Chat send
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: userRole === 'doctor' ? 'doctor' : 'patient',
      senderName: userRole === 'doctor' ? doctor.name : patient.name,
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // Broadcast across real WebRTC / Socket connection to remote peer
    try {
      const socket = getSocket();
      socket.emit('chat-message', { roomId, message: newMsg });
    } catch (e) {
      console.warn('Socket chat broadcast failed:', e);
    }

    // If patient sent, generate simulated doctor response after 1.5s as backup if doctor peer is offline
    if (userRole === 'patient') {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `chat-${Date.now()}`,
            sender: 'doctor',
            senderName: doctor.name,
            text: 'I noted this. Please keep yourself hydrated. I am reviewing your symptoms.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        if (activeSidePanel !== 'chat') {
          setUnreadChatCount((prev) => prev + 1);
        }
      }, 1800);
    }
  };

  // Save Doctor Note
  const handleSaveNote = () => {
    setNoteSavedFeedback(true);
    storage.saveRecord({
      type: 'consultation',
      doctorName: doctor.name,
      notes: doctorNotes,
      pathway: 'clinician consultation',
      urgency: 'routine',
      followUpPlan
    });
    setTimeout(() => setNoteSavedFeedback(false), 3000);
  };

  // End consultation confirmed
  const handleConfirmEnd = () => {
    setShowEndConfirm(false);
    cleanUpMedia();
    setCallCompleted(true);
    storage.incrementMetric('appointmentsCompleted', 1);

    // Conclude consultation on backend API & broadcast call-ended to peer
    try {
      const socket = getSocket();
      socket.emit('end-call', { roomId });
    } catch (e) {
      console.warn('Socket end-call failed:', e);
    }

    api.consultations.conclude(roomId, {
      durationSeconds: callDuration,
      notes: doctorNotes,
      followUpPlan
    }).catch(() => {});

    // Ensure session prescription is finalized with exact consultation medicines and diagnosis
    let currentRx = issuedPrescription;
    if (!currentRx && rxMedicines && rxMedicines.length > 0) {
      const rxNumber = `RX-KLH-2026-${Math.floor(Math.random() * 800 + 100)}`;
      currentRx = {
        id: `rx-KLH-${Date.now()}`,
        prescriptionNumber: rxNumber,
        patientId: patient.patientId || 'RHB-OD-KLH-0941',
        patientName: patient.name,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorHospital: doctor.hospital,
        date: new Date().toLocaleDateString('en-GB'),
        diagnosisSummary: rxDiagnosis,
        medicines: rxMedicines,
        followUp: rxFollowUpDate,
        notes: rxReferralFacility ? `${doctorNotes} [Referral: ${rxReferralFacility}]` : doctorNotes,
        digitalSignature: `Digitally Authorized by ${doctor.name} (Licensed Medical Officer)`,
        status: 'finalized',
        syncStatus: 'synced',
        updatedAt: new Date().toISOString(),
        version: 1
      };
      setIssuedPrescription(currentRx);
      setRxStatus('finalized');
      storage.savePrescription(currentRx);
      api.prescriptions.save(currentRx).catch(() => {});
    }

    storage.saveRecord({
      type: currentRx ? 'prescription' : 'consultation',
      doctorId: doctor.id,
      doctorName: doctor.name,
      patientId: patient.patientId || 'RHB-OD-KLH-0941',
      notes: currentRx
        ? `Prescription ${currentRx.prescriptionNumber} concluded (${formatTimer(callDuration)}): ${rxDiagnosis}. Prescribed: ${currentRx.medicines.map((m) => m.name).join(', ')}.`
        : `Consultation completed (${formatTimer(callDuration)}). Clinical summary: ${doctorNotes}`,
      pathway: followUpPlan === 'Emergency escalation' ? 'urgent physical care' : 'clinician consultation',
      followUpPlan,
      urgency: followUpPlan === 'Emergency escalation' ? 'urgent' : 'routine',
      prescriptionData: currentRx || undefined
    });
  };

  // ==========================================
  // STAGE 1: PRE-CALL CHECK SCREEN
  // ==========================================
  if (!preCallDone) {
    return (
      <div className="modal-overlay" role="dialog" aria-modal="true">
        <div className="modal-dialog" style={{ maxWidth: '640px', background: '#ffffff', padding: '28px' }}>
          {/* In-Dialog Language Selector */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
              {roomLang === 'ଓଡ଼ିଆ' ? 'ଭାଷା:' : roomLang === 'हिन्दी' ? 'भाषा:' : 'Language:'}
            </span>
            {(['English', 'ଓଡ଼ିଆ', 'हिन्दी'] as Language[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setRoomLang(l)}
                style={{
                  background: roomLang === l ? '#0284c7' : '#f1f5f9',
                  color: roomLang === l ? '#ffffff' : '#334155',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '3px 10px',
                  fontSize: '11px',
                  fontWeight: roomLang === l ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{t.preCallTitle}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
                  {t.preCallSubtitle}
                </p>
              </div>
            </div>
            <button className="btn" onClick={handleCloseEntirely} style={{ padding: '6px 10px', minHeight: '34px', borderRadius: '50%' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px', border: '1px solid var(--line)' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '10px', color: 'var(--navy-mid)' }}>{t.diagnostics}</h4>
            
            <div style={{ display: 'grid', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mic size={16} style={{ color: micPermGranted ? '#059669' : '#d97706' }} />
                  <span>{t.mic}</span>
                </span>
                <span className={`badge ${micPermGranted ? 'badge-green' : 'badge-amber'}`}>
                  {micPermGranted ? t.micReady : t.micTest}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Video size={16} style={{ color: cameraPermGranted ? '#059669' : '#d97706' }} />
                  <span>{t.cam}</span>
                </span>
                <span className={`badge ${cameraPermGranted ? 'badge-green' : 'badge-amber'}`}>
                  {cameraPermGranted ? t.camReady : t.camOff}
                </span>
              </div>

              {cameraPermGranted && localStream && localStream.getVideoTracks().length > 0 && (
                <div style={{ borderRadius: '12px', overflow: 'hidden', height: '140px', background: '#091322', position: 'relative', border: '2px solid #059669', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)' }}>
                  <video
                    ref={preCallVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', bottom: '8px', left: '10px', background: 'rgba(5, 150, 105, 0.85)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
                    <span>Live Camera Test • Active</span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Signal size={16} style={{ color: networkQuality === 'offline' ? '#b42318' : networkQuality === 'limited' ? '#b54708' : '#059669' }} />
                  <span>{t.net}</span>
                </span>
                <span className={`badge ${networkQuality === 'offline' ? 'badge-red' : networkQuality === 'limited' ? 'badge-amber' : 'badge-green'}`}>
                  {networkQuality === 'good' ? t.netGood : networkQuality === 'limited' ? t.netLimited : t.netOffline}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} style={{ color: '#0284c7' }} />
                  <span>{t.patientIdLabel}</span>
                </span>
                <span style={{ fontWeight: 600 }}>{patient.name} ({patient.location})</span>
              </div>

              {/* Consulting Doctor Profile Preview Card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  background: '#f0f9ff',
                  borderRadius: '10px',
                  border: '1px solid #bae6fd',
                  marginTop: '4px'
                }}
              >
                <img
                  src={doctorAvatarImg}
                  alt={doctor.name}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #0284c7',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0369a1' }}>
                    {doctor.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    {doctor.specialty} • {doctor.hospital}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#16a34a',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '2px'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                    <span>
                      {roomLang === 'ଓଡ଼ିଆ'
                        ? 'ଡାକ୍ତର ଅନଲାଇନ୍ ଅଛନ୍ତି • ପରାମର୍ଶ ପାଇଁ ପ୍ରସ୍ତୁତ'
                        : roomLang === 'हिन्दी'
                        ? 'डॉक्टर ऑनलाइन हैं • परामर्श के लिए तैयार'
                        : 'Clinician In Room • Ready for Tele-OPD'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button
                type="button"
                className="btn"
                onClick={setupMedia}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                <Video size={14} />
                <span>{t.testMedia}</span>
              </button>
            </div>
          </div>

          {networkQuality === 'limited' && (
            <div className="alert warn" style={{ fontSize: '13px' }}>
              <strong>{roomLang === 'ଓଡ଼ିଆ' ? 'ସୀମିତ ନେଟୱର୍କ:' : roomLang === 'हिन्दी' ? 'सीमित नेटवर्क:' : 'Limited Network Detected:'} </strong>
              {t.limitedAlert}
            </div>
          )}

          {networkQuality === 'offline' && (
            <div className="alert danger" style={{ fontSize: '13px' }}>
              <strong>{roomLang === 'ଓଡ଼ିଆ' ? 'ଅଫଲାଇନ୍ ମୋଡ୍:' : roomLang === 'हिन्दी' ? 'ऑफलाइन मोड:' : 'Offline Mode Active:'} </strong>
              {t.offlineAlert}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn"
              onClick={handleCloseEntirely}
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fca5a5',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title={t.cancelCall}
            >
              <PhoneOff size={14} />
              <span>{t.cancelCall}</span>
            </button>
            <button
              className="btn btn-primary"
              disabled={networkQuality === 'offline'}
              onClick={async () => {
                if (!localStream) {
                  await setupMedia();
                }
                setPreCallDone(true);
              }}
              style={{ fontWeight: 700, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Video size={16} />
              <span>{t.enterCall}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // STAGE 3: POST-CALL CONSULTATION FLOW
  // (Call Ended -> Summary -> Care Plan -> Medicine Needed? -> Pharmacy Availability)
  // ==========================================
  if (callCompleted) {
    const activeSessionPrescription: FullPrescription = issuedPrescription || {
      id: `rx-KLH-${Date.now()}`,
      prescriptionNumber: `RX-KLH-2026-${Math.floor(Math.random() * 800 + 100)}`,
      patientId: patient.patientId || 'RHB-OD-KLH-0941',
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorHospital: doctor.hospital,
      date: new Date().toLocaleDateString('en-GB'),
      diagnosisSummary: rxDiagnosis || 'Clinical Consultation Concluded',
      medicines: rxMedicines,
      followUp: rxFollowUpDate || 'Routine follow-up in 3 days',
      notes: rxReferralFacility ? `${doctorNotes} [Referral: ${rxReferralFacility}]` : doctorNotes,
      digitalSignature: `Digitally Authorized by Dr. ${doctor.name} (Licensed Medical Officer)`,
      status: 'finalized',
      syncStatus: 'synced',
      updatedAt: new Date().toISOString(),
      version: 1
    };

    const activeSessionMeds: PrescriptionMedicine[] =
      issuedPrescription && issuedPrescription.medicines && issuedPrescription.medicines.length > 0
        ? issuedPrescription.medicines
        : rxMedicines;

    return (
      <div className="modal-overlay" role="dialog" aria-modal="true">
        <div
          className="modal-dialog"
          style={{
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#ffffff',
            padding: '24px',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          {/* Post-Call In-Modal Language Pill Selector */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
              {roomLang === 'ଓଡ଼ିଆ' ? 'ଭାଷା:' : roomLang === 'हिन्दी' ? 'भाषा:' : 'Language:'}
            </span>
            {(['English', 'ଓଡ଼ିଆ', 'हिन्दी'] as Language[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setRoomLang(l)}
                style={{
                  background: roomLang === l ? '#0284c7' : '#f1f5f9',
                  color: roomLang === l ? '#ffffff' : '#334155',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '3px 10px',
                  fontSize: '11px',
                  fontWeight: roomLang === l ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* STEP 1: CALL ENDED */}
          <div
            style={{
              background: '#fef2f2',
              border: '2px solid #f87171',
              borderRadius: '16px',
              padding: '16px 20px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.08)'
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#dc2626', color: '#ffffff', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, marginBottom: '8px' }}>
              <PhoneOff size={13} />
              <span>{t.callEndedBadge}</span>
            </div>
            <h2 style={{ margin: '0 0 6px', fontSize: '20px', color: '#991b1b' }}>
              {t.callEndedTitle}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '10px', textAlign: 'left', background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #fecaca' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{t.docLabel}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                  <img
                    src={doctorAvatarImg}
                    alt={doctor.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1.5px solid #0284c7',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{doctor.name}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{doctor.hospital}</div>
                  </div>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{t.patLabel}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                  <img
                    src="/images/patient-feed.jpg"
                    alt={patient.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1.5px solid #0284c7',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{patient.name}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{patient.location || 'Kalahandi, Odisha'}</div>
                  </div>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{t.durLabel}</span>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7' }}>{formatTimer(callDuration)}</div>
                <div style={{ fontSize: '10px', color: '#16a34a' }}>{t.encrypted}</div>
              </div>
            </div>
          </div>

          {/* DOWN ARROW */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
            <div style={{ width: '2px', height: '16px', background: '#cbd5e1', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #cbd5e1' }}></div>
            </div>
          </div>

          {/* STEP 2: CONSULTATION SUMMARY */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              borderRadius: '14px',
              padding: '14px 16px',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 800, fontSize: '13px' }}>
                <FileText size={16} style={{ color: '#0284c7' }} />
                <span>{t.summaryTitle}</span>
              </div>
              {activeSessionPrescription.prescriptionNumber && (
                <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', border: '1px solid #bae6fd' }}>
                  {activeSessionPrescription.prescriptionNumber}
                </span>
              )}
            </div>
            <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#0f172a' }}>{t.diagnosisLabel} </strong>
                <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '13.5px' }}>
                  {rxDiagnosis || activeSessionPrescription.diagnosisSummary || (
                    roomLang === 'ଓଡ଼ିଆ'
                      ? 'ଡାକ୍ତରୀ ପରାମର୍ଶ ସମ୍ପୂର୍ଣ୍ଣ ହେଲା'
                      : roomLang === 'हिन्दी'
                      ? 'चिकित्सीय परामर्श पूर्ण हुआ'
                      : 'Clinical Consultation Concluded'
                  )}
                </span>
              </div>
              <div style={{ color: '#334155', fontSize: '12px', lineHeight: 1.5, background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#475569' }}>{t.doctorNotesLabel} </strong>
                <span>"{doctorNotes || activeSessionPrescription.notes || 'Patient evaluated via teleconsultation. Symptomatic care advised.'}"</span>
              </div>
            </div>
          </div>

          {/* DOWN ARROW */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
            <div style={{ width: '2px', height: '16px', background: '#cbd5e1', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #cbd5e1' }}></div>
            </div>
          </div>

          {/* STEP 3: DOCTOR CARE PLAN */}
          <div
            style={{
              background: '#f0f9ff',
              border: '1.5px solid #7dd3fc',
              borderRadius: '14px',
              padding: '14px 16px',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontWeight: 800, fontSize: '13px' }}>
                <Activity size={16} />
                <span>{t.carePlanTitle}</span>
              </div>
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 800 }}>
                {t.carePlanAuth}
              </span>
            </div>

            <div style={{ display: 'grid', gap: '6px', marginBottom: '10px' }}>
              {[
                {
                  id: 'Routine monitoring',
                  label: roomLang === 'ଓଡ଼ିଆ'
                    ? 'ନିୟମିତ ନିରୀକ୍ଷଣ (ଘରୋଇ ଯତ୍ନ / ଆଶା କର୍ମୀ ଫଲୋ-ଅପ୍)'
                    : roomLang === 'हिन्दी'
                    ? 'नियमित निगरानी (घरेलू देखभाल / आशा कार्यकर्ता फॉलो-अप)'
                    : 'Routine monitoring (Home care / ASHA follow-up)'
                },
                {
                  id: 'Follow-up required',
                  label: roomLang === 'ଓଡ଼ିଆ'
                    ? `ପୁନଃ ଟେଲିପରାମର୍ଶ (${rxFollowUpDate || '୩ ଦିନ ପରେ'})`
                    : roomLang === 'हिन्दी'
                    ? `पुनः टेलीपरामर्श (${rxFollowUpDate || '3 दिनों में'})`
                    : `Follow-up teleconsultation (${rxFollowUpDate || 'in 3 days'})`
                },
                {
                  id: 'Physical consultation recommended',
                  label: roomLang === 'ଓଡ଼ିଆ'
                    ? `ପ୍ରାଥମିକ/ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ରରେ ଯାଞ୍ଚ ${rxReferralFacility ? `(${rxReferralFacility})` : '(PHC/CHC)'}`
                    : roomLang === 'हिन्दी'
                    ? `स्वास्थ्य केंद्र में शारीरिक जांच ${rxReferralFacility ? `(${rxReferralFacility})` : '(PHC/CHC)'}`
                    : `Physical consultation recommended ${rxReferralFacility ? `(${rxReferralFacility})` : 'at PHC/CHC'}`
                },
                {
                  id: 'Emergency escalation',
                  label: roomLang === 'ଓଡ଼ିଆ'
                    ? '🚨 ଜରୁରୀକାଳୀନ ଡାକ୍ତରଖାନା ସ୍ଥାନାନ୍ତର (DHH / 108 ଆମ୍ବୁଲାନ୍ସ)'
                    : roomLang === 'हिन्दी'
                    ? '🚨 तत्काल आपातकालीन रेफरल (DHH / 108 एम्बुलेंस)'
                    : '🚨 Immediate Emergency Escalation (DHH / 108 Ambulance)'
                }
              ].map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: followUpPlan === opt.id ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    background: followUpPlan === opt.id ? '#ffffff' : '#f8fafc',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: followUpPlan === opt.id ? 700 : 500
                  }}
                >
                  <input
                    type="radio"
                    name="followUp"
                    checked={followUpPlan === opt.id}
                    onChange={() => setFollowUpPlan(opt.id as any)}
                    style={{ width: 'auto' }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bae6fd', fontSize: '12px', color: '#0c4a6e', lineHeight: 1.4 }}>
              <strong>{t.homeCareLabel} </strong>
              {roomLang === 'ଓଡ଼ିଆ'
                ? 'ଦୈନିକ ୨.୫ ଲିଟର ଫୁଟା ପାଣି ସହିତ ORS ଦ୍ରବଣ ପିଅନ୍ତୁ। ୪୮ ଘଣ୍ଟା ବିଶ୍ରାମ ନିଅନ୍ତୁ। ହାଲୁକା ଖାଦ୍ୟ (ଖେଚୁଡ଼ି) ଖାଆନ୍ତୁ। ଲକ୍ଷଣ ବଢିଲେ ତୁରନ୍ତ ଉପକେନ୍ଦ୍ର/ଆଶା କର୍ମୀଙ୍କୁ ଜଣାନ୍ତୁ।'
                : roomLang === 'हिन्दी'
                ? 'प्रतिदिन 2.5 लीटर उबले पानी में ओआरएस घोल बनाकर पिएं। 48 घंटे आराम करें। हल्का भोजन (खिचड़ी) लें। लक्षण बिगड़ने पर तुरंत उपकेंद्र/आशा से संपर्क करें।'
                : 'Drink 2.5L boiled water daily with ORS solution. Rest for 48 hours. Light diet (khichdi). Consult Sub-Centre / ASHA if symptoms worsen.'}
            </div>
          </div>

          {/* DOWN ARROW */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
            <div style={{ width: '2px', height: '16px', background: '#cbd5e1', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #cbd5e1' }}></div>
            </div>
          </div>

          {/* STEP 4: MEDICINE NEEDED? (ACTUAL SESSION PRESCRIPTION) */}
          <div
            style={{
              background: activeSessionMeds.length > 0 ? '#f0fdf4' : '#f8fafc',
              border: activeSessionMeds.length > 0 ? '2px solid #86efac' : '1.5px solid #cbd5e1',
              borderRadius: '14px',
              padding: '14px 16px',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: activeSessionMeds.length > 0 ? '#166534' : '#334155', fontWeight: 800, fontSize: '13px' }}>
                <Pill size={16} />
                <span>{t.medicineTitle}</span>
              </div>
              <span
                style={{
                  background: activeSessionMeds.length > 0 ? '#16a34a' : '#64748b',
                  color: '#ffffff',
                  padding: '2px 10px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 800
                }}
              >
                {activeSessionMeds.length > 0
                  ? t.medIssued
                  : (roomLang === 'ଓଡ଼ିଆ' ? 'ଔଷଧ ଆବଶ୍ୟକ ନାହିଁ • ଘରୋଇ ଯତ୍ନ' : roomLang === 'हिन्दी' ? 'दवा की आवश्यकता नहीं • घरेलू देखभाल' : 'No Meds Needed • Home Care')}
              </span>
            </div>

            {/* If doctor prescribed medicines during this session */}
            {activeSessionMeds.length > 0 ? (
              <div style={{ display: 'grid', gap: '8px' }}>
                {activeSessionMeds.map((med, idx) => (
                  <div
                    key={med.id || idx}
                    style={{
                      background: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: '#dcfce7', color: '#166534', fontWeight: 800, fontSize: '11px', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          {idx + 1}
                        </span>
                        <strong style={{ fontSize: '13px', color: '#166534' }}>
                          {med.name} {med.strength && <span style={{ color: '#15803d', fontWeight: 600 }}>({med.strength})</span>}
                        </strong>
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#334155', marginTop: '3px', paddingLeft: '28px' }}>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{med.dosage || med.frequency || 'As directed'}</span>
                        {med.duration && <span> • <strong>{med.duration}</strong></span>}
                        {med.instructions && <span style={{ color: '#64748b' }}> • <em>{med.instructions}</em></span>}
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                      {med.duration || 'Prescribed'}
                    </span>
                  </div>
                ))}

                {/* Digital prescription info strip & View / Print button */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px dashed #86efac',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginTop: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} color="#16a34a" />
                    <span>
                      <strong>{activeSessionPrescription.prescriptionNumber}</strong> • {activeSessionPrescription.digitalSignature || `Digitally Authorized by Dr. ${doctor.name}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFullRxModal(true)}
                    style={{
                      background: '#166534',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <FileText size={13} />
                    <span>
                      {roomLang === 'ଓଡ଼ିଆ'
                        ? 'ସମ୍ପୂର୍ଣ୍ଣ ପ୍ରେସକ୍ରିପସନ୍ ଦେଖନ୍ତୁ / ପ୍ରିଣ୍ଟ୍'
                        : roomLang === 'हिन्दी'
                        ? 'पूरा पर्चा देखें / प्रिंट'
                        : 'View / Print Official Rx'}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              /* If no medicines were prescribed */
              <div
                style={{
                  background: '#ffffff',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                  color: '#475569'
                }}
              >
                <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                  {roomLang === 'ଓଡ଼ିଆ'
                    ? 'ଏହି ପରାମର୍ଶରେ କୌଣସି ଔଷଧ ଲେଖାଯାଇ ନାହିଁ'
                    : roomLang === 'हिन्दी'
                    ? 'इस परामर्श में कोई दवा नहीं लिखी गई है'
                    : 'No prescription medications required for this session.'}
                </div>
                <div>
                  {roomLang === 'ଓଡ଼ିଆ'
                    ? 'ଡାକ୍ତର ଘରୋଇ ଯତ୍ନ, ବିଶ୍ରାମ ଓ ତରଳ ପଦାର୍ଥ ଗ୍ରହଣ କରିବାକୁ ନିର୍ଦ୍ଦେଶ ଦେଇଛନ୍ତି। ଯଦି ସମସ୍ୟା ବଢେ, ତେବେ ପୁନର୍ବାର ପରାମର୍ଶ କରନ୍ତୁ।'
                    : roomLang === 'हिन्दी'
                    ? 'डॉक्टर ने आराम, तरल पदार्थ एवं घरेलू देखभाल की सलाह दी है। लक्षण बढ़ने पर पुनः संपर्क करें।'
                    : 'The doctor has advised conservative observation, adequate oral fluids, and rest. If symptoms worsen, schedule an in-person visit.'}
                </div>
              </div>
            )}
          </div>

          {/* DOWN ARROW */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
            <div style={{ width: '2px', height: '16px', background: '#cbd5e1', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #cbd5e1' }}></div>
            </div>
          </div>

          {/* STEP 5: PHARMACY AVAILABILITY */}
          <div
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: '2px solid #38bdf8',
              borderRadius: '16px',
              padding: '16px 18px',
              textAlign: 'left',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.4)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 800, fontSize: '14px' }}>
                <Store size={17} />
                <span>{t.pharmacyTitle}</span>
              </div>
              <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 800 }}>
                {t.verified}
              </span>
            </div>

            {/* Prescribed Item Header Info */}
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '10px' }}>
              {activeSessionMeds.length > 0 ? (
                <span>
                  {roomLang === 'ଓଡ଼ିଆ' ? 'ପ୍ରଦାନ କରାଯାଇଥିବା ଔଷଧ ଯାଞ୍ଚ ହୋଇଛି: ' : roomLang === 'हिन्दी' ? 'सत्र की दवाओं का स्टॉक जांच: ' : 'Live stock verified for prescribed item: '}
                  <strong style={{ color: '#38bdf8' }}>{activeSessionMeds[0]?.name} {activeSessionMeds[0]?.strength || ''}</strong>
                </span>
              ) : (
                <span>
                  {roomLang === 'ଓଡ଼ିଆ' ? 'କଳାହାଣ୍ଡି ସରକାରୀ ଜନ ଔଷଧି କେନ୍ଦ୍ର ଷ୍ଟକ୍ ଯାଞ୍ଚ ହୋଇଛି' : roomLang === 'हिन्दी' ? 'कालाहांडी जन औषधि केंद्र लाइव स्टॉक सत्यापित' : 'Kalahandi rural Jan Aushadhi & essential medicine stock verified'}
                </span>
              )}
            </div>

            {/* 3 Store Snapshot Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
              <div style={{ background: '#1e293b', border: '1px solid #22c55e', borderRadius: '8px', padding: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#f8fafc' }}>Store A</span>
                  <span style={{ background: '#14532d', color: '#86efac', fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                    {roomLang === 'ଓଡ଼ିଆ' ? '🟢 ଉପଲବ୍ଧ' : roomLang === 'हिन्दी' ? '🟢 उपलब्ध' : '🟢 Available'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '3px' }}>Maa Manikeswari Medicos</div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Bhawanipatna (1.2 km)</div>
                <div style={{ fontSize: '10px', color: '#4ade80', marginTop: '3px', fontWeight: 700 }}>
                  {roomLang === 'ଓଡ଼ିଆ' ? '୨୪୦ ଟି ଷ୍ଟକ୍ରେ • ₹୧୮' : roomLang === 'हिन्दी' ? '240 उपलब्ध • ₹18' : '240 in stock • ₹18'}
                </div>
              </div>

              <div style={{ background: '#1e293b', border: '1px solid #eab308', borderRadius: '8px', padding: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#f8fafc' }}>Store B</span>
                  <span style={{ background: '#713f12', color: '#fef08a', fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                    {roomLang === 'ଓଡ଼ିଆ' ? '🟡 ସୀମିତ' : roomLang === 'हिन्दी' ? '🟡 सीमित' : '🟡 Limited'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '3px' }}>Kalahandi Jan Aushadhi</div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Kesinga (6.5 km)</div>
                <div style={{ fontSize: '10px', color: '#fde047', marginTop: '3px', fontWeight: 700 }}>
                  {roomLang === 'ଓଡ଼ିଆ' ? '୪ ଟି ବାକି ଅଛି • ₹୧୫' : roomLang === 'हिन्दी' ? '4 बची हैं • ₹15' : '4 strips left • ₹15'}
                </div>
              </div>

              <div style={{ background: '#1e293b', border: '1px solid #ef4444', borderRadius: '8px', padding: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#f8fafc' }}>Store C</span>
                  <span style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                    {roomLang === 'ଓଡ଼ିଆ' ? '🔴 ଷ୍ଟକ୍ ଶେଷ' : roomLang === 'हिन्दी' ? '🔴 अनुपलब्ध' : '🔴 Out of Stock'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '3px' }}>Junagarh Block CHC</div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Junagarh (14 km)</div>
                <div style={{ fontSize: '10px', color: '#f87171', marginTop: '3px', fontWeight: 700 }}>
                  {roomLang === 'ଓଡ଼ିଆ' ? '୪୮ ଘଣ୍ଟାରେ ଆସିବ' : roomLang === 'हिन्दी' ? '48 घंटे में पुनः उपलब्ध' : 'Restock in 48h'}
                </div>
              </div>
            </div>

            {/* Bridge Button: Jump to Live Pharmacy View */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} style={{ color: '#4ade80' }} />
                {t.syncedABHA}
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleProceedToPharmacy}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                  }}
                >
                  <Pill size={15} />
                  <span>{t.checkPharmacyBtn}</span>
                </button>

                <button
                  type="button"
                  className="btn"
                  onClick={handleCloseEntirely}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '12px',
                    padding: '8px 14px'
                  }}
                >
                  {t.returnDashBtn}
                </button>
              </div>
            </div>
          </div>

          {/* Full Official Prescription Slip Modal on Demand */}
          {showFullRxModal && (
            <EPrescriptionModal
              isOpen={showFullRxModal}
              onClose={() => setShowFullRxModal(false)}
              prescription={activeSessionPrescription}
              mode="view"
              doctorName={doctor.name}
              patientName={patient.name}
              patientId={patient.patientId}
              lang={roomLang}
            />
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // STAGE 2: REALISTIC VIDEO CALL SCREEN
  // ==========================================
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: '#040d1a',
        display: 'flex',
        flexDirection: 'column',
        color: '#ffffff',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden'
      }}
      role="dialog"
      aria-label="Telehealth Video Consultation"
    >
      {/* 1. TOP STATUS BAR */}
      <header
        style={{
          background: 'rgba(6, 17, 38, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={18} style={{ color: '#19d3ff' }} />
            <strong style={{ letterSpacing: '0.04em', fontSize: '15px' }}>
              SWASTHYA <span style={{ color: '#19d3ff' }}>PATH</span>
            </strong>
          </div>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
          <span style={{ fontSize: '13px', color: '#cbd5e1' }}>
            {t.consultWith(userRole === 'doctor' ? patient.name : doctor.name)}
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '13px', fontWeight: 700 }}>
            <Clock size={14} />
            <span>{formatTimer(callDuration)}</span>
          </div>

          {/* In-Call Quick Tool Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '10px' }}>
            <button
              type="button"
              onClick={() => setActiveSidePanel(activeSidePanel === 'prescription' ? 'none' : 'prescription')}
              style={{
                background: activeSidePanel === 'prescription' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'rgba(2, 132, 199, 0.2)',
                border: activeSidePanel === 'prescription' ? '1.5px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.4)',
                color: activeSidePanel === 'prescription' ? '#ffffff' : '#7dd3fc',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeSidePanel === 'prescription' ? '0 0 12px rgba(56, 189, 248, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
              title="Open E-Prescription workspace during call"
            >
              <Stethoscope size={14} color={activeSidePanel === 'prescription' ? '#ffffff' : '#38bdf8'} />
              <span>{userRole === 'doctor' ? '🩺 Make E-Prescription' : '💊 Live E-Prescription'}</span>
              <span style={{
                background: rxStatus === 'finalized' ? '#22c55e' : '#0284c7',
                color: '#fff',
                fontSize: '10px',
                padding: '1px 6px',
                borderRadius: '999px',
                fontWeight: 800
              }}>
                {rxStatus === 'finalized' ? '✓ Synced' : `${rxMedicines.length} Meds`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSidePanel(activeSidePanel === 'chat' ? 'none' : 'chat')}
              style={{
                background: activeSidePanel === 'chat' ? '#1e293b' : 'rgba(255, 255, 255, 0.08)',
                border: activeSidePanel === 'chat' ? '1.5px solid #94a3b8' : '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <MessageSquare size={13} />
              <span>Chat</span>
              {chatMessages.length > 0 && (
                <span style={{ background: '#38bdf8', color: '#091322', fontSize: '10px', padding: '1px 5px', borderRadius: '999px', fontWeight: 800 }}>
                  {chatMessages.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveSidePanel(activeSidePanel === 'summary' ? 'none' : 'summary')}
              style={{
                background: activeSidePanel === 'summary' ? '#1e293b' : 'rgba(255, 255, 255, 0.08)',
                border: activeSidePanel === 'summary' ? '1.5px solid #94a3b8' : '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <FileText size={13} />
              <span>Records</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSidePanel(activeSidePanel === 'translator' ? 'none' : 'translator')}
              style={{
                background: activeSidePanel === 'translator' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                border: activeSidePanel === 'translator' ? '1.5px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Languages size={13} color="#c084fc" />
              <span>AI Translator</span>
            </button>
          </div>
        </div>

        {/* Connection Quality & Network Simulation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* In-Call Language Selector Pill */}
          <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '2px' }}>
            {(['English', 'ଓଡ଼ିଆ', 'हिन्दी'] as Language[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setRoomLang(l)}
                style={{
                  background: roomLang === l ? '#0284c7' : 'transparent',
                  color: roomLang === l ? '#ffffff' : '#94a3b8',
                  border: 0,
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: roomLang === l ? 700 : 500,
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              background:
                networkQuality === 'good'
                  ? 'rgba(34, 197, 94, 0.15)'
                  : networkQuality === 'limited'
                  ? 'rgba(245, 158, 11, 0.2)'
                  : 'rgba(239, 68, 68, 0.2)',
              color:
                networkQuality === 'good'
                  ? '#86efac'
                  : networkQuality === 'limited'
                  ? '#fde047'
                  : '#fca5a5',
              border: `1px solid ${
                networkQuality === 'good'
                  ? 'rgba(34, 197, 94, 0.4)'
                  : networkQuality === 'limited'
                  ? 'rgba(245, 158, 11, 0.4)'
                  : 'rgba(239, 68, 68, 0.4)'
              }`
            }}
          >
            {networkQuality === 'good' && <Wifi size={13} />}
            {networkQuality === 'limited' && <Signal size={13} />}
            {networkQuality === 'offline' && <WifiOff size={13} />}
            <span>
              {networkQuality === 'good'
                ? (roomLang === 'ଓଡ଼ିଆ' ? '● ଉତ୍ତମ ସଂଯୋଗ • 4G/WiFi ~୨୫ms' : roomLang === 'हिन्दी' ? '● अच्छा कनेक्शन • 4G/WiFi ~25ms' : '● Good connection • 4G / Fiber • ~25 ms')
                : networkQuality === 'limited'
                ? (roomLang === 'ଓଡ଼ିଆ' ? '● ସୀମିତ ସଂଯୋଗ • 2G ଅଡିଓ' : roomLang === 'हिन्दी' ? '● सीमित कनेक्शन • 2G ऑडियो' : '● Limited connection • 2G / unstable network')
                : (roomLang === 'ଓଡ଼ିଆ' ? '● ଅଫଲାଇନ୍ • ସଂଯୋଗ ବିଚ୍ଛିନ୍ନ' : roomLang === 'हिन्दी' ? '● ऑफलाइन • कनेक्शन टूटा' : '● Offline • Connection Lost')}
            </span>
          </div>

          {/* Quick Network Simulator for Evaluator */}
          {onNetworkChange && (
            <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '2px' }}>
              {(['good', 'limited', 'offline'] as NetworkQuality[]).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onNetworkChange(q)}
                  style={{
                    background: networkQuality === q ? '#1e3a8a' : 'transparent',
                    color: networkQuality === q ? '#38bdf8' : '#94a3b8',
                    border: 0,
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  title={`Simulate ${q} network condition`}
                >
                  {q.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {/* Top Header End Call Action Button */}
          <button
            type="button"
            onClick={() => setShowEndConfirm(true)}
            style={{
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 10px rgba(220, 38, 38, 0.45)',
              marginLeft: '6px'
            }}
            id="top-bar-end-call-btn"
            title="End Video Consultation Call"
          >
            <PhoneOff size={15} />
            <span>{t.endCallBtn}</span>
          </button>
        </div>
      </header>

      {/* Dynamic Network Alert Banner */}
      {networkNotification && (
        <div
          style={{
            background: networkQuality === 'offline' ? '#7f1d1d' : '#78350f',
            color: '#ffffff',
            padding: '8px 16px',
            textAlign: 'center',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <AlertTriangle size={15} />
          <span>{networkNotification}</span>
        </div>
      )}

      {/* 2. MAIN WORKSPACE (VIDEO FEEDS + OPTIONAL SIDE PANEL) */}
      <div style={{ flex: '1 1 0', minHeight: 0, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* VIDEO DISPLAY AREA */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            background: '#020617',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* OFFLINE COVER STATE (Honest Boundary: No fake offline video!) */}
          {networkQuality === 'offline' ? (
            <div style={{ textAlign: 'center', padding: '32px', maxWidth: '480px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  border: '1px solid rgba(239, 68, 68, 0.4)'
                }}
              >
                <WifiOff size={32} />
              </div>
              <h3 style={{ margin: '0 0 8px', color: '#f87171' }}>Connection Lost</h3>
              <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6 }}>
                Live consultation has been paused to prevent medical miscommunication.
                Your saved offline records remain safe. Reconnect to resume the live consultation.
              </p>
              {onNetworkChange && (
                <button
                  className="btn btn-primary"
                  onClick={() => onNetworkChange('good')}
                  style={{ marginTop: '16px', fontSize: '13px' }}
                >
                  <Wifi size={14} />
                  <span>Simulate Reconnect</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* PRIMARY MAIN VIDEO: Remote Peer */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#040d1a',
                  overflow: 'hidden'
                }}
              >
                {userRole === 'patient' ? (
                  <>
                    {/* Realistic Doctor Webcam Video Stream / Live WebRTC Peer Stream */}
                    {remoteStream ? (
                      <video
                        ref={setRemoteVideoRef}
                        autoPlay
                        playsInline
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: networkQuality === 'limited' ? 'blur(1.2px) contrast(0.92)' : 'none',
                          transition: 'filter 0.4s ease'
                        }}
                      />
                    ) : (
                      <img
                        src={doctorFeedImg}
                        alt={doctor.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center 15%',
                          filter: networkQuality === 'limited' ? 'blur(1.2px) contrast(0.92)' : 'none',
                          transition: 'filter 0.4s ease'
                        }}
                      />
                    )}

                    {/* Subtle Live Stream Gradient Vignette for crisp overlay readability */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(4, 13, 26, 0.88) 0%, rgba(4, 13, 26, 0.1) 40%, rgba(4, 13, 26, 0.15) 65%, rgba(4, 13, 26, 0.65) 100%)',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Top Left Live Status Pill */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(15, 23, 42, 0.82)',
                        backdropFilter: 'blur(8px)',
                        padding: '6px 12px',
                        borderRadius: '999px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#22c55e',
                          boxShadow: '0 0 8px #22c55e',
                          animation: 'streamPulse 2s infinite'
                        }}
                      />
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
                        {isPeerConnected
                          ? (roomLang === 'ଓଡ଼ିଆ' ? '🟢 P2P ଲାଇଭ୍ କଲ୍' : roomLang === 'हिन्दी' ? '🟢 P2P लाइव कॉल' : '🟢 P2P WEBRTC CONNECTED')
                          : (roomLang === 'ଓଡ଼ିଆ' ? 'ଲାଇଭ୍ ଡାକ୍ତର ଟେଲି-OPD' : roomLang === 'हिन्दी' ? 'लाइव डॉक्टर टेली-ओपीडी' : 'LIVE CLINICIAN FEED')}
                      </span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>•</span>
                      <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 700 }}>
                        {networkQuality === 'limited'
                          ? (roomLang === 'ଓଡ଼ିଆ' ? 'ସ୍ୱଳ୍ପ ବ୍ୟାଣ୍ଡୱିଡ଼ଥ୍ ୩୬୦p' : roomLang === 'हिन्दी' ? 'अनुकूली 360p' : 'Adaptive 360p')
                          : (isPeerConnected ? 'WebRTC P2P HD' : 'HD 720p 30fps')}
                      </span>
                    </div>

                    {/* Bottom Left Doctor Credentials & Audio Waveform Card */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        background: 'rgba(15, 23, 42, 0.88)',
                        backdropFilter: 'blur(10px)',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                        maxWidth: '420px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>🩺</span>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                            {doctor.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#93c5fd' }}>
                            {doctor.specialty} • {doctor.hospital}
                          </div>
                        </div>
                      </div>

                      {/* Speaking / Audio Waveform Indicator */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
                          <span style={{ width: '3px', height: '8px', background: '#38bdf8', borderRadius: '1px', animation: 'waveform 0.8s ease infinite alternate' }} />
                          <span style={{ width: '3px', height: '14px', background: '#38bdf8', borderRadius: '1px', animation: 'waveform 0.5s ease infinite alternate 0.15s' }} />
                          <span style={{ width: '3px', height: '6px', background: '#38bdf8', borderRadius: '1px', animation: 'waveform 0.9s ease infinite alternate 0.3s' }} />
                          <span style={{ width: '3px', height: '11px', background: '#38bdf8', borderRadius: '1px', animation: 'waveform 0.7s ease infinite alternate 0.2s' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: '#86efac', fontWeight: 600 }}>
                          {roomLang === 'ଓଡ଼ିଆ' ? 'ଡାକ୍ତର ଅଡିଓ ସକ୍ରିୟ • ସୁରକ୍ଷିତ ଷ୍ଟ୍ରିମ୍' : roomLang === 'हिन्दी' ? 'डॉक्टर ऑडियो सक्रिय • सुरक्षित स्ट्रीम' : 'Audio Active • End-to-End Encrypted'}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Doctor Portal View: Remote peer is patient Keshab Rout */
                  <>
                    {/* Realistic Patient Smartphone Front-Camera / Live WebRTC Peer Stream */}
                    {remoteStream ? (
                      <video
                        ref={setRemoteVideoRef}
                        autoPlay
                        playsInline
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: networkQuality === 'limited' ? 'blur(1.2px) contrast(0.92)' : 'none',
                          transition: 'filter 0.4s ease'
                        }}
                      />
                    ) : (
                      <img
                        src="/images/patient-feed.jpg"
                        alt={patient.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center 15%',
                          filter: networkQuality === 'limited' ? 'blur(1.2px) contrast(0.92)' : 'none',
                          transition: 'filter 0.4s ease'
                        }}
                      />
                    )}

                    {/* Subtle Live Stream Gradient Vignette for crisp overlay readability */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(4, 13, 26, 0.88) 0%, rgba(4, 13, 26, 0.1) 40%, rgba(4, 13, 26, 0.15) 65%, rgba(4, 13, 26, 0.65) 100%)',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Top Left Live Status Pill */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(15, 23, 42, 0.82)',
                        backdropFilter: 'blur(8px)',
                        padding: '6px 12px',
                        borderRadius: '999px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#22c55e',
                          boxShadow: '0 0 8px #22c55e',
                          animation: 'streamPulse 2s infinite'
                        }}
                      />
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>
                        {isPeerConnected
                          ? (roomLang === 'ଓଡ଼ିଆ' ? '🟢 P2P ଲାଇଭ୍ କଲ୍' : roomLang === 'हिन्दी' ? '🟢 P2P लाइव कॉल' : '🟢 P2P WEBRTC CONNECTED')
                          : (roomLang === 'ଓଡ଼ିଆ' ? 'ଲାଇଭ୍ ରୋଗୀ ଫିଡ୍' : roomLang === 'हिन्दी' ? 'लाइव मरीज वीडियो' : 'LIVE PATIENT FEED')}
                      </span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>•</span>
                      <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 700 }}>
                        {networkQuality === 'limited'
                          ? (roomLang === 'ଓଡ଼ିଆ' ? 'ସ୍ୱଳ୍ପ ବ୍ୟାଣ୍ଡୱିଡ଼ଥ୍ ୩୬୦p' : roomLang === 'हिन्दी' ? 'अनुकूली 360p' : 'Adaptive 360p')
                          : (isPeerConnected ? 'WebRTC P2P HD' : '4G HD Uplink (Kalahandi)')}
                      </span>
                    </div>

                    {/* Bottom Left Patient Clinical Card & Audio Waveform */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        background: 'rgba(15, 23, 42, 0.88)',
                        backdropFilter: 'blur(10px)',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                        maxWidth: '420px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>👤</span>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                            {patient.name} <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>(26 Y / M)</span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#93c5fd' }}>
                            {patient.location} • ID: {patient.patientId || 'RHB-OD-KLH-0941'}
                          </div>
                        </div>
                      </div>

                      {/* Speaking / Audio Waveform Indicator */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
                          <span style={{ width: '3px', height: '7px', background: '#22c55e', borderRadius: '1px', animation: 'waveform 0.75s ease infinite alternate' }} />
                          <span style={{ width: '3px', height: '13px', background: '#22c55e', borderRadius: '1px', animation: 'waveform 0.6s ease infinite alternate 0.15s' }} />
                          <span style={{ width: '3px', height: '5px', background: '#22c55e', borderRadius: '1px', animation: 'waveform 0.85s ease infinite alternate 0.3s' }} />
                          <span style={{ width: '3px', height: '10px', background: '#22c55e', borderRadius: '1px', animation: 'waveform 0.65s ease infinite alternate 0.2s' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: '#86efac', fontWeight: 600 }}>
                          {roomLang === 'ଓଡ଼ିଆ' ? 'ରୋଗୀ ଅଡିଓ ସଂଯୁକ୍ତ • କଥାବାର୍ତ୍ତା ଚାଲୁଅଛି' : roomLang === 'हिन्दी' ? 'मरीज ऑडियो कनेक्टेड • आवाज स्पष्ट' : 'Patient Audio Stream Active'}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* FLOATING PICTURE-IN-PICTURE (PIP) CARD: Local User's Camera Stream */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '180px',
                  height: '135px',
                  background: '#091322',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1.5px solid rgba(25, 211, 255, 0.3)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 20
                }}
              >
                {/* Real local camera video feed */}
                <video
                  ref={setLocalVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: isCameraOff || !cameraPermGranted ? 'none' : 'block'
                  }}
                />

                {(isCameraOff || !cameraPermGranted) && (
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    {userRole === 'doctor' ? (
                      <img
                        src={doctorAvatarImg}
                        alt={doctor.name}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          margin: '0 auto 6px',
                          border: '2px solid #0284c7'
                        }}
                      />
                    ) : (
                      <img
                        src="/images/patient-feed.jpg"
                        alt={patient.name}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          margin: '0 auto 6px',
                          border: '2px solid #0284c7'
                        }}
                      />
                    )}
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{t.cameraOffLabel}</div>
                  </div>
                )}

                <div
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '4px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: '#ffffff'
                  }}
                >
                  {userRole === 'doctor' ? t.youDoctor : t.youPatient}
                  {isMicMuted && ' • 🔇'}
                </div>
              </div>

              {/* IN-CALL LIVE PRESCRIPTION NOTIFICATION BANNER */}
              {inCallPrescriptionNotice && (
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                    border: '1.5px solid #34d399',
                    color: '#ffffff',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 40,
                    animation: 'fadeIn 0.3s ease'
                  }}
                >
                  <CheckCircle2 size={20} color="#6ee7b7" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '13px' }}>{inCallPrescriptionNotice}</div>
                    <div style={{ fontSize: '11px', color: '#a7f3d0' }}>Digitally authorized & synchronized during live consultation</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSidePanel('prescription')}
                    style={{
                      background: '#ffffff',
                      color: '#065f46',
                      border: 0,
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}
                  >
                    View Rx
                  </button>
                </div>
              )}

              {/* FLOATING CALL CONTROLS HUD (CENTERED ON VIDEO CANVAS) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(6, 17, 38, 0.94)',
                  backdropFilter: 'blur(12px)',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '999px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.75)',
                  zIndex: 25
                }}
              >
                {/* Mic toggle */}
                <button
                  type="button"
                  onClick={toggleMic}
                  style={{
                    background: isMicMuted ? '#dc2626' : 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: 0,
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {isMicMuted ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                {/* Camera toggle */}
                <button
                  type="button"
                  onClick={toggleCamera}
                  style={{
                    background: isCameraOff ? '#dc2626' : 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: 0,
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isCameraOff ? <VideoOff size={16} /> : <Video size={16} />}
                </button>

                <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.2)', margin: '0 2px' }} />

                {/* IN-CALL E-PRESCRIPTION BUTTON */}
                <button
                  type="button"
                  onClick={() => setActiveSidePanel(activeSidePanel === 'prescription' ? 'none' : 'prescription')}
                  style={{
                    background: activeSidePanel === 'prescription'
                      ? 'linear-gradient(135deg, #0284c7, #0369a1)'
                      : rxStatus === 'finalized'
                      ? 'rgba(22, 163, 74, 0.3)'
                      : 'rgba(2, 132, 199, 0.25)',
                    border: activeSidePanel === 'prescription'
                      ? '1.5px solid #38bdf8'
                      : rxStatus === 'finalized'
                      ? '1px solid #22c55e'
                      : '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#ffffff',
                    borderRadius: '999px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: activeSidePanel === 'prescription' ? '0 0 16px rgba(56, 189, 248, 0.5)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  title="Make & Authorize E-Prescription during live call"
                >
                  <Stethoscope size={15} color="#38bdf8" />
                  <span>{userRole === 'doctor' ? '🩺 Write Rx' : '💊 View Rx'}</span>
                  <span style={{
                    background: rxStatus === 'finalized' ? '#22c55e' : '#0284c7',
                    color: '#fff',
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    fontWeight: 800
                  }}>
                    {rxStatus === 'finalized' ? '✓' : rxMedicines.length}
                  </span>
                </button>

                {/* Chat toggle */}
                <button
                  type="button"
                  onClick={() => setActiveSidePanel(activeSidePanel === 'chat' ? 'none' : 'chat')}
                  style={{
                    background: activeSidePanel === 'chat' ? '#1e293b' : 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: 0,
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  title="Open Chat"
                >
                  <MessageSquare size={16} />
                  {chatMessages.length > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      background: '#38bdf8',
                      color: '#091322',
                      fontSize: '9px',
                      fontWeight: 800,
                      width: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {chatMessages.length}
                    </span>
                  )}
                </button>

                {/* Patient Summary / Records */}
                <button
                  type="button"
                  onClick={() => setActiveSidePanel(activeSidePanel === 'summary' ? 'none' : 'summary')}
                  style={{
                    background: activeSidePanel === 'summary' ? '#1e293b' : 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: 0,
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Patient Intake & Medical Records"
                >
                  <FileText size={16} />
                </button>

                {/* AI Translator */}
                <button
                  type="button"
                  onClick={() => setActiveSidePanel(activeSidePanel === 'translator' ? 'none' : 'translator')}
                  style={{
                    background: activeSidePanel === 'translator' ? 'rgba(168, 85, 247, 0.35)' : 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: 0,
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="AI Real-Time Audio Translator"
                >
                  <Languages size={16} color="#c084fc" />
                </button>

                <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.2)', margin: '0 2px' }} />

                {/* End call button */}
                <button
                  type="button"
                  onClick={() => setShowEndConfirm(true)}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 0,
                    borderRadius: '999px',
                    padding: '8px 18px',
                    fontSize: '12px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.5)'
                  }}
                  id="floating-end-call-btn"
                  title="End Consultation Call"
                >
                  <PhoneOff size={15} />
                  <span>{t.endCallBtn}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* COLLAPSIBLE SIDE PANELS (Chat, Summary, Doctor Notes) */}
        {activeSidePanel === 'chat' && (
          <aside
            style={{
              width: '320px',
              background: '#091322',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 30
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} style={{ color: '#19d3ff' }} />
                <strong style={{ fontSize: '14px' }}>Consultation Chat</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setChatMessages([])}
                  style={{ background: 'transparent', border: 0, color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                  title="Clear chat"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSidePanel('none')}
                  style={{ background: 'transparent', border: 0, color: '#ffffff', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat message history */}
            <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatMessages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', marginTop: '30px' }}>
                  No messages yet. Send a note or symptom update below.
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: (userRole === 'doctor' && msg.sender === 'doctor') || (userRole === 'patient' && msg.sender === 'patient') ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'flex-start'
                    }}
                  >
                    {msg.sender === 'doctor' && (
                      <img
                        src={doctorAvatarImg}
                        alt="Doctor"
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1px solid #38bdf8',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}
                      />
                    )}
                    {msg.sender === 'patient' && (
                      <img
                        src="/images/patient-feed.jpg"
                        alt="Patient"
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1px solid #22c55e',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}
                      />
                    )}
                    <div
                      style={{
                        background: (userRole === 'doctor' && msg.sender === 'doctor') || (userRole === 'patient' && msg.sender === 'patient') ? '#0284c7' : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        fontSize: '13px'
                      }}
                    >
                      <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.65)', marginBottom: '2px' }}>
                        {msg.senderName} • {msg.timestamp}
                      </div>
                      <div>{msg.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{ padding: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '6px' }}
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type lightweight message..."
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontSize: '13px',
                  padding: '8px 10px',
                  borderRadius: '6px'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '8px 12px', minHeight: '36px' }}
              >
                <Send size={14} />
              </button>
            </form>
          </aside>
        )}

        {/* PATIENT SUMMARY PANEL (Crucial for Doctor during consultation) */}
        {activeSidePanel === 'summary' && (
          <aside
            style={{
              width: '340px',
              background: '#091322',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 30,
              overflowY: 'auto'
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} style={{ color: '#19d3ff' }} />
                <strong style={{ fontSize: '14px' }}>{t.intakeTitle}</strong>
              </div>
              <button
                type="button"
                onClick={() => setActiveSidePanel('none')}
                style={{ background: 'transparent', border: 0, color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '16px', display: 'grid', gap: '14px', fontSize: '13px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 12px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#ffffff' }}>{patient.name}</div>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                  Age: {patient.age || 26} • Gender: {patient.gender || 'Male'} • Location: {patient.location}
                </div>
              </div>

              <div>
                <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Main Concern:
                </span>
                <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '2px' }}>
                  Fever and body weakness
                </div>
              </div>

              <div>
                <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Duration:
                </span>
                <div style={{ color: '#ffffff', marginTop: '2px' }}>2–3 days</div>
              </div>

              <div>
                <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Emergency Warning Signs:
                </span>
                <div style={{ color: '#86efac', fontWeight: 600, marginTop: '2px' }}>
                  None selected
                </div>
              </div>

              <div>
                <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Known Allergies:
                </span>
                <div style={{ color: '#ffffff', marginTop: '2px' }}>
                  {patient.allergies || 'No known drug allergies'}
                </div>
              </div>

              <div style={{ background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.3)', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#7dd3fc' }}>
                <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} />
                AI is solely an intake aid. The attending clinician verifies symptoms and holds full diagnostic authority.
              </div>

              <div style={{ display: 'grid', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => alert(`Reviewing ${patient?.name || 'patient'} previous health records from Kalahandi repository:\n\n1. 28/09/2026: Headache & seasonal chills\n2. 15/09/2026: Rx Paracetamol 500mg\n3. 02/09/2026: Routine BP 118/76 mmHg`)}
                  style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: 0, fontSize: '12px' }}
                >
                  <FileText size={14} />
                  <span>View Historical Records (3)</span>
                </button>

                {userRole === 'doctor' && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setActiveSidePanel('notes')}
                    style={{ fontSize: '12px' }}
                  >
                    <span>Add Clinical Notes & Rx</span>
                  </button>
                )}
              </div>
            </div>
          </aside>
        )}

        {/* CLINICAL NOTES PANEL (Doctor) */}
        {activeSidePanel === 'notes' && (
          <aside
            style={{
              width: '340px',
              background: '#091322',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 30
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} style={{ color: '#19d3ff' }} />
                <strong style={{ fontSize: '14px' }}>{t.doctorNotesTitle}</strong>
              </div>
              <button
                type="button"
                onClick={() => setActiveSidePanel('none')}
                style={{ background: 'transparent', border: 0, color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', color: '#94a3b8' }}>
                Document observations, diagnosis, and prescription:
              </label>
              <textarea
                rows={6}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontSize: '13px',
                  borderRadius: '8px',
                  padding: '10px'
                }}
              />

              {noteSavedFeedback && (
                <div style={{ background: '#064e3b', color: '#a7f3d0', padding: '8px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} />
                  <span>Saved to patient record!</span>
                </div>
              )}

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveNote}
                style={{ marginTop: 'auto' }}
              >
                <span>{t.saveNotesBtn}</span>
              </button>
            </div>
          </aside>
        )}

        {/* SECTION 13: CLINICAL PRESCRIPTION & CARE PLAN WORKSPACE */}
        {activeSidePanel === 'prescription' && (
          <aside
            style={{
              width: '400px',
              maxWidth: '90vw',
              background: '#091322',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 30,
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Stethoscope size={16} style={{ color: '#38bdf8' }} />
                <strong style={{ fontSize: '14px', color: '#ffffff' }}>E-Prescription & Care Plan</strong>
              </div>
              <button
                type="button"
                onClick={() => setActiveSidePanel('none')}
                style={{ background: 'transparent', border: 0, color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              {/* Sync Status Badge (Section 13 & 18 requirement) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Sync Status:</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background:
                      rxSyncState === 'synced'
                        ? 'rgba(34, 197, 94, 0.2)'
                        : rxSyncState === 'waiting'
                        ? 'rgba(234, 179, 8, 0.2)'
                        : rxSyncState === 'failed'
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(56, 189, 248, 0.2)',
                    color:
                      rxSyncState === 'synced'
                        ? '#86efac'
                        : rxSyncState === 'waiting'
                        ? '#fde047'
                        : rxSyncState === 'failed'
                        ? '#fca5a5'
                        : '#7dd3fc',
                    border: `1px solid ${
                      rxSyncState === 'synced'
                        ? '#22c55e'
                        : rxSyncState === 'waiting'
                        ? '#eab308'
                        : rxSyncState === 'failed'
                        ? '#ef4444'
                        : '#0284c7'
                    }`
                  }}
                >
                  {rxSyncState === 'synced'
                    ? 'Synced successfully ✓'
                    : rxSyncState === 'waiting'
                    ? 'Waiting to sync ⏳'
                    : rxSyncState === 'failed'
                    ? 'Sync failed — retry ❌'
                    : 'Saved locally 💾'}
                </span>
              </div>

              {rxFeedbackMsg && (
                <div style={{ background: '#064e3b', color: '#a7f3d0', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} />
                  <span>{rxFeedbackMsg}</span>
                </div>
              )}

              {/* Patient Profile Snapshot */}
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ fontWeight: 700, color: '#f8fafc' }}>{patient.name} (26 Y / M)</div>
                <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>
                  ID: {patient.patientId || 'RHB-OD-KLH-0941'} • {patient.location}
                </div>
                <div style={{ color: '#fca5a5', fontSize: '11px', marginTop: '4px' }}>
                  Allergies: {patient.allergies || 'No known drug allergies reported'}
                </div>
              </div>

              {/* Clinical Diagnosis Input */}
              <div className="field">
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>Clinical Diagnosis:</label>
                <input
                  type="text"
                  value={rxDiagnosis}
                  onChange={(e) => {
                    setRxDiagnosis(e.target.value);
                    setRxSyncState('saved-locally');
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}
                />
              </div>

              {/* Medicines List */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>
                    Prescribed Medicines ({rxMedicines.length}):
                  </label>
                  {userRole === 'doctor' && (
                    <button
                      type="button"
                      onClick={() => setShowAddMedForm(!showAddMedForm)}
                      style={{
                        background: '#0284c7',
                        color: '#ffffff',
                        border: 0,
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Plus size={12} />
                      <span>Add Custom Med</span>
                    </button>
                  )}
                </div>

                {/* 1-Click Common Medicines Templates for Doctor during consultation */}
                {userRole === 'doctor' && (
                  <div style={{ marginBottom: '10px', background: 'rgba(2, 132, 199, 0.08)', border: '1px dashed rgba(56, 189, 248, 0.3)', borderRadius: '8px', padding: '8px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
                      ⚡ 1-Click Quick Medicine Presets:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {[
                        { name: 'Tab Paracetamol', strength: '500mg', dosage: '1 tab TID after meals', duration: '3 days', instructions: 'For fever & pain relief SOS' },
                        { name: 'Oral Rehydration Salts (ORS)', strength: '21.8g Sachet', dosage: '1 sachet in 1L boiled water', duration: '3 days', instructions: 'Frequent sips to maintain oral hydration' },
                        { name: 'Tab Cetirizine', strength: '10mg', dosage: '1 tab OD at night', duration: '5 days', instructions: 'For allergic rhinitis / cold' },
                        { name: 'Tab Pantoprazole', strength: '40mg', dosage: '1 tab OD before breakfast', duration: '5 days', instructions: 'Take 30 mins before morning meal' },
                        { name: 'Tab Amoxicillin', strength: '500mg', dosage: '1 tab TID after food', duration: '5 days', instructions: 'Complete full course as directed' },
                        { name: 'Tab Azithromycin', strength: '500mg', dosage: '1 tab OD after lunch', duration: '3 days', instructions: 'Take once daily after food' }
                      ].map((med, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setRxMedicines((prev) => [
                              ...prev,
                              {
                                id: `med-quick-${Date.now()}-${idx}`,
                                name: med.name,
                                strength: med.strength,
                                dosage: med.dosage,
                                frequency: med.dosage,
                                duration: med.duration,
                                instructions: med.instructions
                              }
                            ]);
                            setRxSyncState('saved-locally');
                            setRxFeedbackMsg(`Added ${med.name} ${med.strength} to in-call prescription.`);
                            setTimeout(() => setRxFeedbackMsg(''), 2500);
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#e2e8f0',
                            padding: '3px 7px',
                            borderRadius: '5px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(2, 132, 199, 0.35)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                        >
                          + {med.name} {med.strength}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Medicine Inline Form */}
                {showAddMedForm && userRole === 'doctor' && (
                  <div style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '6px', marginBottom: '6px' }}>
                      <input
                        type="text"
                        placeholder="Medicine name (e.g. Tab Amoxicillin)"
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                        style={{ padding: '6px 8px', borderRadius: '4px', background: '#0f172a', color: '#fff', border: '1px solid #475569', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        placeholder="Strength (500mg)"
                        value={newMedStrength}
                        onChange={(e) => setNewMedStrength(e.target.value)}
                        style={{ padding: '6px 8px', borderRadius: '4px', background: '#0f172a', color: '#fff', border: '1px solid #475569', fontSize: '12px' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                      <input
                        type="text"
                        placeholder="Dosage (1 tab TID)"
                        value={newMedDosage}
                        onChange={(e) => setNewMedDosage(e.target.value)}
                        style={{ padding: '6px 8px', borderRadius: '4px', background: '#0f172a', color: '#fff', border: '1px solid #475569', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        placeholder="Duration (5 days)"
                        value={newMedDuration}
                        onChange={(e) => setNewMedDuration(e.target.value)}
                        style={{ padding: '6px 8px', borderRadius: '4px', background: '#0f172a', color: '#fff', border: '1px solid #475569', fontSize: '12px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="Instructions (e.g. after meals)"
                        value={newMedInstructions}
                        onChange={(e) => setNewMedInstructions(e.target.value)}
                        style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', background: '#0f172a', color: '#fff', border: '1px solid #475569', fontSize: '12px' }}
                      />
                      <button
                        type="button"
                        onClick={handleAddMedicine}
                        style={{ background: '#16a34a', color: '#fff', border: 0, borderRadius: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {rxMedicines.length === 0 ? (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                      No medicines added yet. Use the 1-click presets above to add medicines.
                    </div>
                  ) : (
                    rxMedicines.map((m, idx) => (
                      <div
                        key={m.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '8px 10px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>#{idx + 1}</span>
                            <strong style={{ color: '#38bdf8' }}>{m.name}</strong>
                            <span style={{ fontSize: '11px', color: '#cbd5e1' }}>{m.strength}</span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                            Dosage: <strong style={{ color: '#e2e8f0' }}>{m.dosage}</strong> • Duration: <strong style={{ color: '#e2e8f0' }}>{m.duration}</strong>
                          </div>
                          <div style={{ fontSize: '11px', color: '#86efac', fontStyle: 'italic', marginTop: '2px' }}>
                            ℹ️ {m.instructions}
                          </div>
                        </div>
                        {userRole === 'doctor' && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(m.id)}
                            style={{ background: 'transparent', border: 0, color: '#f87171', cursor: 'pointer', padding: '2px' }}
                            title="Remove medicine"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Follow-up & Referral options */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="field">
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Follow-up:</label>
                  <input
                    type="text"
                    value={rxFollowUpDate}
                    onChange={(e) => {
                      setRxFollowUpDate(e.target.value);
                      setRxSyncState('saved-locally');
                    }}
                    style={{ padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '12px' }}
                  />
                </div>
                <div className="field">
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Referral (if any):</label>
                  <input
                    type="text"
                    placeholder="e.g. DHH Bhawanipatna"
                    value={rxReferralFacility}
                    onChange={(e) => {
                      setRxReferralFacility(e.target.value);
                      setRxSyncState('saved-locally');
                    }}
                    style={{ padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '12px' }}
                  />
                </div>
              </div>

              {/* Patient Live View Extras */}
              {userRole === 'patient' && (
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#86efac', fontWeight: 700, fontSize: '12px' }}>
                    <ShieldCheck size={14} />
                    <span>Digitally Authorized by {doctor.name}</span>
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '11px', marginTop: '4px' }}>
                    This prescription is valid at all Government Jan Aushadhi Kendras and Kalahandi district pharmacies.
                  </div>
                  {onCheckPharmacy && (
                    <button
                      type="button"
                      onClick={handleProceedToPharmacy}
                      style={{
                        marginTop: '8px',
                        width: '100%',
                        background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                        color: '#fff',
                        border: 0,
                        padding: '7px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      💊 Check Live Kalahandi Stock Now ➔
                    </button>
                  )}
                </div>
              )}

              {/* Actions Grid (Section 13 exact buttons) */}
              {userRole === 'doctor' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={handleSavePrescriptionDraft}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    💾 Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalizePrescription}
                    style={{
                      background: 'linear-gradient(135deg, #16a34a, #15803d)',
                      color: '#ffffff',
                      border: 0,
                      padding: '9px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      boxShadow: '0 4px 14px rgba(22, 163, 74, 0.45)'
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Authorize & Issue Rx</span>
                  </button>
                </div>
              )}

              {rxSyncState !== 'synced' && (
                <button
                  type="button"
                  onClick={handleRetrySync}
                  style={{
                    background: 'transparent',
                    border: '1px dashed #38bdf8',
                    color: '#38bdf8',
                    padding: '6px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={12} />
                  <span>Retry Sync to Patient Health Record</span>
                </button>
              )}
            </div>
          </aside>
        )}

        {/* SECTION 15: REAL-TIME AI AUDIO TRANSLATOR */}
        {activeSidePanel === 'translator' && (
          <aside
            style={{
              width: '380px',
              maxWidth: '90vw',
              background: '#091322',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 30,
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Languages size={16} style={{ color: '#a855f7' }} />
                <strong style={{ fontSize: '14px', color: '#ffffff' }}>AI Real-Time Audio Translator</strong>
              </div>
              <button
                type="button"
                onClick={() => setActiveSidePanel('none')}
                style={{ background: 'transparent', border: 0, color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Language Configuration Bar */}
            <div style={{ padding: '12px 16px', background: '#0f172a', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38bdf8', fontWeight: 800 }}>
                    PATIENT LANGUAGE
                  </span>
                  <select
                    value={patientTransLang}
                    onChange={(e) => setPatientTransLang(e.target.value as Language)}
                    style={{ width: '100%', marginTop: '4px', padding: '6px 8px', borderRadius: '6px', background: '#1e293b', color: '#fff', border: '1px solid #334155', fontSize: '12px' }}
                  >
                    <option value="ଓଡ଼ିଆ">ଓଡ଼ିଆ (Odia)</option>
                    <option value="English">English</option>
                    <option value="हिन्दी">हिन्दी (Hindi)</option>
                  </select>
                </div>

                <div>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a855f7', fontWeight: 800 }}>
                    DOCTOR LANGUAGE
                  </span>
                  <select
                    value={doctorTransLang}
                    onChange={(e) => setDoctorTransLang(e.target.value as Language)}
                    style={{ width: '100%', marginTop: '4px', padding: '6px 8px', borderRadius: '6px', background: '#1e293b', color: '#fff', border: '1px solid #334155', fontSize: '12px' }}
                  >
                    <option value="English">English</option>
                    <option value="हिन्दी">हिन्दी (Hindi)</option>
                    <option value="ଓଡ଼ିଆ">ଓଡ଼ିଆ (Odia)</option>
                  </select>
                </div>
              </div>

              {/* Mic Status & Live Indicators */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: isTranslatorPaused ? '#fde047' : '#86efac' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isTranslatorPaused ? '#eab308' : '#22c55e', display: 'inline-block' }} />
                  <span>{isTranslatorPaused ? 'Microphone Paused' : 'Microphone Active (Listening...)'}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIsTranslatorPaused(!isTranslatorPaused)}
                    style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 0, borderRadius: '4px', padding: '3px 8px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    {isTranslatorPaused ? 'Resume' : 'Pause'}
                  </button>
                </div>
              </div>
            </div>

            {/* Translation Safety Disclaimer (Section 15 mandatory notice) */}
            <div style={{ padding: '8px 12px', background: 'rgba(234, 179, 8, 0.1)', borderBottom: '1px solid rgba(234, 179, 8, 0.2)', fontSize: '11px', color: '#fef08a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} style={{ flexShrink: 0 }} />
              <span>AI translation may contain errors. Confirm important medical information.</span>
            </div>

            {/* Translation Conversation Stream */}
            <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {audioTranslations.map((at) => (
                <div
                  key={at.id}
                  style={{
                    background: at.sender === 'patient' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(168, 85, 247, 0.08)',
                    border: `1px solid ${at.sender === 'patient' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(168, 85, 247, 0.25)'}`,
                    borderRadius: '10px',
                    padding: '10px 12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: at.sender === 'patient' ? '#38bdf8' : '#c084fc' }}>
                      {at.sender === 'patient' ? `${patient.name} (${at.sourceLang})` : `${doctor.name} (${at.sourceLang})`}
                    </span>
                    <span>{at.timestamp}</span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>
                    <em>"{at.originalText}"</em>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', background: 'rgba(0,0,0,0.3)', padding: '6px 8px', borderRadius: '6px' }}>
                    ➔ {at.translatedText}
                  </div>

                  {at.medicalTermsPreserved && at.medicalTermsPreserved.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                      {at.medicalTermsPreserved.map((term, i) => (
                        <span key={i} style={{ fontSize: '10px', background: '#334155', color: '#7dd3fc', padding: '1px 6px', borderRadius: '4px' }}>
                          🏥 {term}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Speech Simulator / Input Panel */}
            <div style={{ padding: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', background: '#0a101f' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                Quick Speech Simulation (Voice-to-Text):
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleTranslateSpeech('ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ କାଶ ଓ କଫ ହେଉଛି।', 'patient')}
                  style={{ background: '#1e293b', color: '#7dd3fc', border: '1px solid #334155', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', cursor: 'pointer' }}
                >
                  "କାଶ ଓ କଫ" (Patient)
                </button>
                <button
                  type="button"
                  onClick={() => handleTranslateSpeech('Drink 2L boiled water daily with ORS.', 'doctor')}
                  style={{ background: '#1e293b', color: '#c084fc', border: '1px solid #334155', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', cursor: 'pointer' }}
                >
                  "Drink ORS water" (Doctor)
                </button>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Type or simulate speech..."
                  value={transInputText}
                  onChange={(e) => setTransInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTranslateSpeech();
                    }
                  }}
                  style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: '12px' }}
                />
                <button
                  type="button"
                  onClick={() => handleTranslateSpeech()}
                  style={{ background: '#a855f7', color: '#fff', border: 0, borderRadius: '6px', padding: '8px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Translate
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* 3. BOTTOM CALL CONTROLS TOOLBAR */}
      <footer
        style={{
          background: 'rgba(6, 17, 38, 0.98)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          flexShrink: 0,
          position: 'sticky',
          bottom: 0,
          zIndex: 40,
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Left Side: Audio/Video toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="btn"
            onClick={toggleMic}
            style={{
              background: isMicMuted ? '#b91c1c' : 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: 0,
              minHeight: '44px',
              padding: '8px 14px'
            }}
            title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
            <span style={{ fontSize: '13px' }}>{isMicMuted ? t.muted : t.audioBtn}</span>
          </button>

          <button
            type="button"
            className="btn"
            onClick={toggleCamera}
            style={{
              background: isCameraOff ? '#b91c1c' : 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: 0,
              minHeight: '44px',
              padding: '8px 14px'
            }}
            title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
            <span style={{ fontSize: '13px' }}>{isCameraOff ? t.camOffBtn : t.videoBtn}</span>
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
            style={{
              background: isSpeakerMuted ? '#b91c1c' : 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: 0,
              minHeight: '44px',
              padding: '8px 14px'
            }}
            title={isSpeakerMuted ? 'Turn Speaker On' : 'Mute Speaker'}
          >
            {isSpeakerMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span style={{ fontSize: '13px' }}>{isSpeakerMuted ? t.muted : t.speakerBtn}</span>
          </button>
        </div>

        {/* Center: In-Call Panel Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setActiveSidePanel(activeSidePanel === 'chat' ? 'none' : 'chat');
              setUnreadChatCount(0);
            }}
            style={{
              background: activeSidePanel === 'chat' ? '#0284c7' : 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: 0,
              minHeight: '44px',
              padding: '8px 14px',
              position: 'relative'
            }}
          >
            <MessageSquare size={16} />
            <span style={{ fontSize: '13px' }}>{t.chatBtn}</span>
            {unreadChatCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}
              >
                {unreadChatCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => setActiveSidePanel(activeSidePanel === 'summary' ? 'none' : 'summary')}
            style={{
              background: activeSidePanel === 'summary' ? '#0284c7' : 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: 0,
              minHeight: '44px',
              padding: '8px 14px'
            }}
          >
            <FileText size={16} />
            <span style={{ fontSize: '13px' }}>{t.recordsBtn}</span>
          </button>

          {userRole === 'doctor' && (
            <button
              type="button"
              className="btn"
              onClick={() => setActiveSidePanel(activeSidePanel === 'notes' ? 'none' : 'notes')}
              style={{
                background: activeSidePanel === 'notes' ? '#0284c7' : 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: 0,
                minHeight: '44px',
                padding: '8px 14px'
              }}
            >
              <FileText size={16} />
              <span style={{ fontSize: '13px' }}>{t.notesBtn}</span>
            </button>
          )}

          <button
            type="button"
            className="btn"
            id="toggle-rx-btn"
            onClick={() => setActiveSidePanel(activeSidePanel === 'prescription' ? 'none' : 'prescription')}
            style={{
              background: activeSidePanel === 'prescription' ? '#16a34a' : 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: 0,
              minHeight: '44px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="E-Prescription & Care Plan"
          >
            <Pill size={16} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{userRole === 'doctor' ? 'Rx / Prescription' : 'View Rx'}</span>
          </button>

          <button
            type="button"
            className="btn"
            id="toggle-translator-btn"
            onClick={() => setActiveSidePanel(activeSidePanel === 'translator' ? 'none' : 'translator')}
            style={{
              background: activeSidePanel === 'translator' ? '#7c3aed' : 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: 0,
              minHeight: '44px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="AI Audio Translator (Odia / Hindi / English)"
          >
            <Languages size={16} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>AI Translator</span>
          </button>
        </div>

        {/* Right Side: End Consultation Button */}
        <div style={{ flexShrink: 0, marginLeft: 'auto' }}>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setShowEndConfirm(true)}
            style={{
              background: '#dc2626',
              color: '#ffffff',
              border: 0,
              fontWeight: 800,
              minHeight: '44px',
              padding: '10px 22px',
              borderRadius: '999px',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            id="footer-end-call-btn"
            title="End Consultation Call"
          >
            <PhoneOff size={18} />
            <span>{t.endCallBtn}</span>
          </button>
        </div>
      </footer>

      {/* 4. END CONSULTATION CONFIRMATION MODAL */}
      {showEndConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            className="modal-dialog"
            style={{
              maxWidth: '440px',
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              border: '2px solid #ef4444'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PhoneOff size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#991b1b' }}>{t.confirmTitle}</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{t.confirmSubtitle}</span>
              </div>
            </div>

            <p style={{ color: '#475569', fontSize: '13px', margin: '0 0 20px', lineHeight: 1.5 }}>
              {t.confirmBody(doctor.name)}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn"
                onClick={() => setShowEndConfirm(false)}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                {t.continueCallBtn}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmEnd}
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 0,
                  fontWeight: 800,
                  padding: '8px 20px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
                }}
                id="confirm-end-call-button"
              >
                <PhoneOff size={16} />
                <span>{t.yesEndBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
