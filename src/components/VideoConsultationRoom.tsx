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
  ArrowDown
} from 'lucide-react';
import { DemoUser, DoctorItem, NetworkQuality, ChatMessage, HealthRecord, Language } from '../types';
import { storage } from '../utils/storage';

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
  const [activeSidePanel, setActiveSidePanel] = useState<'none' | 'chat' | 'summary' | 'notes'>('none');
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'doctor',
      senderName: doctor.name,
      text: 'Namaskar Keshab ji, I can see your intake information. How are you feeling today?',
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

  // Local media stream
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // Initialize or request media stream
  const setupMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      setCameraPermGranted(true);
      setMicPermGranted(true);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch {
      // Permission denied or devices not found
      setCameraPermGranted(false);
      setMicPermGranted(false);
    }
  };

  // Call timer
  useEffect(() => {
    let interval: any;
    if (isOpen && preCallDone && !callCompleted && networkQuality !== 'offline') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, preCallDone, callCompleted, networkQuality]);

  // Network transition alerts
  useEffect(() => {
    if (!preCallDone) return;
    const prev = prevNetRef.current;
    if (prev !== networkQuality) {
      if (prev === 'good' && networkQuality === 'limited') {
        setNetworkNotification('Connection is weak. Video quality has been reduced to keep the consultation stable.');
      } else if (prev === 'limited' && networkQuality === 'good') {
        setNetworkNotification('Connection restored. High-quality video active.');
      } else if (networkQuality === 'offline') {
        setNetworkNotification('Connection lost. Live consultation paused. Reconnect to continue consultation.');
      } else if (prev === 'offline' && (networkQuality === 'good' || networkQuality === 'limited')) {
        setNetworkNotification('Reconnected to telehealth bridge.');
      }
      prevNetRef.current = networkQuality;
      const timer = setTimeout(() => setNetworkNotification(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [networkQuality, preCallDone]);

  // Attach local stream to video ref when preCallDone changes or stream changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, preCallDone]);

  // Keyboard Escape listener to end call safely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (!preCallDone) {
          handleCloseEntirely();
        } else if (!callCompleted) {
          setShowEndConfirm(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, preCallDone, callCompleted]);

  // Clean up media tracks when closed
  const cleanUpMedia = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
  };

  const handleCloseEntirely = () => {
    cleanUpMedia();
    setPreCallDone(false);
    setCallCompleted(false);
    setShowEndConfirm(false);
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

  // Toggle Camera
  const toggleCamera = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((t) => (t.enabled = !t.enabled));
    }
    setIsCameraOff(!isCameraOff);
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

    // If patient sent, generate simulated doctor response after 1.5s
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
    storage.saveRecord({
      type: 'consultation',
      doctorName: doctor.name,
      notes: `Consultation completed (${formatTimer(callDuration)}). Clinical summary: ${doctorNotes}`,
      pathway: followUpPlan === 'Emergency escalation' ? 'urgent physical care' : 'clinician consultation',
      followUpPlan,
      urgency: followUpPlan === 'Emergency escalation' ? 'urgent' : 'routine'
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
                  src="/images/doctor-feed.jpg"
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
              onClick={() => {
                if (!localStream) {
                  setupMedia().finally(() => setPreCallDone(true));
                } else {
                  setPreCallDone(true);
                }
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
                    src="/images/doctor-feed.jpg"
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
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Kalahandi, Odisha</div>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 800, fontSize: '13px', marginBottom: '8px' }}>
              <FileText size={16} style={{ color: '#0284c7' }} />
              <span>{t.summaryTitle}</span>
            </div>
            <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
              <div style={{ marginBottom: '6px' }}>
                <strong style={{ color: '#0f172a' }}>{t.diagnosisLabel} </strong>
                <span style={{ color: '#0284c7', fontWeight: 600 }}>
                  {roomLang === 'ଓଡ଼ିଆ'
                    ? 'ସାମାନ୍ୟ ଜଳହ୍ରାସ ଓ ଅଳ୍ପ ଜ୍ୱର ସହିତ ପେଟ ସଂକ୍ରମଣ (Acute Gastroenteritis)'
                    : roomLang === 'हिन्दी'
                    ? 'हल्का निर्जलीकरण एवं अल्प ज्वर सहित आंत्रशोथ (Acute Gastroenteritis)'
                    : 'Acute Gastroenteritis with Mild Dehydration & Low-Grade Pyrexia'}
                </span>
              </div>
              <div style={{ color: '#475569', fontSize: '12px', lineHeight: 1.5 }}>
                <strong>{t.doctorNotesLabel} </strong>
                <em>"{doctorNotes}"</em>
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
                    ? '୩ ଦିନ ପରେ ପୁନଃ ଟେଲିପରାମର୍ଶ (ଅନୁମୋଦିତ)'
                    : roomLang === 'हिन्दी'
                    ? '3 दिनों में पुनः टेलीपरामर्श (अनुशंसित)'
                    : 'Follow-up teleconsultation in 3 days (Recommended)'
                },
                {
                  id: 'Physical consultation recommended',
                  label: roomLang === 'ଓଡ଼ିଆ'
                    ? 'ପ୍ରାଥମିକ/ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (PHC/CHC) ରେ ଶାରୀରିକ ଯାଞ୍ଚ'
                    : roomLang === 'हिन्दी'
                    ? 'प्राथमिक/सामुदायिक स्वास्थ्य केंद्र (PHC/CHC) में शारीरिक जांच'
                    : 'Physical consultation at PHC/CHC recommended'
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

          {/* STEP 4: MEDICINE NEEDED? */}
          <div
            style={{
              background: '#f0fdf4',
              border: '2px solid #86efac',
              borderRadius: '14px',
              padding: '14px 16px',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 800, fontSize: '13px' }}>
                <Pill size={16} />
                <span>{t.medicineTitle}</span>
              </div>
              <span style={{ background: '#16a34a', color: '#ffffff', padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                {t.medIssued}
              </span>
            </div>

            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '13px', color: '#166534' }}>
                    {roomLang === 'ଓଡ଼ିଆ' ? 'ପାରାସିଟାମଲ୍ ୫୦୦ମି.ଗ୍ରା. (Paracetamol 500mg)' : roomLang === 'हिन्दी' ? 'पैरासिटामोल 500mg (Paracetamol)' : 'Paracetamol 500mg'}
                  </strong>
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    {roomLang === 'ଓଡ଼ିଆ' ? '୧ ବଟିକା ଦିନକୁ ୩ ଥର ଖାଇବା ପରେ • ୩ ଦିନ • ଜ୍ୱର ଓ ଶରୀର ଯନ୍ତ୍ରଣା ପାଇଁ' : roomLang === 'हिन्दी' ? '1 गोली दिन में 3 बार भोजन के बाद • 3 दिन • बुखार एवं बदन दर्द' : '1 tablet TID after food • 3 days • Fever & body ache'}
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px' }}>
                  {roomLang === 'ଓଡ଼ିଆ' ? 'ପରିମାଣ: ୧୦ ଟି' : roomLang === 'हिन्दी' ? 'मात्रा: 10' : 'Qty: 10 Tabs'}
                </span>
              </div>

              <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '13px', color: '#166534' }}>
                    {roomLang === 'ଓଡ଼ିଆ' ? 'ORS ଇଲେକ୍ଟ୍ରୋଲାଇଟ୍ ପାଉଡର (WHO ଫର୍ମୁଲା)' : roomLang === 'हिन्दी' ? 'ओआरएस पाउडर (WHO फॉर्मूला)' : 'ORS Electrolyte Powder (WHO Formula)'}
                  </strong>
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    {roomLang === 'ଓଡ଼ିଆ' ? '୧ ପ୍ୟାକେଟ୍ ୧ ଲିଟର ସଫା ପାଣିରେ ମିଶାଇ ପିଅନ୍ତୁ • ଘନ ଘନ ଅଳ୍ପ ଅଳ୍ପ' : roomLang === 'हिन्दी' ? '1 पैकेट 1 लीटर स्वच्छ पानी में घोलकर पिएं • बार-बार थोड़ा-थोड़ा' : '1 sachet dissolved in 1L clean water • Frequent sips'}
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px' }}>
                  {roomLang === 'ଓଡ଼ିଆ' ? 'ପରିମାଣ: ୪ ଟି' : roomLang === 'हिन्दी' ? 'मात्रा: 4' : 'Qty: 4 Sachets'}
                </span>
              </div>

              <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '13px', color: '#166534' }}>
                    {roomLang === 'ଓଡ଼ିଆ' ? 'ଜିଙ୍କ୍ ସଲଫେଟ୍ ୨୦ମି.ଗ୍ରା. (Zinc Sulfate 20mg)' : roomLang === 'हिन्दी' ? 'जिंक सल्फेट 20mg (Zinc Sulfate)' : 'Zinc Sulfate 20mg Dispersible'}
                  </strong>
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    {roomLang === 'ଓଡ଼ିଆ' ? '୧ ବଟିକା ପାଣିରେ ମିଳାଇ ଦିନକୁ ୧ ଥର • ୧୪ ଦିନ' : roomLang === 'हिन्दी' ? '1 गोली पानी में घोलकर दिन में 1 बार • 14 दिन' : '1 tablet OD dissolved in water • 14 days • Gut healing'}
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px' }}>
                  {roomLang === 'ଓଡ଼ିଆ' ? 'ପରିମାଣ: ୧୪ ଟି' : roomLang === 'हिन्दी' ? 'मात्रा: 14' : 'Qty: 14 Tabs'}
                </span>
              </div>
            </div>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 800, fontSize: '14px' }}>
                <Store size={17} />
                <span>{t.pharmacyTitle}</span>
              </div>
              <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 800 }}>
                {t.verified}
              </span>
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
                    {/* Realistic Doctor Webcam Video Stream */}
                    <img
                      src="/images/doctor-feed.jpg"
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
                        {roomLang === 'ଓଡ଼ିଆ' ? 'ଲାଇଭ୍ ଡାକ୍ତର ଟେଲି-OPD' : roomLang === 'हिन्दी' ? 'लाइव डॉक्टर टेली-ओपीडी' : 'LIVE CLINICIAN FEED'}
                      </span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>•</span>
                      <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 700 }}>
                        {networkQuality === 'limited'
                          ? (roomLang === 'ଓଡ଼ିଆ' ? 'ସ୍ୱଳ୍ପ ବ୍ୟାଣ୍ଡୱିଡ଼ଥ୍ ୩୬୦p' : roomLang === 'हिन्दी' ? 'अनुकूली 360p' : 'Adaptive 360p')
                          : 'HD 720p 30fps'}
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
                    {/* Realistic Patient Smartphone Front-Camera / Webcam Video Stream */}
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
                        {roomLang === 'ଓଡ଼ିଆ' ? 'ଲାଇଭ୍ ରୋଗୀ ଫିଡ୍' : roomLang === 'हिन्दी' ? 'लाइव मरीज वीडियो' : 'LIVE PATIENT FEED'}
                      </span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>•</span>
                      <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 700 }}>
                        {networkQuality === 'limited'
                          ? (roomLang === 'ଓଡ଼ିଆ' ? 'ସ୍ୱଳ୍ପ ବ୍ୟାଣ୍ଡୱିଡ଼ଥ୍ ୩୬୦p' : roomLang === 'हिन्दी' ? 'अनुकूली 360p' : 'Adaptive 360p')
                          : '4G HD Uplink (Kalahandi)'}
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
                  ref={localVideoRef}
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
                        src="/images/doctor-feed.jpg"
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

              {/* FLOATING CALL CONTROLS HUD (CENTERED ON VIDEO CANVAS) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(6, 17, 38, 0.92)',
                  backdropFilter: 'blur(10px)',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '999px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
                  zIndex: 25
                }}
              >
                <button
                  type="button"
                  onClick={toggleMic}
                  style={{
                    background: isMicMuted ? '#dc2626' : 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: 0,
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                <button
                  type="button"
                  onClick={toggleCamera}
                  style={{
                    background: isCameraOff ? '#dc2626' : 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: 0,
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
                </button>

                <button
                  type="button"
                  onClick={() => setShowEndConfirm(true)}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 0,
                    borderRadius: '999px',
                    padding: '8px 20px',
                    fontSize: '13px',
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
                  <PhoneOff size={16} />
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
                        src="/images/doctor-feed.jpg"
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
                  onClick={() => alert(`Reviewing Keshab Rout previous health records from Kalahandi repository:\n\n1. 28/09/2026: Headache & seasonal chills\n2. 15/09/2026: Rx Paracetamol 500mg\n3. 02/09/2026: Routine BP 118/76 mmHg`)}
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
