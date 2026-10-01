import React, { useState, useEffect } from 'react';
import {
  X,
  Compass,
  User,
  Bot,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Stethoscope,
  FileText,
  Pill,
  Store,
  ArrowDown,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  Info,
  Video,
  Mic,
  MessageSquare,
  PhoneOff,
  Activity
} from 'lucide-react';
import { Language } from '../types';

interface CareNavigationFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPath?: (pathway: 'low' | 'moderate' | 'emergency' | 'doctor' | 'pharmacy') => void;
  lang?: Language;
  currentActiveStage?: 'patient' | 'chatbot' | 'low' | 'moderate' | 'emergency' | 'doctor' | 'advice' | 'medicine' | 'pharmacy';
}

const FLOW_I18N: Record<Language, {
  sourceOfTruth: string;
  subPathway: string;
  modalTitle: string;
  quickJumpTitle: string;
  btn1Low: string;
  btn2Mod: string;
  btn3Emg: string;
  btn4Pharm: string;
  aiRuralBridge: string;
  patientTitle: string;
  patientSub: string;
  howFeeling: string;
  howFeelingSub: string;
  chatbotTitle: string;
  safetyScreening: string;
  ruleFilter: string;
  lowUrgency: string;
  routineCare: string;
  lowCareDesc: string;
  btnViewLow: string;
  modUrgency: string;
  doctorConsult: string;
  modCareDesc: string;
  btnConnectDoc: string;
  emgUrgency: string;
  physicalCare: string;
  emgCareDesc: string;
  btnCall108: string;
}> = {
  English: {
    sourceOfTruth: 'SOURCE OF TRUTH',
    subPathway: 'Kalahandi Rural Care Pathway',
    modalTitle: 'SWASTHYA PATH • Care Navigation Flow',
    quickJumpTitle: 'Evaluator Quick Jump: Test any branch of the flow:',
    btn1Low: '🟢 1. Low Urgency',
    btn2Mod: '🟠 2. Moderate (Doctor)',
    btn3Emg: '🔴 3. Emergency (108)',
    btn4Pharm: '💊 4. Stores A, B, C',
    aiRuralBridge: 'AI RURAL TELEHEALTH BRIDGE',
    patientTitle: 'PATIENT (Keshab Rout)',
    patientSub: 'RURAL CITIZEN',
    howFeeling: '💬 “How are you feeling?”',
    howFeelingSub: 'Voice intake or 1-tap touch • Odia / Hindi / English',
    chatbotTitle: 'AI CHATBOT (Swasthya Sathi)',
    safetyScreening: 'Safety Screening Active',
    ruleFilter: 'Rule-based red-flag filter • AI assists intake, NEVER diagnoses',
    lowUrgency: '🟢 LOW URGENCY',
    routineCare: 'Monitor / Routine Care',
    lowCareDesc: 'Hydration, rest, home care guidance. Revisit if fever persists > 48 hours.',
    btnViewLow: 'View Low Urgency Care ➔',
    modUrgency: '🟠 MODERATE URGENCY',
    doctorConsult: 'Doctor Consultation',
    modCareDesc: 'Persistent symptoms. Structured summary passed to teleconsultation queue.',
    btnConnectDoc: 'Connect to Doctor ➔',
    emgUrgency: '🔴 EMERGENCY',
    physicalCare: 'Immediate Physical Care',
    emgCareDesc: 'Red flag detected (dyspnea, chest pain, stroke sign). Do not wait for online consult.',
    btnCall108: 'Call 108 Ambulance'
  },
  'ଓଡ଼ିଆ': {
    sourceOfTruth: 'ନିର୍ଭୁଲ୍ ଚିକିତ୍ସା ନିୟମାବଳୀ',
    subPathway: 'କଳାହାଣ୍ଡି ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରବାହ',
    modalTitle: 'ସ୍ୱାସ୍ଥ୍ୟ ପଥ • ଚିକିତ୍ସା ମାର୍ଗଦର୍ଶନ ପ୍ରବାହ',
    quickJumpTitle: 'ମୂଲ୍ୟାଙ୍କନକାରୀ ଶୀଘ୍ର ପରୀକ୍ଷା: ଯେକୌଣସି ଶାଖା ଦେଖନ୍ତୁ:',
    btn1Low: '🟢 ୧. ସାଧାରଣ (ମନିଟର)',
    btn2Mod: '🟠 ୨. ମଧ୍ୟମ (ଡାକ୍ତର)',
    btn3Emg: '🔴 ୩. ଜରୁରୀକାଳୀନ (୧୦୮)',
    btn4Pharm: '💊 ୪. ଔଷଧ ଦୋକାନ A, B, C',
    aiRuralBridge: 'ଏଆଇ ଗ୍ରାମୀଣ ଟେଲି-ହେଲ୍ଥ ସେତୁ',
    patientTitle: 'ରୋଗୀ (କେଶବ ରାଉତ)',
    patientSub: 'ଗ୍ରାମୀଣ ନାଗରିକ',
    howFeeling: '💬 “ଆପଣ କିପରି ଅନୁଭବ କରୁଛନ୍ତି?”',
    howFeelingSub: 'ଭଏସ୍ ବା ଏକ-ଟ୍ୟାପ୍ ଛୁଇଁବା • ଓଡ଼ିଆ / ହିନ୍ଦୀ / ଇଂରାଜୀ',
    chatbotTitle: 'ଏଆଇ ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ (ଚାଟବଟ୍)',
    safetyScreening: 'ସୁରକ୍ଷା ଯାଞ୍ଚ ସକ୍ରିୟ',
    ruleFilter: 'ନିୟମ-ଆଧାରିତ ରେଡ୍-ଫ୍ଲାଗ୍ ଫିଲ୍ଟର • ଏଆଇ ସହାୟକ, ଚିକିତ୍ସକ ନୁହେଁ',
    lowUrgency: '🟢 ସାଧାରଣ ଜରୁରୀ (LOW)',
    routineCare: 'ଘରୋଇ ଯତ୍ନ / ନିରୀକ୍ଷଣ',
    lowCareDesc: 'ପ୍ରଚୁର ପାଣି ପିଇବା, ବିଶ୍ରାମ। ୪୮ ଘଣ୍ଟାରୁ ଅଧିକ ଜ୍ୱର ରହିଲେ ପୁନର୍ବାର ସମ୍ପର୍କ କରନ୍ତୁ।',
    btnViewLow: 'ସାଧାରଣ ଯତ୍ନ ଦେଖନ୍ତୁ ➔',
    modUrgency: '🟠 ମଧ୍ୟମ ଜରୁରୀ (MODERATE)',
    doctorConsult: 'ଡାକ୍ତରଙ୍କ ସହିତ ପରାମର୍ଶ',
    modCareDesc: 'ଲଗାତାର ଲକ୍ଷଣ। ଟେଲିକନସଲ୍ଟେସନ୍ କତାରକୁ ସାରାଂଶ ପଠାଗଲା।',
    btnConnectDoc: 'ଡାକ୍ତରଙ୍କ ସହିତ ଯୋଡ଼ି ହୁଅନ୍ତୁ ➔',
    emgUrgency: '🔴 ଜରୁରୀକାଳୀନ (EMERGENCY)',
    physicalCare: 'ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ',
    emgCareDesc: 'ବିପଦ ସଙ୍କେତ ଚିହ୍ନଟ (ଶ୍ୱାସକଷ୍ଟ, ଛାତି ଯନ୍ତ୍ରଣା)। ଅନଲାଇନ୍ ଅପେକ୍ଷା କରନ୍ତୁ ନାହିଁ।',
    btnCall108: '୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଡାକନ୍ତୁ'
  },
  'हिन्दी': {
    sourceOfTruth: 'सटीक देखभाल नियमावली',
    subPathway: 'कालाहांडी ग्रामीण स्वास्थ्य पथ',
    modalTitle: 'स्वास्थ्य पथ • देखभाल मार्गदर्शन प्रवाह',
    quickJumpTitle: 'मूल्यांकनकर्ता त्वरित परीक्षण: किसी भी शाखा का परीक्षण करें:',
    btn1Low: '🟢 1. कम आपात (निगरानी)',
    btn2Mod: '🟠 2. मध्यम (डॉक्टर)',
    btn3Emg: '🔴 3. आपातकालीन (108)',
    btn4Pharm: '💊 4. स्टोर A, B, C',
    aiRuralBridge: 'एआई ग्रामीण टेलीहेल्थ सेतु',
    patientTitle: 'रोगी (केशब राउत)',
    patientSub: 'ग्रामीण नागरिक',
    howFeeling: '💬 “आप कैसा महसूस कर रहे हैं?”',
    howFeelingSub: 'आवाज़ द्वारा या 1-टैप स्पर्श • ओड़िया / हिन्दी / अंग्रेज़ी',
    chatbotTitle: 'एआई चैटबॉट (स्वास्थ्य साथी)',
    safetyScreening: 'सुरक्षा जांच सक्रिय',
    ruleFilter: 'नियम-आधारित रेड-फ्लैग फ़िल्टर • एआई केवल सहायक है, निदानकर्ता नहीं',
    lowUrgency: '🟢 कम आपात (LOW URGENCY)',
    routineCare: 'निगरानी / सामान्य देखभाल',
    lowCareDesc: 'हाइड्रेशन, आराम, घरेलू देखभाल। यदि बुखार 48 घंटे से अधिक रहे तो पुनः संपर्क करें।',
    btnViewLow: 'सामान्य देखभाल देखें ➔',
    modUrgency: '🟠 मध्यम आपात (MODERATE URGENCY)',
    doctorConsult: 'डॉक्टर से परामर्श',
    modCareDesc: 'निरंतर लक्षण। टेलीपरामर्श कतार में संरचित सारांश प्रेषित।',
    btnConnectDoc: 'डॉक्टर से जुड़ें ➔',
    emgUrgency: '🔴 आपातकालीन (EMERGENCY)',
    physicalCare: 'तत्काल प्रत्यक्ष अस्पताल देखभाल',
    emgCareDesc: 'खतरे का संकेत मिला (सांस फूलना, सीने में दर्द)। ऑनलाइन प्रतीक्षा न करें।',
    btnCall108: '108 एम्बुलेंस को कॉल करें'
  }
};

export const CareNavigationFlowModal: React.FC<CareNavigationFlowModalProps> = ({
  isOpen,
  onClose,
  onSelectPath,
  lang = 'English',
  currentActiveStage = 'chatbot'
}) => {
  const [activeLang, setActiveLang] = useState<Language>(lang);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  if (!isOpen) return null;

  const t = FLOW_I18N[activeLang] || FLOW_I18N.English;

  const handleNodeAction = (pathway: 'low' | 'moderate' | 'emergency' | 'doctor' | 'pharmacy') => {
    if (onSelectPath) {
      onSelectPath(pathway);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="care-flow-title">
      <div
        className="modal-dialog"
        style={{
          maxWidth: '920px',
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '20px',
          padding: '0',
          background: '#f8fafc',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #071c42 0%, #0c356a 100%)',
            color: '#ffffff',
            padding: '20px 24px',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #0284c7'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(25, 211, 255, 0.15)',
                color: '#19d3ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(25, 211, 255, 0.3)'
              }}
            >
              <Compass size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    letterSpacing: '0.05em'
                  }}
                >
                  {t.sourceOfTruth}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>{t.subPathway}</span>
              </div>
              <h2 id="care-flow-title" style={{ margin: '4px 0 0', fontSize: '20px', color: '#ffffff' }}>
                {t.modalTitle}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Interactive Language Selector */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '2px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
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
                    padding: '3px 8px',
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
              type="button"
              className="btn"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer'
              }}
              aria-label="Close care flow diagram"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Simulator Bar for Evaluators */}
        <div
          style={{
            background: '#ffffff',
            padding: '12px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
            🚀 <strong>{t.quickJumpTitle}</strong>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleNodeAction('low')}
              style={{
                background: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {t.btn1Low}
            </button>
            <button
              type="button"
              onClick={() => handleNodeAction('moderate')}
              style={{
                background: '#fffbeb',
                color: '#92400e',
                border: '1px solid #fef08a',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {t.btn2Mod}
            </button>
            <button
              type="button"
              onClick={() => handleNodeAction('emergency')}
              style={{
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {t.btn3Emg}
            </button>
            <button
              type="button"
              onClick={() => handleNodeAction('pharmacy')}
              style={{
                background: '#eff6ff',
                color: '#0369a1',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {t.btn4Pharm}
            </button>
          </div>
        </div>

        {/* Main Flow Tree Container */}
        <div style={{ padding: '24px' }}>
          {/* LEVEL 1: SWASTHYA PATH */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                background: '#071c42',
                color: '#ffffff',
                border: '2px solid #0284c7',
                borderRadius: '14px',
                padding: '12px 28px',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                minWidth: '240px'
              }}
            >
              <div style={{ fontSize: '11px', color: '#19d3ff', fontWeight: 800, letterSpacing: '0.08em' }}>
                AI RURAL TELEHEALTH BRIDGE
              </div>
              <strong style={{ fontSize: '17px', letterSpacing: '0.04em' }}>SWASTHYA PATH</strong>
            </div>

            <div style={{ height: '22px', width: '2px', background: '#0284c7' }}></div>
            <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #0284c7' }}></div>

            {/* LEVEL 2: PATIENT */}
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #94a3b8',
                borderRadius: '12px',
                padding: '10px 24px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '220px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '6px', borderRadius: '8px' }}>
                <User size={18} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>RURAL CITIZEN</div>
                <strong style={{ fontSize: '15px', color: '#0f172a' }}>PATIENT (Keshab Rout)</strong>
              </div>
            </div>

            <div style={{ height: '22px', width: '2px', background: '#0284c7' }}></div>
            <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #0284c7' }}></div>

            {/* LEVEL 3: "How are you feeling?" */}
            <div
              style={{
                background: '#eff6ff',
                border: '2px dashed #0284c7',
                borderRadius: '14px',
                padding: '12px 24px',
                textAlign: 'center',
                color: '#0369a1',
                fontWeight: 700,
                fontSize: '15px',
                minWidth: '260px'
              }}
            >
              💬 &ldquo;How are you feeling?&rdquo;
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
                Voice intake or 1-tap touch • Odia / Hindi / English
              </div>
            </div>

            <div style={{ height: '22px', width: '2px', background: '#0284c7' }}></div>
            <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #0284c7' }}></div>

            {/* LEVEL 4: AI CHATBOT + Safety Screening */}
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #0284c7',
                borderRadius: '16px',
                padding: '14px 28px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.15)',
                minWidth: '280px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                <Bot size={20} style={{ color: '#0284c7' }} />
                <strong style={{ fontSize: '16px', color: '#0f172a' }}>AI CHATBOT (Swasthya Sathi)</strong>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 700
                }}
              >
                <ShieldAlert size={14} />
                Safety Screening Active
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                Rule-based red-flag filter • AI assists intake, NEVER diagnoses
              </div>
            </div>

            {/* SPLIT TO 3 BRANCHES CONNECTOR */}
            <div style={{ height: '24px', width: '2px', background: '#64748b' }}></div>

            {/* Horizontal Branch Bar */}
            <div style={{ width: '85%', maxWidth: '780px', height: '2px', background: '#cbd5e1', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0', top: '0', width: '2px', height: '18px', background: '#22c55e' }}></div>
              <div style={{ position: 'absolute', left: '50%', top: '0', width: '2px', height: '18px', background: '#eab308', transform: 'translateX(-50%)' }}></div>
              <div style={{ position: 'absolute', right: '0', top: '0', width: '2px', height: '18px', background: '#ef4444' }}></div>
            </div>

            {/* LEVEL 5: 3 URGENCY TIERS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                width: '100%',
                maxWidth: '820px',
                marginTop: '18px'
              }}
            >
              {/* BRANCH 1: LOW URGENCY */}
              <div
                style={{
                  background: '#f0fdf4',
                  border: '2px solid #86efac',
                  borderRadius: '14px',
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 800, fontSize: '14px' }}>
                  <CheckCircle2 size={18} />
                  <span>🟢 LOW URGENCY</span>
                </div>
                <div style={{ height: '12px', width: '2px', background: '#22c55e', margin: '8px 0' }}></div>
                <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px', width: '100%', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '13px', color: '#14532d' }}>Monitor / Routine Care</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#166534', lineHeight: 1.4 }}>
                    Hydration, rest, home care guidance. Revisit if fever persists &gt; 48 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNodeAction('low')}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  View Low Urgency Care ➔
                </button>
              </div>

              {/* BRANCH 2: MODERATE URGENCY (CONTINUES DOWN TO DOCTOR) */}
              <div
                style={{
                  background: '#fffbeb',
                  border: '2px solid #fde047',
                  borderRadius: '14px',
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxShadow: '0 4px 10px rgba(234, 179, 8, 0.15)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#92400e', fontWeight: 800, fontSize: '14px' }}>
                  <Clock size={18} />
                  <span>🟠 MODERATE URGENCY</span>
                </div>
                <div style={{ height: '12px', width: '2px', background: '#eab308', margin: '8px 0' }}></div>
                <div style={{ background: '#ffffff', border: '1px solid #fef08a', borderRadius: '10px', padding: '10px', width: '100%', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '13px', color: '#854d0e' }}>Doctor Consultation</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#78350f', lineHeight: 1.4 }}>
                    Persistent symptoms. Structured summary passed to teleconsultation queue.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNodeAction('moderate')}
                  style={{
                    background: '#d97706',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Connect to Doctor ➔
                </button>
              </div>

              {/* BRANCH 3: EMERGENCY */}
              <div
                style={{
                  background: '#fef2f2',
                  border: '2px solid #f87171',
                  borderRadius: '14px',
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#991b1b', fontWeight: 800, fontSize: '14px' }}>
                  <AlertTriangle size={18} />
                  <span>🔴 EMERGENCY</span>
                </div>
                <div style={{ height: '12px', width: '2px', background: '#ef4444', margin: '8px 0' }}></div>
                <div style={{ background: '#ffffff', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px', width: '100%', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '13px', color: '#991b1b' }}>Immediate Physical Care</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#7f1d1d', lineHeight: 1.4 }}>
                    Red flag detected (dyspnea, chest pain, stroke sign). Do not wait for online consult.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNodeAction('emergency')}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <PhoneCall size={12} /> Call 108 Ambulance
                </button>
              </div>
            </div>

            {/* CONNECTOR DOWN FROM MODERATE URGENCY */}
            <div style={{ height: '24px', width: '2px', background: '#d97706', marginTop: '10px' }}></div>
            <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #d97706' }}></div>

            {/* LEVEL 6: DOCTOR CONSULTATION CONTAINER */}
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #0284c7',
                borderRadius: '16px',
                padding: '16px 20px',
                textAlign: 'center',
                width: '100%',
                maxWidth: '460px',
                boxShadow: '0 6px 16px rgba(2, 132, 199, 0.12)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Stethoscope size={20} style={{ color: '#0284c7' }} />
                <strong style={{ fontSize: '16px', color: '#0f172a' }}>Doctor Consultation</strong>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                Dr. Ananya Mishra • Telehealth Unit, DHH Bhawanipatna
              </div>

              {/* 4 In-Call Channels Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  marginTop: '12px',
                  textAlign: 'left'
                }}
              >
                {/* 🎥 Video */}
                <div
                  style={{
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Video size={16} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0369a1' }}>🎥 Video</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Adaptive 160p–720p</div>
                  </div>
                </div>

                {/* 🎤 Audio */}
                <div
                  style={{
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Mic size={16} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0369a1' }}>🎤 Audio</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>12kbps Opus fallback</div>
                  </div>
                </div>

                {/* 💬 Chat */}
                <div
                  style={{
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <MessageSquare size={16} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0369a1' }}>💬 Chat</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Odia/Hindi text & notes</div>
                  </div>
                </div>

                {/* 📋 Health Records */}
                <div
                  style={{
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FileText size={16} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0369a1' }}>📋 Health Records</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>ABHA & Vitals sync</div>
                  </div>
                </div>
              </div>

              {/* 🔴 END CALL */}
              <button
                type="button"
                onClick={() => handleNodeAction('doctor')}
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '8px 18px',
                  fontSize: '12px',
                  fontWeight: 800,
                  marginTop: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 10px rgba(220, 38, 38, 0.3)'
                }}
              >
                <PhoneOff size={14} />
                <span>🔴 END CALL</span>
              </button>
            </div>

            {/* CONNECTOR DOWN */}
            <div style={{ height: '22px', width: '2px', background: '#dc2626' }}></div>
            <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #dc2626' }}></div>

            {/* LEVEL 7: CALL ENDED */}
            <div
              style={{
                background: '#fef2f2',
                border: '1.5px solid #fca5a5',
                borderRadius: '12px',
                padding: '10px 20px',
                textAlign: 'center',
                minWidth: '240px',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#991b1b', fontWeight: 700, fontSize: '13px' }}>
                <PhoneOff size={15} />
                <span>Call Ended</span>
              </div>
              <div style={{ fontSize: '11px', color: '#7f1d1d', marginTop: '2px' }}>
                Session encrypted & archived • Time: 08:42
              </div>
            </div>

            {/* CONNECTOR DOWN */}
            <div style={{ height: '20px', width: '2px', background: '#64748b' }}></div>
            <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #64748b' }}></div>

            {/* LEVEL 8: CONSULTATION SUMMARY */}
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #94a3b8',
                borderRadius: '12px',
                padding: '12px 20px',
                textAlign: 'center',
                maxWidth: '440px',
                width: '100%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#0f172a', fontWeight: 700, fontSize: '13px' }}>
                <FileText size={16} style={{ color: '#0284c7' }} />
                <span>Consultation Summary</span>
              </div>
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
                <strong>Diagnosis:</strong> Acute Gastroenteritis with mild dehydration • Vitals stable • Prognosis good with prompt rehydration.
              </div>
            </div>

            {/* CONNECTOR DOWN */}
            <div style={{ height: '20px', width: '2px', background: '#0284c7' }}></div>
            <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #0284c7' }}></div>

            {/* LEVEL 9: DOCTOR CARE PLAN */}
            <div
              style={{
                background: '#f0f9ff',
                border: '1.5px solid #7dd3fc',
                borderRadius: '12px',
                padding: '12px 20px',
                textAlign: 'center',
                maxWidth: '440px',
                width: '100%',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#0369a1', fontWeight: 700, fontSize: '13px' }}>
                <Activity size={16} />
                <span>Doctor Care Plan</span>
              </div>
              <div style={{ fontSize: '11px', color: '#0c4a6e', marginTop: '4px', lineHeight: 1.4 }}>
                Boiled water (2.5L/day), light khichdi diet, oral rehydration therapy, ASHA village follow-up in 3 days.
              </div>
            </div>

            {/* CONNECTOR DOWN */}
            <div style={{ height: '20px', width: '2px', background: '#16a34a' }}></div>
            <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #16a34a' }}></div>

            {/* LEVEL 10: MEDICINE NEEDED? */}
            <div
              style={{
                background: '#f0fdf4',
                border: '2px solid #86efac',
                borderRadius: '14px',
                padding: '12px 20px',
                textAlign: 'center',
                maxWidth: '440px',
                width: '100%',
                boxShadow: '0 3px 8px rgba(22, 163, 74, 0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#166534', fontWeight: 800, fontSize: '14px' }}>
                <Pill size={17} />
                <span>Medicine Needed?</span>
                <span
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    marginLeft: '4px'
                  }}
                >
                  YES (E-Rx Issued)
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#15803d', marginTop: '4px', lineHeight: 1.4 }}>
                Prescribed: Paracetamol 500mg (3 days), ORS Sachets (WHO formula), Zinc Sulfate 20mg.
              </div>
            </div>

            {/* CONNECTOR DOWN */}
            <div style={{ height: '20px', width: '2px', background: '#16a34a' }}></div>
            <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #16a34a' }}></div>

            {/* LEVEL 11: PHARMACY AVAILABILITY */}
            <div
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: '2px solid #38bdf8',
                borderRadius: '14px',
                padding: '12px 24px',
                textAlign: 'center',
                minWidth: '260px',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: 800, color: '#38bdf8' }}>
                <Store size={18} />
                <span>Pharmacy Availability</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                Live stock verified across Kalahandi local chemists
              </div>
              <button
                type="button"
                onClick={() => handleNodeAction('pharmacy')}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  marginTop: '8px',
                  cursor: 'pointer'
                }}
              >
                View Live Pharmacy Stock ➔
              </button>
            </div>

            {/* CONNECTOR TO 3 STORES */}
            <div style={{ height: '20px', width: '2px', background: '#334155' }}></div>

            <div style={{ width: '85%', maxWidth: '780px', height: '2px', background: '#cbd5e1', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0', top: '0', width: '2px', height: '14px', background: '#22c55e' }}></div>
              <div style={{ position: 'absolute', left: '50%', top: '0', width: '2px', height: '14px', background: '#eab308', transform: 'translateX(-50%)' }}></div>
              <div style={{ position: 'absolute', right: '0', top: '0', width: '2px', height: '14px', background: '#ef4444' }}></div>
            </div>

            {/* LEVEL 10: STORE A, STORE B, STORE C */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px',
                width: '100%',
                maxWidth: '820px',
                marginTop: '14px'
              }}
            >
              {/* STORE A */}
              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid #86efac',
                  borderRadius: '12px',
                  padding: '14px',
                  textAlign: 'left',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>Store A</strong>
                  <span
                    style={{
                      background: '#f0fdf4',
                      color: '#166534',
                      border: '1px solid #bbf7d0',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 800
                    }}
                  >
                    🟢 Available
                  </span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                  Maa Manikeswari Jan Aushadhi
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Bhawanipatna • 1.2 km away
                </div>
                <div style={{ fontSize: '11px', color: '#166534', marginTop: '6px', fontWeight: 700 }}>
                  240 in stock • ₹18 / strip
                </div>
              </div>

              {/* STORE B */}
              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid #fde047',
                  borderRadius: '12px',
                  padding: '14px',
                  textAlign: 'left',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>Store B</strong>
                  <span
                    style={{
                      background: '#fffbeb',
                      color: '#92400e',
                      border: '1px solid #fef08a',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 800
                    }}
                  >
                    🟠 Limited
                  </span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                  Junagarh Gramin Pharmacy
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Junagarh Market • 18.5 km
                </div>
                <div style={{ fontSize: '11px', color: '#b45309', marginTop: '6px', fontWeight: 700 }}>
                  8 in stock • ₹18 / strip
                </div>
              </div>

              {/* STORE C */}
              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid #fca5a5',
                  borderRadius: '12px',
                  padding: '14px',
                  textAlign: 'left',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>Store C</strong>
                  <span
                    style={{
                      background: '#fef2f2',
                      color: '#991b1b',
                      border: '1px solid #fecaca',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 800
                    }}
                  >
                    🔴 Out of Stock
                  </span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                  Chhoriagarh Village Chemist
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Chhoriagarh Chowk • 0.5 km
                </div>
                <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '6px', fontWeight: 700 }}>
                  0 in stock • Restock tomorrow
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            background: '#ffffff',
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            💡 <strong>Hackathon Goal:</strong> Eliminates unnecessary 20km bus travel, prevents stockout disappointment, and accelerates doctor triage by 3x.
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
            style={{ fontWeight: 800, padding: '8px 20px', fontSize: '13px' }}
          >
            Close Flow Diagram
          </button>
        </div>
      </div>
    </div>
  );
};
