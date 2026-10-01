import React, { useState } from 'react';
import {
  X,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  Calendar,
  FileText,
  Activity,
  Heart,
  HelpCircle,
  MapPin,
  Share2
} from 'lucide-react';
import { WarningSignId, CareCategory, Language } from '../types';
import { storage } from '../utils/storage';

interface CareUrgencyCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  onNavigateToQueue: () => void;
  onNavigateToEmergency: () => void;
  onNavigateToFacilities: () => void;
}

interface SymptomOption {
  en: string;
  or: string;
  hi: string;
}

const SYMPTOM_OPTIONS: SymptomOption[] = [
  { en: 'Fever', or: 'ଜ୍ୱର', hi: 'बुखार' },
  { en: 'Cough', or: 'କାଶ', hi: 'खांसी' },
  { en: 'Cold', or: 'ଥଣ୍ଡା / ସର୍ଦ୍ଦି', hi: 'सर्दी / जुकाम' },
  { en: 'Pain / Body ache', or: 'ଦେହ ଯନ୍ତ୍ରଣା / ମୁଣ୍ଡବିନ୍ଧା', hi: 'बदन दर्द / सिरदर्द' },
  { en: 'Weakness', or: 'ଦୁର୍ବଳତା / କ୍ଳାନ୍ତ', hi: 'कमजोरी / थकान' },
  { en: 'Breathing problem', or: 'ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ', hi: 'सांस लेने में तकलीफ' },
  { en: 'Vomiting', or: 'ବାନ୍ତି', hi: 'उल्टी' },
  { en: 'Diarrhea', or: 'ଝାଡ଼ା', hi: 'दस्त' },
  { en: 'Headache', or: 'ମୁଣ୍ଡ ବିନ୍ଧା', hi: 'सिरदर्द' },
  { en: 'Injury / Cut', or: 'ଆଘାତ / ଖଣ୍ଡିଆ', hi: 'चोट / घाव' },
  { en: 'Skin rash / Itching', or: 'ଚର୍ମ କୁଣ୍ଡେଇ ହେବା', hi: 'खुजली / दाद' },
  { en: 'Mental health / Anxiety', or: 'ମାନସିକ ଚିନ୍ତା / ଭୟ', hi: 'तनाव / घबराहट' },
  { en: 'Other concern', or: 'ଅନ୍ୟାନ୍ୟ ସମସ୍ୟା', hi: 'अन्य समस्या' }
];

const URGENCY_I18N: Record<Language, {
  modalTitle: string;
  modalSub: string;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
  customPlaceholder: string;
  customLabel: string;
  d1: string;
  d2: string;
  d3: string;
  d4: string;
  sMild: string;
  sMod: string;
  sSev: string;
  tWorse: string;
  tSame: string;
  tBetter: string;
  wNo: string;
  wBreathing: string;
  wChest: string;
  wUnconscious: string;
  wBleeding: string;
  wStroke: string;
  principleNotice: string;
  evalBtn: string;
  catETitle: string;
  catEDesc: string;
  catEActions: string;
  call108: string;
  openEmergency: string;
  restartBtn: string;
  catBTitle: string;
  catBDesc: string;
  catBBadge: string;
  catBNotice: string;
  joinQueueBtn: string;
  findFacilityBtn: string;
  recheckBtn: string;
  catATitle: string;
  catADesc: string;
  catABadge: string;
  catANotice: string;
  bookRoutineBtn: string;
  saveNoteBtn: string;
  closeBtn: string;
}> = {
  English: {
    modalTitle: 'Care Urgency Check & Pathway Navigation',
    modalSub: 'AI assists. Doctors decide. • Low / Intermediate / Emergency Screening',
    question1: 'Tell us what is bothering you today:',
    question2: 'How long?',
    question3: 'Severity',
    question4: 'Progression',
    question5: 'Safety Check: Any of these serious warning signs?',
    customLabel: 'Describe other health concern:',
    customPlaceholder: 'e.g. Ear discharge or stomach cramps',
    d1: 'Today (under 24h)',
    d2: '2–3 days',
    d3: '1 week',
    d4: 'More than a week',
    sMild: 'Mild',
    sMod: 'Moderate',
    sSev: 'Severe',
    tWorse: 'Getting worse',
    tSame: 'Same',
    tBetter: 'Improving',
    wNo: '✓ No warning signs present',
    wBreathing: '🚨 Severe difficulty breathing / gasping',
    wChest: '🚨 Severe chest pain / tight pressure',
    wUnconscious: '🚨 Loss of consciousness / fainting',
    wBleeding: '🚨 Severe or uncontrollable bleeding',
    wStroke: '🚨 Sudden face droop / speech slurring',
    principleNotice: 'Clinical Principle: “AI assists. Doctors decide. Do not wait for an online consultation if immediate physical medical care is required.”',
    evalBtn: 'Determine Appropriate Care Pathway',
    catETitle: 'Immediate Medical Attention May Be Required',
    catEDesc: 'Warning: Predefined high-risk warning signs were identified. Routine teleconsultation is STOPPED for your safety.',
    catEActions: 'Recommended Emergency Actions: • Call 108 immediately. • Proceed to District Headquarters Hospital (DHH) Bhawanipatna Emergency Room. • Do not stay alone.',
    call108: 'Call 108 Ambulance',
    openEmergency: 'Open Emergency Center',
    restartBtn: 'Restart Check',
    catBTitle: 'Your Symptoms Need Review by a Healthcare Professional',
    catBDesc: 'Your symptoms require clinical evaluation. Sent to clinician dashboard as Priority Review.',
    catBBadge: 'CATEGORY B — CLINICAL REVIEW',
    catBNotice: 'Navigation result — not a medical diagnosis. A medical officer will review your complaint in the consultation queue.',
    joinQueueBtn: 'Join Priority Doctor Queue',
    findFacilityBtn: 'Find Nearby Facility',
    recheckBtn: 'Re-check',
    catATitle: 'Routine Monitoring & Self-Care Guidance',
    catADesc: 'Based on the information entered, no urgent warning flag was identified by this screening. If symptoms worsen, seek medical care.',
    catABadge: 'CATEGORY A — ROUTINE CARE',
    catANotice: '✓ Recommended: Rest, oral hydration, and routine symptom tracking.\n✓ You can schedule a routine teleconsultation at your convenience.',
    bookRoutineBtn: 'Book Routine Doctor Consult',
    saveNoteBtn: 'Save Health Note',
    closeBtn: 'Close'
  },
  'ଓଡ଼ିଆ': {
    modalTitle: 'ଲକ୍ଷଣ ଯାଞ୍ଚ ଓ ଉପଯୁକ୍ତ ଚିକିତ୍ସା ମାର୍ଗଦର୍ଶନ',
    modalSub: 'AI ସାହାଯ୍ୟ କରେ। ଡାକ୍ତର ନିଷ୍ପତ୍ତି ନିଅନ୍ତି। • ସରଳ/ମଧ୍ୟମ/ଜରୁରୀ ଯାଞ୍ଚ',
    question1: 'ଆଜି ଆପଣଙ୍କର କ’ଣ ଅସୁବିଧା ହେଉଛି ବାଛନ୍ତୁ:',
    question2: 'କେତେ ଦିନ ହେଲା?',
    question3: 'କେତେ ମାତ୍ରାରେ?',
    question4: 'କମୁଛି ନା ବଢୁଛି?',
    question5: 'ସୁରକ୍ଷା ଯାଞ୍ଚ: ଏଥିମଧ୍ୟରୁ କୌଣସି ଜରୁରୀ ସଙ୍କଟ ଲକ୍ଷଣ ଅଛି କି?',
    customLabel: 'ଅନ୍ୟ ସମସ୍ୟା ଲେଖନ୍ତୁ:',
    customPlaceholder: 'ଉଦାହରଣ: କାନ ବିନ୍ଧା ବା ପେଟ କାମୁଡ଼ା',
    d1: 'ଆଜିଠାରୁ (୨୪ ଘଣ୍ଟା ମଧ୍ୟରେ)',
    d2: '୨–୩ ଦିନ',
    d3: '୧ ସପ୍ତାହ',
    d4: 'ସପ୍ତାହରୁ ଅଧିକ',
    sMild: 'ସ୍ୱଳ୍ପ (Mild)',
    sMod: 'ମଧ୍ୟମ (Moderate)',
    sSev: 'ପ୍ରବଳ (Severe)',
    tWorse: 'ବଢ଼ୁଛି (Getting worse)',
    tSame: 'ସମାନ ଅଛି (Same)',
    tBetter: 'କମୁଛି (Improving)',
    wNo: '✓ କୌଣସି ବିପଦଜନକ ଲକ୍ଷଣ ନାହିଁ',
    wBreathing: '🚨 ପ୍ରବଳ ଶ୍ୱାସକ୍ରିୟା କଷ୍ଟ / ନିଶ୍ୱାସ ନେଇ ନପାରିବା',
    wChest: '🚨 ଛାତିରେ ପ୍ରବଳ ଯନ୍ତ୍ରଣା ବା ଚାପ',
    wUnconscious: '🚨 ଅଚେତ ହୋଇଯିବା / ବେହୋସ୍',
    wBleeding: '🚨 ଅତ୍ୟଧିକ ରକ୍ତସ୍ରାବ',
    wStroke: '🚨 ହଠାତ୍ ମୁହଁ ବଙ୍କା ହେବା / କଥା ଅସ୍ପଷ୍ଟ',
    principleNotice: 'ଡାକ୍ତରୀ ନିୟମ: “AI କେବଳ ଲକ୍ଷଣ ବୁଝିବାରେ ସାହାଯ୍ୟ କରେ; ଡାକ୍ତର ହିଁ ଚିକିତ୍ସା ନିଷ୍ପତ୍ତି ନିଅନ୍ତି। ଜରୁରୀ ଅବସ୍ଥାରେ ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ।”',
    evalBtn: 'ଉପଯୁକ୍ତ ଚିକିତ୍ସା ମାର୍ଗ ଜାଣନ୍ତୁ',
    catETitle: 'ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯିବା ଆବଶ୍ୟକ',
    catEDesc: 'ସାବଧାନ: ବିପଦଜନକ ଲକ୍ଷଣ ଚିହ୍ନଟ ହୋଇଛି। ଆପଣଙ୍କ ସୁରକ୍ଷା ପାଇଁ ସାଧାରଣ ଟେଲି-ପରାମର୍ଶ ବନ୍ଦ କରାଗଲା।',
    catEActions: 'ଜରୁରୀ ପଦକ୍ଷେପ: • ତୁରନ୍ତ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଡାକନ୍ତୁ। • ନିକଟସ୍ଥ DHH ଭବାନୀପାଟଣା କାଜୁଆଲିଟିକୁ ଯାଆନ୍ତୁ। • ଏକୁଟିଆ ରୁହନ୍ତୁ ନାହିଁ।',
    call108: '୧୦୮ ଆମ୍ବୁଲାନ୍ସ କଲ୍ କରନ୍ତୁ',
    openEmergency: 'ଜରୁରୀକାଳୀନ ପେନାଲ୍ ଖୋଲନ୍ତୁ',
    restartBtn: 'ପୁନର୍ବାର ଯାଞ୍ଚ କରନ୍ତୁ',
    catBTitle: 'ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନେବା ଆବଶ୍ୟକ',
    catBDesc: 'ଆପଣଙ୍କ ଲକ୍ଷଣ ଡାକ୍ତରଙ୍କ ଦ୍ୱାରା ଯାଞ୍ଚ ହେବା ଆବଶ୍ୟକ। ପ୍ରାଥମିକତା ଭିତ୍ତିରେ ଡାକ୍ତରୀ କ୍ୟୁରେ ଯୋଡ଼ାଗଲା।',
    catBBadge: 'ବର୍ଗ B — ଡାକ୍ତରୀ ପରାମର୍ଶ (AMBER)',
    catBNotice: 'ଏହା ଚିକିତ୍ସା ନିଷ୍ପତ୍ତି ନୁହେଁ। ଡାକ୍ତର ଆପଣଙ୍କ ଲକ୍ଷଣ ଦେଖି ଔଷଧ ଓ ଉପଦେଶ ଦେବେ।',
    joinQueueBtn: 'ଡାକ୍ତରଙ୍କ ଲାଇଭ୍ କ୍ୟୁରେ ଯୋଗ ଦିଅନ୍ତୁ',
    findFacilityBtn: 'ନିକଟସ୍ଥ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ଖୋଜନ୍ତୁ',
    recheckBtn: 'ପୁଣି ଯାଞ୍ଚ କରନ୍ତୁ',
    catATitle: 'ନିୟମିତ ଯତ୍ନ ଓ ନିରୀକ୍ଷଣ',
    catADesc: 'ଏହି ଯାଞ୍ଚରେ କୌଣସି ଜରୁରୀ ବିପଦ ଲକ୍ଷଣ ମିଳିଲା ନାହିଁ। ଲକ୍ଷଣ ବଢ଼ିଲେ ଡାକ୍ତରଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ।',
    catABadge: 'ବର୍ଗ A — ନିୟମିତ ଯତ୍ନ (GREEN)',
    catANotice: '✓ ଉପଦେଶ: ବିଶ୍ରାମ, ପର୍ଯ୍ୟାପ୍ତ ପାଣି/ଓଆରଏସ ପିଇବା ଏବଂ ତାପମାତ୍ରା ଯାଞ୍ଚ କରିବା।\n✓ ଆପଣ ଆରାମରେ ନିଜ ସମୟ ଅନୁସାରେ ଡାକ୍ତରୀ ପରାମର୍ଶ ନେଇପାରିବେ।',
    bookRoutineBtn: 'ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ ବୁକ୍ କରନ୍ତୁ',
    saveNoteBtn: 'ଅଫଲାଇନ୍ ରେକର୍ଡରେ ସାଇତନ୍ତୁ',
    closeBtn: 'ବନ୍ଦ କରନ୍ତୁ'
  },
  'हिन्दी': {
    modalTitle: 'लक्षण जांच एवं देखभाल मार्गदर्शन',
    modalSub: 'AI सहायता करता है। डॉक्टर निर्णय लेते हैं। • सामान्य / मध्यम / आपातकालीन जांच',
    question1: 'आज आपको क्या परेशानी हो रही है:',
    question2: 'कितने दिनों से?',
    question3: 'गंभीरता',
    question4: 'लक्षण कैसे हैं?',
    question5: 'सुरक्षा जांच: क्या इनमें से कोई गंभीर आपातकालीन लक्षण है?',
    customLabel: 'अन्य समस्या लिखें:',
    customPlaceholder: 'उदा. कान दर्द या पेट में मरोड़',
    d1: 'आज से (२४ घंटे के भीतर)',
    d2: '२–३ दिन',
    d3: '१ सप्ताह',
    d4: 'सप्ताह से अधिक',
    sMild: 'हल्का (Mild)',
    sMod: 'मध्यम (Moderate)',
    sSev: 'गंभीर (Severe)',
    tWorse: 'बढ़ रहा है (Worse)',
    tSame: 'समान है (Same)',
    tBetter: 'सुधर रहा है (Improving)',
    wNo: '✓ कोई गंभीर लक्षण नहीं है',
    wBreathing: '🚨 सांस लेने में अत्यधिक कठिनाई',
    wChest: '🚨 सीने में तेज दर्द या भारी दबाव',
    wUnconscious: '🚨 बेहोशी / अचेत होना',
    wBleeding: '🚨 अनियंत्रित रक्तस्राव',
    wStroke: '🚨 अचानक चेहरे का टेढ़ा होना / बोली लड़खड़ाना',
    principleNotice: 'चिकित्सा सिद्धांत: “AI केवल सहायता करता है; डॉक्टर ही निर्णय लेते हैं। आपातकाल में तुरंत अस्पताल जाएं।”',
    evalBtn: 'उपयुक्त देखभाल मार्ग जानें',
    catETitle: 'तत्काल अस्पताल जाना आवश्यक है',
    catEDesc: 'चेतावनी: गंभीर आपातकालीन लक्षण पाए गए हैं। आपकी सुरक्षा हेतु सामान्य टेली-परामर्श रोक दिया गया है।',
    catEActions: 'आपातकालीन कदम: • तुरंत 108 एम्बुलेंस बुलाएं। • नजदीकी DHH भवानीपटना आपातकालीन कक्ष जाएं। • अकेले न रहें।',
    call108: '108 एम्बुलेंस कॉल करें',
    openEmergency: 'आपातकालीन केंद्र खोलें',
    restartBtn: 'पुनः जांच करें',
    catBTitle: 'चिकित्सक द्वारा समीक्षा की आवश्यकता है',
    catBDesc: 'आपके लक्षणों की जांच डॉक्टर द्वारा की जानी चाहिए। आपको प्राथमिकता के आधार पर डॉक्टर कतार में जोड़ा गया है।',
    catBBadge: 'श्रेणी B — चिकित्सकीय समीक्षा (AMBER)',
    catBNotice: 'यह चिकित्सा निदान नहीं है। परामर्श कतार में डॉक्टर आपके लक्षणों की समीक्षा करेंगे।',
    joinQueueBtn: 'प्राथमिकता डॉक्टर कतार में जुड़ें',
    findFacilityBtn: 'नजदीकी अस्पताल खोजें',
    recheckBtn: 'पुनः जांचें',
    catATitle: 'नियमित देखभाल एवं निगरानी',
    catADesc: 'इस जांच में कोई आपातकालीन खतरे का लक्षण नहीं मिला। यदि लक्षण बिगड़ें तो डॉक्टर से संपर्क करें।',
    catABadge: 'श्रेणी A — नियमित देखभाल (GREEN)',
    catANotice: '✓ सलाह: आराम करें, पर्याप्त ओआरएस/पानी पिएं और लक्षणों की निगरानी रखें।\n✓ आप अपनी सुविधानुसार नियमित परामर्श ले सकते हैं।',
    bookRoutineBtn: 'नियमित डॉक्टर परामर्श बुक करें',
    saveNoteBtn: 'स्वास्थ्य रिकॉर्ड में सहेजें',
    closeBtn: 'बंद करें'
  }
};

export const CareUrgencyCheckModal: React.FC<CareUrgencyCheckModalProps> = ({
  isOpen,
  onClose,
  lang = 'English',
  onNavigateToQueue,
  onNavigateToEmergency,
  onNavigateToFacilities
}) => {
  const [activeLang, setActiveLang] = useState<Language>(lang);
  const [selectedSymptom, setSelectedSymptom] = useState<string>('Fever');
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('2–3 days');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [trend, setTrend] = useState<'Getting worse' | 'Same' | 'Improving'>('Getting worse');
  const [warningSign, setWarningSign] = useState<WarningSignId>('no');
  const [resultCategory, setResultCategory] = useState<CareCategory | null>(null);

  React.useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  if (!isOpen) return null;

  const t = URGENCY_I18N[activeLang] || URGENCY_I18N.English;
  const currentConcern = selectedSymptom === 'Other concern' && customSymptom ? customSymptom : selectedSymptom;

  const handleEvaluate = () => {
    if (warningSign !== 'no' || (selectedSymptom === 'Breathing problem' && severity === 'Severe')) {
      setResultCategory('emergency');
      storage.addAuditLog(`Care Urgency Check: Triggered EMERGENCY for ${currentConcern}`, 'Keshab Rout');
      return;
    }

    if (severity === 'Severe' || severity === 'Moderate' || trend === 'Getting worse') {
      setResultCategory('intermediate');
      storage.addToTriageQueue({
        patientId: 'RHB-OD-KLH-0941',
        patientName: 'Keshab Rout',
        age: 26,
        gender: 'Male',
        village: 'Kalahandi',
        symptoms: `${currentConcern} (${trend}, ${severity} severity)`,
        duration,
        warningSign: 'None',
        urgency: 'moderate',
        aiSummary: `Priority Review: Patient reported ${currentConcern} for ${duration} with ${severity.toLowerCase()} severity. Clinical review recommended.`
      });
      storage.addAuditLog(`Care Urgency Check: Evaluated as INTERMEDIATE for ${currentConcern}`, 'Keshab Rout');
      return;
    }

    setResultCategory('low');
    storage.saveRecord({
      patientId: 'RHB-OD-KLH-0941',
      type: 'symptom',
      symptoms: `${currentConcern} (${severity}, ${trend})`,
      duration,
      warningSign: 'None selected',
      pathway: 'routine care monitoring',
      urgency: 'routine',
      synced: true
    });
    storage.addAuditLog(`Care Urgency Check: Evaluated as ROUTINE for ${currentConcern}`, 'Keshab Rout');
  };

  const handleReset = () => {
    setResultCategory(null);
    setWarningSign('no');
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="urgency-check-title">
      <div className="modal-dialog" style={{ maxWidth: '680px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #071c42 0%, #0d3875 100%)',
          color: '#ffffff',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(25, 211, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 id="urgency-check-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                {t.modalTitle}
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                {t.modalSub}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Language toggle pills */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '2px',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}>
              {(['English', 'ଓଡ଼ିଆ', 'हिन्दी'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setActiveLang(l)}
                  style={{
                    background: activeLang === l ? '#38bdf8' : 'transparent',
                    color: activeLang === l ? '#071c42' : '#ffffff',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '3px 9px',
                    fontSize: '11px',
                    fontWeight: activeLang === l ? 800 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="btn"
              style={{ background: 'transparent', color: '#cbd5e1', border: 'none', padding: '6px', cursor: 'pointer' }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Screening Content */}
        <div style={{ padding: '20px', background: '#f8fafc', maxHeight: '74vh', overflowY: 'auto' }}>
          {!resultCategory ? (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: 800, color: '#071c42', display: 'block', marginBottom: '8px' }}>
                  {t.question1}
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SYMPTOM_OPTIONS.map((sym) => {
                    const label = activeLang === 'ଓଡ଼ିଆ' ? sym.or : activeLang === 'हिन्दी' ? sym.hi : sym.en;
                    const isSelected = selectedSymptom === sym.en;
                    return (
                      <button
                        key={sym.en}
                        type="button"
                        onClick={() => setSelectedSymptom(sym.en)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: isSelected ? 800 : 600,
                          cursor: 'pointer',
                          border: isSelected ? '2px solid #0284c7' : '1px solid #cbd5e1',
                          background: isSelected ? '#e0f2fe' : '#ffffff',
                          color: isSelected ? '#0369a1' : '#334155',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedSymptom === 'Other concern' && (
                <div className="field" style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>{t.customLabel}</label>
                  <input
                    type="text"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    placeholder={t.customPlaceholder}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              )}

              {/* Questions: Duration, Severity, Trend */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>{t.question2}</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="Today (under 24h)">{t.d1}</option>
                    <option value="2–3 days">{t.d2}</option>
                    <option value="1 week">{t.d3}</option>
                    <option value="More than a week">{t.d4}</option>
                  </select>
                </div>

                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>{t.question3}</label>
                  <select value={severity} onChange={(e) => setSeverity(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="Mild">{t.sMild}</option>
                    <option value="Moderate">{t.sMod}</option>
                    <option value="Severe">{t.sSev}</option>
                  </select>
                </div>

                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>{t.question4}</label>
                  <select value={trend} onChange={(e) => setTrend(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="Getting worse">{t.tWorse}</option>
                    <option value="Same">{t.tSame}</option>
                    <option value="Improving">{t.tBetter}</option>
                  </select>
                </div>
              </div>

              {/* Safety Warning Signs Selection */}
              <div className="field" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#b42318' }}>
                  {t.question5}
                </label>
                <select
                  value={warningSign}
                  onChange={(e) => setWarningSign(e.target.value as WarningSignId)}
                  style={{
                    width: '100%',
                    padding: '9px 10px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    borderColor: warningSign !== 'no' ? '#b42318' : '#cbd5e1',
                    background: warningSign !== 'no' ? '#fff5f5' : '#ffffff'
                  }}
                >
                  <option value="no">{t.wNo}</option>
                  <option value="breathing">{t.wBreathing}</option>
                  <option value="chest">{t.wChest}</option>
                  <option value="unconscious">{t.wUnconscious}</option>
                  <option value="bleeding">{t.wBleeding}</option>
                  <option value="stroke">{t.wStroke}</option>
                </select>
              </div>

              {/* Clinical Principle Notice */}
              <div style={{
                background: '#f0f9ff',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#0369a1',
                borderLeft: '3px solid #0284c7',
                marginBottom: '16px'
              }}>
                {t.principleNotice}
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEvaluate}
                style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: 800 }}
              >
                {t.evalBtn}
              </button>
            </div>
          ) : (
            /* Result Screen based on Category */
            <div>
              {resultCategory === 'emergency' && (
                <div style={{
                  background: '#fef2f2',
                  border: '2px solid #ef4444',
                  borderRadius: '12px',
                  padding: '20px',
                  color: '#991b1b'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <ShieldAlert size={28} color="#dc2626" />
                    <div>
                      <span className="badge badge-red" style={{ fontSize: '11px' }}>
                        {activeLang === 'ଓଡ଼ିଆ' ? 'ବର୍ଗ C — ଜରୁରୀକାଳୀନ (EMERGENCY)' : activeLang === 'हिन्दी' ? 'श्रेणी C — आपातकालीन (EMERGENCY)' : 'CATEGORY C — EMERGENCY'}
                      </span>
                      <h3 style={{ margin: '4px 0 0', color: '#7f1d1d', fontSize: '20px' }}>
                        {t.catETitle}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#7f1d1d' }}>
                    {t.catEDesc}
                  </p>

                  <div style={{ background: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #fecaca', margin: '14px 0', fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                    {t.catEActions}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a
                      href="tel:108"
                      className="btn btn-danger"
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}
                    >
                      <Phone size={16} /> {t.call108}
                    </a>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        onClose();
                        onNavigateToEmergency();
                      }}
                      style={{ background: '#ffffff', color: '#dc2626', borderColor: '#fca5a5' }}
                    >
                      {t.openEmergency}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleReset}
                      style={{ color: '#64748b' }}
                    >
                      {t.restartBtn}
                    </button>
                  </div>
                </div>
              )}

              {resultCategory === 'intermediate' && (
                <div style={{
                  background: '#fffbeb',
                  border: '2px solid #f59e0b',
                  borderRadius: '12px',
                  padding: '20px',
                  color: '#92400e'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <AlertTriangle size={28} color="#d97706" />
                    <div>
                      <span className="badge badge-amber" style={{ fontSize: '11px' }}>{t.catBBadge}</span>
                      <h3 style={{ margin: '4px 0 0', color: '#78350f', fontSize: '20px' }}>
                        {t.catBTitle}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#78350f' }}>
                    {t.catBDesc}
                  </p>

                  <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fde68a', margin: '14px 0', fontSize: '12px' }}>
                    {t.catBNotice}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        onClose();
                        onNavigateToQueue();
                      }}
                      style={{ fontWeight: 800 }}
                    >
                      <Clock size={16} /> {t.joinQueueBtn}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        onClose();
                        onNavigateToFacilities();
                      }}
                    >
                      <MapPin size={16} /> {t.findFacilityBtn}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleReset}
                    >
                      {t.recheckBtn}
                    </button>
                  </div>
                </div>
              )}

              {resultCategory === 'low' && (
                <div style={{
                  background: '#f0fdf4',
                  border: '2px solid #22c55e',
                  borderRadius: '12px',
                  padding: '20px',
                  color: '#166534'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <CheckCircle2 size={28} color="#16a34a" />
                    <div>
                      <span className="badge badge-green" style={{ fontSize: '11px' }}>{t.catABadge}</span>
                      <h3 style={{ margin: '4px 0 0', color: '#14532d', fontSize: '20px' }}>
                        {t.catATitle}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#166534', margin: '10px 0' }}>
                    {t.catADesc}
                  </p>

                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #bbf7d0', margin: '14px 0', fontSize: '12px', whiteSpace: 'pre-line' }}>
                    {t.catANotice}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        onClose();
                        onNavigateToQueue();
                      }}
                    >
                      <Calendar size={15} /> {t.bookRoutineBtn}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        alert(activeLang === 'ଓଡ଼ିଆ' ? 'ଆପଣଙ୍କ ଅଫଲାଇନ୍ ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡରେ ସାଇତାଗଲା!' : activeLang === 'हिन्दी' ? 'आपके ऑफलाइन स्वास्थ्य रिकॉर्ड में सहेज लिया गया!' : 'Symptom entry saved to your offline health notes log!');
                        onClose();
                      }}
                    >
                      <FileText size={15} /> {t.saveNoteBtn}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleReset}
                    >
                      {t.closeBtn}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
